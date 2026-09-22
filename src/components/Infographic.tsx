import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';

export function Infographic() {
  const { isDark } = useTheme();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  // Calcular estadísticas de la semana
  const hoy = new Date();
  const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const hace7DiasStr = hace7Dias.toISOString().split('T')[0];

  const riegosSemana = riegos.filter(r => r.fecha >= hace7DiasStr);
  const cosechasSemana = cosechas.filter(c => c.fecha >= hace7DiasStr);
  const registrosSemana = bitacora.filter(b => b.fecha >= hace7DiasStr);
  const incidenciasSemana = salud.filter(s => s.fecha_deteccion >= hace7DiasStr);

  const totalAgua = riegosSemana.length;
  const totalCosechado = cosechasSemana.reduce((acc, c) => acc + c.cantidad_estimada, 0);
  const crecimientoPromedio = registrosSemana.length > 0 
    ? Math.round(registrosSemana.reduce((acc, b) => acc + b.altura_cm, 0) / registrosSemana.length * 10) / 10
    : 0;
  const incidenciasResueltas = incidenciasSemana.filter(s => s.estado === 'Resuelto').length;

  // Planta más regada
  const riegoPorPlanta: Record<string, number> = {};
  riegosSemana.forEach(r => {
    riegoPorPlanta[r.planta_nombre] = (riegoPorPlanta[r.planta_nombre] || 0) + 1;
  });
  const plantaMasRegada = Object.entries(riegoPorPlanta).sort((a, b) => b[1] - a[1])[0];

  // Cosecha más abundante
  const cosechaPorPlanta: Record<string, number> = {};
  cosechasSemana.forEach(c => {
    cosechaPorPlanta[c.planta_nombre] = (cosechaPorPlanta[c.planta_nombre] || 0) + c.cantidad_estimada;
  });
  const cosechaTop = Object.entries(cosechaPorPlanta).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-cute-lg animate-fade-in border-2 ${
      isDark 
        ? 'bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-pink-900/30 border-purple-800' 
        : 'bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 border-purple-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="📊" size={14} />
        </div>
        <h3 className={`font-black text-xs sm:text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Resumen Semanal</h3>
        <span className={`ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold ${
          isDark ? 'bg-purple-800 text-purple-300' : 'bg-purple-200 text-purple-800'
        }`}>
          Últimos 7 días
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`rounded-xl p-2.5 border ${
          isDark ? 'bg-gray-800/60 border-blue-800' : 'bg-white/60 border-blue-200'
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="💧" size={16} />
            <span className={`text-[10px] font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Riegos</span>
          </div>
          <p className={`text-lg font-black ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>{totalAgua}</p>
          {plantaMasRegada && (
            <p className={`text-[9px] truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Top: {plantaMasRegada[0]} ({plantaMasRegada[1]})
            </p>
          )}
        </div>

        <div className={`rounded-xl p-2.5 border ${
          isDark ? 'bg-gray-800/60 border-purple-800' : 'bg-white/60 border-purple-200'
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="✂️" size={16} />
            <span className={`text-[10px] font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Cosechas</span>
          </div>
          <p className={`text-lg font-black ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>{totalCosechado}</p>
          {cosechaTop && (
            <p className={`text-[9px] truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Top: {cosechaTop[0]} ({cosechaTop[1]} uds)
            </p>
          )}
        </div>

        <div className={`rounded-xl p-2.5 border ${
          isDark ? 'bg-gray-800/60 border-green-800' : 'bg-white/60 border-green-200'
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="📏" size={16} />
            <span className={`text-[10px] font-bold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Altura prom.</span>
          </div>
          <p className={`text-lg font-black ${isDark ? 'text-green-300' : 'text-green-800'}`}>{crecimientoPromedio} cm</p>
          <p className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {registrosSemana.length} mediciones
          </p>
        </div>

        <div className={`rounded-xl p-2.5 border ${
          isDark ? 'bg-gray-800/60 border-orange-800' : 'bg-white/60 border-orange-200'
        }`}>
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="🐛" size={16} />
            <span className={`text-[10px] font-bold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>Salud</span>
          </div>
          <p className={`text-lg font-black ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>{incidenciasResueltas}/{incidenciasSemana.length}</p>
          <p className={`text-[9px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            incidencias resueltas
          </p>
        </div>
      </div>

      {/* Highlight */}
      {(plantaMasRegada || cosechaTop) && (
        <div className={`rounded-xl p-2.5 border ${
          isDark ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-800' : 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            <Icon emoji="🏆" size={20} />
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>¡Logro de la semana!</p>
              <p className={`text-xs truncate ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                {cosechaTop 
                  ? `Mayor cosecha: ${cosechaTop[0]} con ${cosechaTop[1]} unidades`
                  : plantaMasRegada
                  ? `Planta más cuidada: ${plantaMasRegada[0]} con ${plantaMasRegada[1]} riegos`
                  : '¡Sigue así!'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
