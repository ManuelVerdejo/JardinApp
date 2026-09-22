import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

export function Infographic() {
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
    <div className="bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-pink-900/30 rounded-2xl sm:rounded-3xl border-2 border-purple-200 dark:border-purple-800 p-3 sm:p-4 shadow-cute-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-cute">
          <Icon emoji="📊" size={14} />
        </div>
        <h3 className="font-black text-gray-800 dark:text-gray-200 text-xs sm:text-sm">Resumen Semanal</h3>
        <span className="ml-auto text-[9px] bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
          Últimos 7 días
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-2.5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="💧" size={16} />
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">Riegos</span>
          </div>
          <p className="text-lg font-black text-blue-800 dark:text-blue-300">{totalAgua}</p>
          {plantaMasRegada && (
            <p className="text-[9px] text-gray-600 dark:text-gray-400 truncate">
              Top: {plantaMasRegada[0]} ({plantaMasRegada[1]})
            </p>
          )}
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-2.5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="✂️" size={16} />
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">Cosechas</span>
          </div>
          <p className="text-lg font-black text-purple-800 dark:text-purple-300">{totalCosechado}</p>
          {cosechaTop && (
            <p className="text-[9px] text-gray-600 dark:text-gray-400 truncate">
              Top: {cosechaTop[0]} ({cosechaTop[1]} uds)
            </p>
          )}
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-2.5 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="📏" size={16} />
            <span className="text-[10px] font-bold text-green-700 dark:text-green-400">Altura prom.</span>
          </div>
          <p className="text-lg font-black text-green-800 dark:text-green-300">{crecimientoPromedio} cm</p>
          <p className="text-[9px] text-gray-600 dark:text-gray-400">
            {registrosSemana.length} mediciones
          </p>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-2.5 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Icon emoji="🐛" size={16} />
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400">Salud</span>
          </div>
          <p className="text-lg font-black text-orange-800 dark:text-orange-300">{incidenciasResueltas}/{incidenciasSemana.length}</p>
          <p className="text-[9px] text-gray-600 dark:text-gray-400">
            incidencias resueltas
          </p>
        </div>
      </div>

      {/* Highlight */}
      {(plantaMasRegada || cosechaTop) && (
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl p-2.5 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <Icon emoji="🏆" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300">¡Logro de la semana!</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 truncate">
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
