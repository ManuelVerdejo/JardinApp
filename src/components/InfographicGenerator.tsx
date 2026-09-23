import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './Icon';
import { Calendar, Download, Share2, TrendingUp, Droplets, Scissors, Sprout, Bug } from 'lucide-react';

type Period = 'week' | 'month';

export function InfographicGenerator() {
  const { isDark } = useTheme();
  const [period, setPeriod] = useState<Period>('week');
  const [showPreview, setShowPreview] = useState(false);

  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  // Calcular estadísticas del período
  const getPeriodStats = () => {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = now.toISOString().split('T')[0];

    const periodRiegos = riegos.filter(r => r.fecha >= startStr && r.fecha <= endStr);
    const periodCosechas = cosechas.filter(c => c.fecha >= startStr && c.fecha <= endStr);
    const periodBitacora = bitacora.filter(b => b.fecha >= startStr && b.fecha <= endStr);
    const periodSalud = salud.filter(s => s.fecha_deteccion >= startStr && s.fecha_deteccion <= endStr);

    // Estadísticas de riego
    const totalRiegos = periodRiegos.length;
    const plantasRegadas = new Set(periodRiegos.map(r => r.planta_nombre)).size;
    const tiposRiego = periodRiegos.reduce((acc, r) => {
      acc[r.tipo] = (acc[r.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const tipoMasUsado = Object.entries(tiposRiego).sort((a, b) => b[1] - a[1])[0];

    // Estadísticas de cosecha
    const totalCosechas = periodCosechas.length;
    const totalUnidades = periodCosechas.reduce((acc, c) => acc + c.cantidad_estimada, 0);
    const plantasCosechadas = new Set(periodCosechas.map(c => c.planta_nombre)).size;

    // Estadísticas de crecimiento
    const mediciones = periodBitacora.length;
    const crecimientoPromedio = periodBitacora.length > 0
      ? periodBitacora.reduce((acc, b) => acc + b.altura_cm, 0) / periodBitacora.length
      : 0;

    // Estadísticas de salud
    const incidencias = periodSalud.length;
    const resueltas = periodSalud.filter(s => s.estado === 'Resuelto').length;
    const tasaResolucion = incidencias > 0 ? Math.round((resueltas / incidencias) * 100) : 0;

    // Planta más activa
    const actividadPorPlanta = new Map<string, number>();
    periodRiegos.forEach(r => {
      actividadPorPlanta.set(r.planta_nombre, (actividadPorPlanta.get(r.planta_nombre) || 0) + 1);
    });
    periodCosechas.forEach(c => {
      actividadPorPlanta.set(c.planta_nombre, (actividadPorPlanta.get(c.planta_nombre) || 0) + 1);
    });
    const plantaMasActiva = Array.from(actividadPorPlanta.entries())
      .sort((a, b) => b[1] - a[1])[0];

    return {
      totalRiegos,
      plantasRegadas,
      tipoMasUsado,
      totalCosechas,
      totalUnidades,
      plantasCosechadas,
      mediciones,
      crecimientoPromedio: Math.round(crecimientoPromedio * 10) / 10,
      incidencias,
      resueltas,
      tasaResolucion,
      plantaMasActiva,
      startDate: startStr,
      endDate: endStr,
    };
  };

  const stats = getPeriodStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const handleShare = async () => {
    const text = `🌱 Resumen de mi huerto (${period === 'week' ? 'última semana' : 'último mes'})\n\n` +
      `💧 ${stats.totalRiegos} riegos a ${stats.plantasRegadas} plantas\n` +
      `✂️ ${stats.totalCosechas} cosechas (${stats.totalUnidades} unidades)\n` +
      `📏 ${stats.mediciones} mediciones de crecimiento\n` +
      `🐛 ${stats.incidencias} incidencias (${stats.tasaResolucion}% resueltas)\n` +
      (stats.plantaMasActiva ? `\n⭐ Planta más activa: ${stats.plantaMasActiva[0]}` : '');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resumen de Mi Huerto',
          text: text,
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(text);
      alert('¡Resumen copiado al portapapeles!');
    }
  };

  const handleDownload = () => {
    const text = `RESUMEN DE MI HUERTO\n` +
      `Período: ${formatDate(stats.startDate)} - ${formatDate(stats.endDate)}\n\n` +
      `RIEGOS\n` +
      `- Total: ${stats.totalRiegos}\n` +
      `- Plantas regadas: ${stats.plantasRegadas}\n` +
      (stats.tipoMasUsado ? `- Tipo más usado: ${stats.tipoMasUsado[0]} (${stats.tipoMasUsado[1]} veces)\n` : '') +
      `\nCOSECHAS\n` +
      `- Total: ${stats.totalCosechas}\n` +
      `- Unidades cosechadas: ${stats.totalUnidades}\n` +
      `- Plantas cosechadas: ${stats.plantasCosechadas}\n` +
      `\nCRECIMIENTO\n` +
      `- Mediciones: ${stats.mediciones}\n` +
      `- Altura promedio: ${stats.crecimientoPromedio} cm\n` +
      `\nSALUD\n` +
      `- Incidencias: ${stats.incidencias}\n` +
      `- Tasa de resolución: ${stats.tasaResolucion}%\n` +
      (stats.plantaMasActiva ? `\nPLANTA MÁS ACTIVA\n- ${stats.plantaMasActiva[0]} (${stats.plantaMasActiva[1]} actividades)\n` : '');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen-huerto-${period === 'week' ? 'semanal' : 'mensual'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📊" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Infografías Automáticas
        </h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Resúmenes visuales de tu huerto
        </p>
      </div>

      {/* Selector de período */}
      <div className={`rounded-2xl p-4 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all btn-cute ${
              period === 'week'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Última Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all btn-cute ${
              period === 'month'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Último Mes
          </button>
        </div>
      </div>

      {/* Preview de infografía */}
      <div className={`rounded-2xl p-5 shadow-cute-lg border-2 ${
        isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200'
      }`}>
        {/* Título de infografía */}
        <div className="text-center mb-4">
          <h3 className={`text-xl font-black ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
            🌱 Resumen de Mi Huerto
          </h3>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatDate(stats.startDate)} - {formatDate(stats.endDate)}
          </p>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Riegos */}
          <div className={`rounded-xl p-3 ${isDark ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-100 border-2 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>Riegos</span>
            </div>
            <p className={`text-2xl font-black ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>
              {stats.totalRiegos}
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.plantasRegadas} plantas
            </p>
          </div>

          {/* Cosechas */}
          <div className={`rounded-xl p-3 ${isDark ? 'bg-purple-900/30 border border-purple-800' : 'bg-purple-100 border-2 border-purple-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Scissors size={20} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
              <span className={`text-xs font-bold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>Cosechas</span>
            </div>
            <p className={`text-2xl font-black ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
              {stats.totalCosechas}
            </p>
            <p className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {stats.totalUnidades} unidades
            </p>
          </div>

          {/* Crecimiento */}
          <div className={`rounded-xl p-3 ${isDark ? 'bg-green-900/30 border border-green-800' : 'bg-green-100 border-2 border-green-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Sprout size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
              <span className={`text-xs font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>Crecimiento</span>
            </div>
            <p className={`text-2xl font-black ${isDark ? 'text-green-400' : 'text-green-800'}`}>
              {stats.mediciones}
            </p>
            <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              {stats.crecimientoPromedio} cm prom.
            </p>
          </div>

          {/* Salud */}
          <div className={`rounded-xl p-3 ${isDark ? 'bg-orange-900/30 border border-orange-800' : 'bg-orange-100 border-2 border-orange-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Bug size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
              <span className={`text-xs font-bold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>Salud</span>
            </div>
            <p className={`text-2xl font-black ${isDark ? 'text-orange-400' : 'text-orange-800'}`}>
              {stats.tasaResolucion}%
            </p>
            <p className={`text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
              {stats.resueltas}/{stats.incidencias} resueltas
            </p>
          </div>
        </div>

        {/* Planta más activa */}
        {stats.plantaMasActiva && (
          <div className={`rounded-xl p-3 mb-4 ${isDark ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-100 border-2 border-yellow-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div className="flex-1">
                <p className={`text-xs font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Planta más activa
                </p>
                <p className={`text-sm font-black ${isDark ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  {stats.plantaMasActiva[0]}
                </p>
                <p className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {stats.plantaMasActiva[1]} actividades
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tipo de riego más usado */}
        {stats.tipoMasUsado && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-cyan-900/30 border border-cyan-800' : 'bg-cyan-100 border-2 border-cyan-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💧</span>
              <div className="flex-1">
                <p className={`text-xs font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                  Riego más usado
                </p>
                <p className={`text-sm font-black ${isDark ? 'text-cyan-400' : 'text-cyan-800'}`}>
                  {stats.tipoMasUsado[0]}
                </p>
                <p className={`text-xs ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {stats.tipoMasUsado[1]} veces
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all btn-cute bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
        >
          <Share2 size={18} />
          Compartir
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all btn-cute bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
        >
          <Download size={18} />
          Descargar
        </button>
      </div>
    </div>
  );
}
