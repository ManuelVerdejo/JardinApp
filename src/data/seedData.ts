import type { Planta, Riego, BitacoraCrecimiento, SaludVegetal, Cosecha } from '../db/database';

// Datos iniciales pre-cargados para que la app no empiece vacía
export const plantasIniciales: Omit<Planta, 'planta_id'>[] = [
  {
    nombre: 'Albahaca',
    fase_actual: 'Crecimiento vegetativo',
    horario_solar: '9:00–12:30 | Pleno sol',
    frecuencia_riego_dias: 2,
    ajuste_manejo: 'Pellizcar puntas para favorecer ramificación',
    fertilizantes_recomendados: 'Té de plátano, infusión de café diluida',
    prohibiciones: 'Prohibido: Ceniza, exceso de nitrógeno',
    emoji: '🌿',
    color: '#22c55e',
  },
  {
    nombre: 'Cayena Original',
    fase_actual: 'Floración',
    horario_solar: '8:00–14:00 | Pleno sol',
    frecuencia_riego_dias: 3,
    ajuste_manejo: 'Entutorado, aclareo de flores',
    fertilizantes_recomendados: 'Cáscara de huevo triturada, té de plátano',
    prohibiciones: 'Prohibido: Exceso de agua, encharcamiento',
    emoji: '🌶️',
    color: '#ef4444',
  },
  {
    nombre: 'Cayenas Repicadas',
    fase_actual: 'Plántula',
    horario_solar: '9:00–13:00 | Sol parcial',
    frecuencia_riego_dias: 2,
    ajuste_manejo: 'Riego suave, evitar mojar hojas',
    fertilizantes_recomendados: 'Infusión de arroz, humus de lombriz líquido',
    prohibiciones: 'Prohibido: Fertilizantes fuertes, sol directo intenso',
    emoji: '🫑',
    color: '#f97316',
  },
  {
    nombre: 'Cebollino',
    fase_actual: 'Crecimiento vegetativo',
    horario_solar: '8:00–12:00 | Sol parcial',
    frecuencia_riego_dias: 3,
    ajuste_manejo: 'Cortar desde la base, dejar 3cm',
    fertilizantes_recomendados: 'Té de plátano, agua de cocción de verduras',
    prohibiciones: 'Prohibido: Ceniza en exceso',
    emoji: '🧅',
    color: '#84cc16',
  },
  {
    nombre: 'Perejil',
    fase_actual: 'Crecimiento vegetativo',
    horario_solar: '9:00–13:00 | Semisombra',
    frecuencia_riego_dias: 3,
    ajuste_manejo: 'Cortar tallos exteriores primero',
    fertilizantes_recomendados: 'Infusión de café diluida, humus líquido',
    prohibiciones: 'Prohibido: Sol directo prolongado',
    emoji: '🌱',
    color: '#16a34a',
  },
  {
    nombre: 'Hierbabuena',
    fase_actual: 'Crecimiento activo',
    horario_solar: '9:00–12:00 | Semisombra',
    frecuencia_riego_dias: 2,
    ajuste_manejo: 'Poda regular para controlar expansión',
    fertilizantes_recomendados: 'Té de plátano, agua de arroz fermentada',
    prohibiciones: 'Prohibido: Exceso de sol directo',
    emoji: '🍃',
    color: '#059669',
  },
  {
    nombre: 'Lavanda',
    fase_actual: 'Pre-floración',
    horario_solar: '8:00–15:00 | Pleno sol',
    frecuencia_riego_dias: 5,
    ajuste_manejo: 'Poda después de floración, suelo bien drenado',
    fertilizantes_recomendados: 'No requiere fertilización frecuente',
    prohibiciones: 'Prohibido: Exceso de agua, suelo encharcado',
    emoji: '💜',
    color: '#8b5cf6',
  },
  {
    nombre: 'Romero',
    fase_actual: 'Crecimiento vegetativo',
    horario_solar: '8:00–15:00 | Pleno sol',
    frecuencia_riego_dias: 5,
    ajuste_manejo: 'Poda para mantener forma, suelo seco entre riegos',
    fertilizantes_recomendados: 'No requiere fertilización frecuente',
    prohibiciones: 'Prohibido: Exceso de riego, humedad constante',
    emoji: '🌾',
    color: '#65a30d',
  },
  {
    nombre: 'Laurel',
    fase_actual: 'Crecimiento lento',
    horario_solar: '9:00–14:00 | Sol parcial',
    frecuencia_riego_dias: 4,
    ajuste_manejo: 'Poda de formación, trasplante cada 2 años',
    fertilizantes_recomendados: 'Compost maduro, humus de lombriz',
    prohibiciones: 'Prohibido: Encharcamiento, fertilizantes químicos fuertes',
    emoji: '🌳',
    color: '#15803d',
  },
];

// Datos de ejemplo para riegos (últimos días)
const hoy = new Date();
const formatFecha = (d: Date) => d.toISOString().split('T')[0];
const diasAtras = (n: number) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() - n);
  return formatFecha(d);
};

export const riegosIniciales: Omit<Riego, 'id'>[] = [
  { planta_nombre: 'Albahaca', fecha: diasAtras(0), tipo: 'Agua limpia', cantidad: 'Normal' },
  { planta_nombre: 'Albahaca', fecha: diasAtras(2), tipo: 'Té de plátano', cantidad: 'Normal' },
  { planta_nombre: 'Albahaca', fecha: diasAtras(4), tipo: 'Agua limpia', cantidad: 'Poca' },
  { planta_nombre: 'Cayena Original', fecha: diasAtras(1), tipo: 'Agua limpia', cantidad: 'Normal' },
  { planta_nombre: 'Cayena Original', fecha: diasAtras(4), tipo: 'Cáscara de huevo', cantidad: 'Poca' },
  { planta_nombre: 'Cayenas Repicadas', fecha: diasAtras(0), tipo: 'Agua limpia', cantidad: 'Poca' },
  { planta_nombre: 'Cayenas Repicadas', fecha: diasAtras(2), tipo: 'Infusión de arroz', cantidad: 'Poca' },
  { planta_nombre: 'Cebollino', fecha: diasAtras(1), tipo: 'Agua limpia', cantidad: 'Normal' },
  { planta_nombre: 'Cebollino', fecha: diasAtras(4), tipo: 'Té de plátano', cantidad: 'Normal' },
  { planta_nombre: 'Perejil', fecha: diasAtras(2), tipo: 'Agua limpia', cantidad: 'Normal' },
  { planta_nombre: 'Perejil', fecha: diasAtras(5), tipo: 'Infusión de café', cantidad: 'Poca' },
  { planta_nombre: 'Hierbabuena', fecha: diasAtras(0), tipo: 'Agua limpia', cantidad: 'Normal' },
  { planta_nombre: 'Hierbabuena', fecha: diasAtras(2), tipo: 'Agua de arroz', cantidad: 'Normal' },
  { planta_nombre: 'Lavanda', fecha: diasAtras(3), tipo: 'Agua limpia', cantidad: 'Poca' },
  { planta_nombre: 'Romero', fecha: diasAtras(2), tipo: 'Agua limpia', cantidad: 'Poca' },
  { planta_nombre: 'Laurel', fecha: diasAtras(1), tipo: 'Agua limpia', cantidad: 'Normal' },
];

export const bitacoraInicial: Omit<BitacoraCrecimiento, 'id'>[] = [
  { fecha: diasAtras(30), planta_nombre: 'Albahaca', altura_cm: 5, num_plantas: 3 },
  { fecha: diasAtras(20), planta_nombre: 'Albahaca', altura_cm: 8, num_plantas: 3 },
  { fecha: diasAtras(10), planta_nombre: 'Albahaca', altura_cm: 12, num_plantas: 3 },
  { fecha: diasAtras(0), planta_nombre: 'Albahaca', altura_cm: 16, num_plantas: 3 },
  { fecha: diasAtras(30), planta_nombre: 'Cayena Original', altura_cm: 10, num_plantas: 1 },
  { fecha: diasAtras(20), planta_nombre: 'Cayena Original', altura_cm: 15, num_plantas: 1 },
  { fecha: diasAtras(10), planta_nombre: 'Cayena Original', altura_cm: 22, num_plantas: 1 },
  { fecha: diasAtras(0), planta_nombre: 'Cayena Original', altura_cm: 28, num_plantas: 1 },
  { fecha: diasAtras(15), planta_nombre: 'Cayenas Repicadas', altura_cm: 2, num_plantas: 6 },
  { fecha: diasAtras(7), planta_nombre: 'Cayenas Repicadas', altura_cm: 4, num_plantas: 6 },
  { fecha: diasAtras(0), planta_nombre: 'Cayenas Repicadas', altura_cm: 6, num_plantas: 6 },
  { fecha: diasAtras(20), planta_nombre: 'Hierbabuena', altura_cm: 8, num_plantas: 2 },
  { fecha: diasAtras(10), planta_nombre: 'Hierbabuena', altura_cm: 12, num_plantas: 2 },
  { fecha: diasAtras(0), planta_nombre: 'Hierbabuena', altura_cm: 15, num_plantas: 2 },
];

export const saludInicial: Omit<SaludVegetal, 'id'>[] = [
  {
    fecha_deteccion: diasAtras(7),
    planta_nombre: 'Albahaca',
    sintoma_riesgo: 'Hojas con manchas amarillas',
    causa_probable: 'Exceso de humedad / posible hongo',
    tratamiento_natural: 'Reducir riego, pulverizar con infusión de cola de caballo',
    estado: 'En seguimiento',
    fecha_revision: diasAtras(-3),
  },
  {
    fecha_deteccion: diasAtras(14),
    planta_nombre: 'Cayena Original',
    sintoma_riesgo: 'Pulgones en brotes tiernos',
    causa_probable: 'Plaga estacional',
    tratamiento_natural: 'Spray de jabón potásico + ajo',
    estado: 'Resuelto',
    fecha_revision: diasAtras(3),
  },
  {
    fecha_deteccion: diasAtras(5),
    planta_nombre: 'Cebollino',
    sintoma_riesgo: 'Puntas secas',
    causa_probable: 'Déficit de potasio o riego irregular',
    tratamiento_natural: 'Aplicar té de plátano, regularizar riego',
    estado: 'En seguimiento',
    fecha_revision: diasAtras(-2),
  },
];

export const cosechasIniciales: Omit<Cosecha, 'id'>[] = [
  { fecha: diasAtras(10), planta_nombre: 'Albahaca', parte_cosechada: 'Puntas', cantidad_estimada: 12 },
  { fecha: diasAtras(5), planta_nombre: 'Albahaca', parte_cosechada: 'Hojas', cantidad_estimada: 8 },
  { fecha: diasAtras(7), planta_nombre: 'Cebollino', parte_cosechada: 'Tallos', cantidad_estimada: 15 },
  { fecha: diasAtras(3), planta_nombre: 'Hierbabuena', parte_cosechada: 'Hojas', cantidad_estimada: 20 },
  { fecha: diasAtras(1), planta_nombre: 'Perejil', parte_cosechada: 'Hojas', cantidad_estimada: 10 },
];
