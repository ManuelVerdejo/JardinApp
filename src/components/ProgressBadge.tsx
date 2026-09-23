import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

export function ProgressBadge() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  // Calcular tareas del día
  const hoy = new Date().toISOString().split('T')[0];
  const tareasCompletadas = riegos.filter(r => r.fecha === hoy).length;
  const tareasTotales = plantas.length; // Idealmente regar todas las plantas hoy
  
  const porcentaje = tareasTotales > 0 ? Math.min(100, Math.round((tareasCompletadas / tareasTotales) * 100)) : 0;
  
  const totalRegistros = riegos.length + cosechas.length + bitacora.length + salud.length;
  const nivel = Math.floor(totalRegistros / 10) + 1;
  const progresoNivel = (totalRegistros % 10) * 10;

  if (porcentaje === 0 && totalRegistros === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 rounded-2xl p-3 shadow-cute border-2 border-purple-200 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-cute">
            <span className="text-white font-black text-sm">{nivel}</span>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center border border-white">
            <Icon emoji="⭐" size={10} />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-purple-800">Jardinero Nivel {nivel}</span>
            <span className="text-[10px] text-purple-600">{totalRegistros % 10}/10</span>
          </div>
          <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${progresoNivel}%` }}
            ></div>
          </div>
          {porcentaje > 0 && (
            <div className="mt-1.5">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-purple-600 font-medium">Tareas de hoy</span>
                <span className="text-[10px] text-purple-600 font-bold">{porcentaje}%</span>
              </div>
              <div className="w-full h-1.5 bg-purple-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
