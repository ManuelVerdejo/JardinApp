import * as XLSX from 'xlsx';
import type { Planta, Riego } from '../db/database';
import { db } from '../db/database';
import { plantasIniciales } from '../data/seedData';

// ================= UTILIDADES DE FECHAS =================

export function formatDateDDMMYY(dateInput: string | Date): string {
  if (!dateInput) return '-';
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-');
    return `${d}/${m}/${y.slice(-2)}`;
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function parseDateToISO(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];

  // Número de serie de fecha de Excel
  if (typeof val === 'number') {
    if (XLSX.SSF?.parse_date_code) {
      const parsed = XLSX.SSF.parse_date_code(val);
      if (parsed && parsed.y && parsed.m && parsed.d) {
        return `${parsed.y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
      }
    }
    // Fallback para fecha serial Excel (días desde 1899-12-30)
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + val * 86400000);
    return date.toISOString().split('T')[0];
  }

  const str = String(val).trim();

  // Ya está en formato ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Formato DD/MM/YY o DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    let year = dmyMatch[3];
    if (year.length === 2) {
      year = `20${year}`;
    }
    return `${year}-${month}-${day}`;
  }

  // Intento con Date estándar
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

export function diffInDays(d1: Date | string, d2: Date | string): number {
  let y1: number, m1: number, day1: number;
  let y2: number, m2: number, day2: number;

  if (typeof d1 === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d1)) {
    [y1, m1, day1] = d1.split('-').map(Number);
  } else {
    const dt = typeof d1 === 'string' ? new Date(d1) : d1;
    y1 = dt.getFullYear();
    m1 = dt.getMonth() + 1;
    day1 = dt.getDate();
  }

  if (typeof d2 === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d2)) {
    [y2, m2, day2] = d2.split('-').map(Number);
  } else {
    const dt = typeof d2 === 'string' ? new Date(d2) : d2;
    y2 = dt.getFullYear();
    m2 = dt.getMonth() + 1;
    day2 = dt.getDate();
  }

  const utc1 = Date.UTC(y1, m1 - 1, day1);
  const utc2 = Date.UTC(y2, m2 - 1, day2);
  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
}

export function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, '0');
  const resD = String(date.getDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
}

// ================= CONSTRUCCIÓN DEL FORMATO SOLICITADO =================

export interface SpreadsheetDataResult {
  matrix: (string | number)[][];
  csvContent: string;
}

export function buildSpreadsheetData(
  plantas: Planta[],
  riegos: Riego[],
  refDateInput?: Date | string
): SpreadsheetDataResult {
  // Fecha de referencia para "Días restantes" (por defecto hoy a medianoche)
  const refDate = refDateInput 
    ? (typeof refDateInput === 'string' ? new Date(refDateInput + 'T00:00:00') : refDateInput)
    : new Date();

  // Mapa rápido de plantas por nombre normalizado (lowercase)
  const plantMap = new Map<string, Planta>();
  plantas.forEach(p => {
    plantMap.set(p.nombre.trim().toLowerCase(), p);
  });

  // Lista de todos los nombres únicos de plantas (tanto en plantas como en riegos)
  const uniquePlantNamesSet = new Set<string>();
  plantas.forEach(p => uniquePlantNamesSet.add(p.nombre.trim()));
  riegos.forEach(r => uniquePlantNamesSet.add(r.planta_nombre.trim()));

  const sortedPlantNames = Array.from(uniquePlantNamesSet).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );

  // Ordenar riegos cronológicamente ascendente (y por id como desempate)
  const sortedRiegos = [...riegos].sort((a, b) => {
    const cmp = a.fecha.localeCompare(b.fecha);
    if (cmp !== 0) return cmp;
    return (a.id || 0) - (b.id || 0);
  });

  // 1. Construir filas de la Tabla 1 (Izquierda: Historial de Riegos)
  // Columnas: Planta, Tipo, Cantidad, Aplicación, Días desde último riego, Días recomendados
  const ultimoRiegoHistoricoMap = new Map<string, string>(); // planta -> fecha ISO anterior
  const table1Rows: (string | number)[][] = [];

  for (const r of sortedRiegos) {
    const plantaNorm = r.planta_nombre.trim().toLowerCase();
    const plantaObj = plantMap.get(plantaNorm);
    const fechaISO = r.fecha;

    let diasDesdeUltimo: string | number = '-';
    if (ultimoRiegoHistoricoMap.has(plantaNorm)) {
      const fechaAnterior = ultimoRiegoHistoricoMap.get(plantaNorm)!;
      diasDesdeUltimo = diffInDays(fechaISO, fechaAnterior);
    }
    ultimoRiegoHistoricoMap.set(plantaNorm, fechaISO);

    const diasRecomendados = plantaObj ? plantaObj.frecuencia_riego_dias : 2;

    table1Rows.push([
      r.planta_nombre,
      r.tipo || 'Agua',
      r.cantidad || 'Normal',
      formatDateDDMMYY(fechaISO),
      diasDesdeUltimo,
      diasRecomendados,
    ]);
  }

  // 2. Construir filas de la Tabla 2 (Derecha: Resumen por Planta)
  // Columnas: Planta, Último riego, Próximo riego, Días restantes
  const table2Rows: (string | number)[][] = [];

  for (const plantName of sortedPlantNames) {
    const plantaNorm = plantName.toLowerCase();
    const plantaObj = plantMap.get(plantaNorm);
    const frecuencia = plantaObj ? plantaObj.frecuencia_riego_dias : 2;

    // Obtener todos los riegos de esta planta ordenados por fecha
    const riegosPlanta = sortedRiegos.filter(
      r => r.planta_nombre.trim().toLowerCase() === plantaNorm
    );

    let ultimoRiegoFormatted = '-';
    let proximoRiegoFormatted = '-';
    let diasRestantes: string | number = '-';

    if (riegosPlanta.length > 0) {
      const ultimoRiegoISO = riegosPlanta[riegosPlanta.length - 1].fecha;
      ultimoRiegoFormatted = formatDateDDMMYY(ultimoRiegoISO);

      const proximoRiegoISO = addDaysToDate(ultimoRiegoISO, frecuencia);
      proximoRiegoFormatted = formatDateDDMMYY(proximoRiegoISO);

      diasRestantes = diffInDays(proximoRiegoISO, refDate);
    }

    table2Rows.push([
      plantName,
      ultimoRiegoFormatted,
      proximoRiegoFormatted,
      diasRestantes,
    ]);
  }

  // 3. Unir ambas tablas en una matriz única de 11 columnas
  // Cabecera:
  // [Planta, Tipo, Cantidad, Aplicación, Días desde último riego, Días recomendados, '', Planta, Último riego, Próximo riego, Días restantes]
  const headers = [
    'Planta',
    'Tipo',
    'Cantidad',
    'Aplicación',
    'Días desde último riego',
    'Días recomendados',
    '',
    'Planta',
    'Último riego',
    'Próximo riego',
    'Días restantes',
  ];

  const matrix: (string | number)[][] = [headers];
  const maxRows = Math.max(table1Rows.length, table2Rows.length);

  for (let i = 0; i < maxRows; i++) {
    const leftPart = i < table1Rows.length ? table1Rows[i] : ['', '', '', '', '', ''];
    const separator = '';
    const rightPart = i < table2Rows.length ? table2Rows[i] : ['', '', '', ''];

    matrix.push([...leftPart, separator, ...rightPart]);
  }

  // Generar contenido CSV con formato exacto
  const csvLines: string[] = [];
  for (const row of matrix) {
    const escapedRow = row.map(val => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvLines.push(escapedRow.join(','));
  }

  // Añadimos BOM UTF-8 (\uFEFF) para que Excel en Windows abra correctamente los acentos
  const csvContent = '\uFEFF' + csvLines.join('\n');

  return { matrix, csvContent };
}

// ================= EXPORTACIÓN A CSV Y EXCEL =================

export function exportToCsv(
  plantas: Planta[],
  riegos: Riego[],
  filename = `huerto_riegos_${new Date().toISOString().split('T')[0]}.csv`
): void {
  const { csvContent } = buildSpreadsheetData(plantas, riegos);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToExcel(
  plantas: Planta[],
  riegos: Riego[],
  filename = `huerto_riegos_${new Date().toISOString().split('T')[0]}.xlsx`
): void {
  const { matrix } = buildSpreadsheetData(plantas, riegos);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(matrix);

  // Configurar anchos de columna agradables para lectura
  ws['!cols'] = [
    { wch: 22 }, // Planta (historial)
    { wch: 14 }, // Tipo
    { wch: 12 }, // Cantidad
    { wch: 14 }, // Aplicación
    { wch: 24 }, // Días desde último riego
    { wch: 18 }, // Días recomendados
    { wch: 4 },  // Separador vacío
    { wch: 22 }, // Planta (resumen)
    { wch: 14 }, // Último riego
    { wch: 14 }, // Próximo riego
    { wch: 14 }, // Días restantes
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Riegos y Estado');

  // Escribir y descargar archivo Excel binario
  XLSX.writeFile(wb, filename);
}

// ================= IMPORTACIÓN DESDE CSV / EXCEL =================

export interface ParsedSpreadsheetResult {
  plantas: {
    nombre: string;
    frecuencia_riego_dias?: number;
  }[];
  riegos: {
    planta_nombre: string;
    tipo: string;
    cantidad: string;
    fecha: string; // ISO YYYY-MM-DD
  }[];
}

// Parseador robusto de texto CSV (respeta comillas y saltos de línea dentro de campos)
export function parseCSVText(csvText: string): (string | number)[][] {
  // Eliminar BOM si existe
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Salta la comilla escapada
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',' || char === ';') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // Ignora CR si va seguido de LF
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

export function parseSpreadsheetMatrix(matrix: (string | number)[][]): ParsedSpreadsheetResult {
  if (!matrix || matrix.length < 2) {
    return { plantas: [], riegos: [] };
  }

  const headerRow = matrix[0].map(c => String(c ?? '').trim().toLowerCase());

  // Buscar índices de las columnas de la Tabla 1 (Izquierda)
  let colPlanta1 = 0;
  let colTipo = 1;
  let colCantidad = 2;
  let colAplicacion = 3;
  let colDiasRec = 5;

  // Buscar índices de las columnas de la Tabla 2 (Derecha)
  let colPlanta2 = 7;
  let colUltimo = 8;
  let colProximo = 9;

  // Detección automática por nombres de cabecera si están presentes
  headerRow.forEach((colName, idx) => {
    if (colName === 'planta' && idx < 6) colPlanta1 = idx;
    else if (colName === 'tipo') colTipo = idx;
    else if (colName === 'cantidad') colCantidad = idx;
    else if (colName.includes('aplicaci')) colAplicacion = idx;
    else if (colName.includes('recomendado')) colDiasRec = idx;
    else if (colName === 'planta' && idx >= 6) colPlanta2 = idx;
    else if (colName.includes('último') || colName.includes('ultimo')) colUltimo = idx;
    else if (colName.includes('próximo') || colName.includes('proximo')) colProximo = idx;
  });

  const plantasMap = new Map<string, { nombre: string; frecuencia_riego_dias?: number }>();
  const riegos: { planta_nombre: string; tipo: string; cantidad: string; fecha: string }[] = [];

  // Procesar filas de datos a partir de la fila 1
  for (let r = 1; r < matrix.length; r++) {
    const row = matrix[r];
    if (!row || row.length === 0) continue;

    // Procesar Tabla 1 (Riegos)
    const plant1Name = String(row[colPlanta1] ?? '').trim();
    const aplicacionRaw = row[colAplicacion];

    if (plant1Name && aplicacionRaw !== undefined && String(aplicacionRaw).trim() !== '') {
      const tipo = String(row[colTipo] ?? '').trim() || 'Agua';
      const cantidad = String(row[colCantidad] ?? '').trim() || 'Normal';
      const fechaISO = parseDateToISO(aplicacionRaw);

      riegos.push({
        planta_nombre: plant1Name,
        tipo,
        cantidad,
        fecha: fechaISO,
      });

      // Registrar planta y su recomendación si viene en la columna 5
      const recDaysRaw = row[colDiasRec];
      const recDays = typeof recDaysRaw === 'number' ? recDaysRaw : parseInt(String(recDaysRaw ?? ''), 10);

      const norm = plant1Name.toLowerCase();
      if (!plantasMap.has(norm)) {
        plantasMap.set(norm, {
          nombre: plant1Name,
          frecuencia_riego_dias: !isNaN(recDays) && recDays > 0 ? recDays : undefined,
        });
      } else if (!isNaN(recDays) && recDays > 0) {
        plantasMap.get(norm)!.frecuencia_riego_dias = recDays;
      }
    }

    // Procesar Tabla 2 (Plantas del resumen)
    if (colPlanta2 < row.length) {
      const plant2Name = String(row[colPlanta2] ?? '').trim();
      if (plant2Name) {
        const norm = plant2Name.toLowerCase();
        let freqCalculada: number | undefined;

        // Si tenemos último riego y próximo riego, podemos deducir la frecuencia
        const ultRaw = row[colUltimo];
        const proxRaw = row[colProximo];
        if (ultRaw && proxRaw && String(ultRaw).trim() !== '-' && String(proxRaw).trim() !== '-') {
          const ultISO = parseDateToISO(ultRaw);
          const proxISO = parseDateToISO(proxRaw);
          const diff = diffInDays(proxISO, ultISO);
          if (diff > 0) freqCalculada = diff;
        }

        if (!plantasMap.has(norm)) {
          plantasMap.set(norm, {
            nombre: plant2Name,
            frecuencia_riego_dias: freqCalculada,
          });
        } else if (freqCalculada && !plantasMap.get(norm)!.frecuencia_riego_dias) {
          plantasMap.get(norm)!.frecuencia_riego_dias = freqCalculada;
        }
      }
    }
  }

  return {
    plantas: Array.from(plantasMap.values()),
    riegos,
  };
}

// Asignador inteligente de emoji y color para plantas que no existan
export function getPlantDefaults(nombre: string): { emoji: string; color: string; frecuencia_riego_dias: number } {
  // Buscar en las plantas iniciales si coincide
  const initialMatch = plantasIniciales.find(
    p => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
  );
  if (initialMatch) {
    return {
      emoji: initialMatch.emoji,
      color: initialMatch.color,
      frecuencia_riego_dias: initialMatch.frecuencia_riego_dias,
    };
  }

  const n = nombre.toLowerCase();
  let emoji = '🌱';
  let color = '#22c55e';
  let frecuencia = 2;

  if (n.includes('cayena') || n.includes('chile') || n.includes('pimiento')) {
    emoji = '🌶️';
    color = '#ef4444';
    frecuencia = 2;
  } else if (n.includes('ceboll')) {
    emoji = '🧅';
    color = '#84cc16';
    frecuencia = 2;
  } else if (n.includes('perejil')) {
    emoji = '🌿';
    color = '#16a34a';
    frecuencia = 2;
  } else if (n.includes('albahaca')) {
    emoji = '🌱';
    color = '#22c55e';
    frecuencia = 2;
  } else if (n.includes('hierba') || n.includes('menta')) {
    emoji = '🍃';
    color = '#059669';
    frecuencia = 2;
  } else if (n.includes('lavanda')) {
    emoji = '💜';
    color = '#8b5cf6';
    frecuencia = 7;
  } else if (n.includes('romero')) {
    emoji = '🌾';
    color = '#65a30d';
    frecuencia = 7;
  } else if (n.includes('laurel')) {
    emoji = '🌳';
    color = '#15803d';
    frecuencia = 3;
  } else if (n.includes('tomate')) {
    emoji = '🍅';
    color = '#dc2626';
    frecuencia = 3;
  } else if (n.includes('zanahoria')) {
    emoji = '🥕';
    color = '#ea580c';
    frecuencia = 3;
  }

  return { emoji, color, frecuencia_riego_dias: frecuencia };
}

// Aplicar los datos parseados a Dexie DB
export async function applyImportedDataToDb(
  parsed: ParsedSpreadsheetResult,
  mode: 'replace' | 'merge' = 'replace'
): Promise<{ plantasActualizadas: number; riegosImportados: number }> {
  const existingPlantas = await db.plantas.toArray();
  const existingPlantMap = new Map<string, Planta>();
  existingPlantas.forEach(p => existingPlantMap.set(p.nombre.trim().toLowerCase(), p));

  let plantasActualizadas = 0;

  // 1. Procesar plantas (actualizar frecuencias o crear nuevas)
  for (const plantItem of parsed.plantas) {
    const norm = plantItem.nombre.trim().toLowerCase();
    const existing = existingPlantMap.get(norm);

    if (existing && existing.planta_id) {
      if (plantItem.frecuencia_riego_dias && plantItem.frecuencia_riego_dias > 0) {
        await db.plantas.update(existing.planta_id, {
          frecuencia_riego_dias: plantItem.frecuencia_riego_dias,
        });
        plantasActualizadas++;
      }
    } else {
      // Crear nueva planta con valores por defecto
      const defaults = getPlantDefaults(plantItem.nombre);
      const newPlant: Planta = {
        nombre: plantItem.nombre,
        frecuencia_riego_dias: plantItem.frecuencia_riego_dias || defaults.frecuencia_riego_dias,
        fase_actual: 'Crecimiento vegetativo',
        horario_solar: 'Sol parcial',
        ajuste_manejo: 'Cuidados y riego regular',
        fertilizantes_recomendados: 'Compost orgánico, abono natural',
        prohibiciones: 'Evitar encharcamiento prolongado',
        emoji: defaults.emoji,
        color: defaults.color,
      };
      const id = await db.plantas.add(newPlant);
      newPlant.planta_id = id as number;
      existingPlantMap.set(norm, newPlant);
      plantasActualizadas++;
    }
  }

  // 2. Procesar riegos
  if (mode === 'replace') {
    await db.riegos.clear();
  }

  if (parsed.riegos.length > 0) {
    await db.riegos.bulkAdd(
      parsed.riegos.map(r => ({
        planta_nombre: r.planta_nombre,
        tipo: r.tipo,
        cantidad: r.cantidad,
        fecha: r.fecha,
      }))
    );
  }

  return {
    plantasActualizadas: parsed.plantas.length,
    riegosImportados: parsed.riegos.length,
  };
}

// Función principal que lee cualquier archivo (.xlsx, .xls, .csv, .json)
export async function processSpreadsheetFile(
  file: File,
  mode: 'replace' | 'merge' = 'replace'
): Promise<{ success: boolean; message: string; count?: { plantas: number; riegos: number } }> {
  const fileName = file.name.toLowerCase();

  // Si es archivo JSON, manejar backup completo
  if (fileName.endsWith('.json')) {
    const text = await file.text();
    const data = JSON.parse(text);
    if (mode === 'replace') {
      await db.plantas.clear();
      await db.riegos.clear();
      await db.bitacora.clear();
      await db.salud.clear();
      await db.cosechas.clear();
    }
    if (data.plantas) await db.plantas.bulkAdd(data.plantas);
    if (data.riegos) await db.riegos.bulkAdd(data.riegos);
    if (data.bitacora) await db.bitacora.bulkAdd(data.bitacora);
    if (data.salud) await db.salud.bulkAdd(data.salud);
    if (data.cosechas) await db.cosechas.bulkAdd(data.cosechas);

    return {
      success: true,
      message: 'Backup JSON restaurado con éxito.',
      count: {
        plantas: data.plantas?.length || 0,
        riegos: data.riegos?.length || 0,
      },
    };
  }

  // Si es Excel (.xlsx, .xls)
  if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const matrix = XLSX.utils.sheet_to_json<(string | number)[]>(ws, {
      header: 1,
      defval: '',
    });

    const parsed = parseSpreadsheetMatrix(matrix);
    const result = await applyImportedDataToDb(parsed, mode);

    return {
      success: true,
      message: `Se importaron ${result.riegosImportados} riegos y se configuraron ${result.plantasActualizadas} plantas.`,
      count: {
        plantas: result.plantasActualizadas,
        riegos: result.riegosImportados,
      },
    };
  }

  // Si es CSV (.csv) o texto plano
  if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
    const text = await file.text();
    const matrix = parseCSVText(text);
    const parsed = parseSpreadsheetMatrix(matrix);
    const result = await applyImportedDataToDb(parsed, mode);

    return {
      success: true,
      message: `Se importaron ${result.riegosImportados} riegos y se configuraron ${result.plantasActualizadas} plantas.`,
      count: {
        plantas: result.plantasActualizadas,
        riegos: result.riegosImportados,
      },
    };
  }

  throw new Error('Formato de archivo no soportado. Usa .xlsx, .xls, .csv o .json');
}
