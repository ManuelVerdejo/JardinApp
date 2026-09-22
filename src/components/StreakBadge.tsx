import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { Fire, Sparkles as SparklesIcon } from './Icons';

export default function StreakBadge() {
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  
  const calcularRacha = () => {
    if (riegos.length === 0) return 0;
    
    const fechasUnicas = [...new Set(riegos.map(r => r.fecha))].sort().reverse();
    const hoy = new Date().toISOString().split('T')[0];
    
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];
    
    if (fechasUnicas[0] !== hoy && fechasUnicas[0] !== ayerStr) {
      return 0;
    }
    
    let racha = 0;
    const expectedDate = new Date(fechasUnicas[0]);
    
    for (const fecha of fechasUnicas) {
      const fechaStr = expectedDate.toISOString().split('T')[0];
      if (fecha === fechaStr) {
        racha++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return racha;
  };

  const racha = calcularRacha();

  if (racha === 0) return null;

  const getMessage = (days: number) => {
    if (days >= 7) return '¡Increíble!';
    if (days >= 3) return '¡Genial!';
    return '¡Sigue así!';
  };

  return (
    <div className="bg-gradient-to-r from-orange-100 via-amber-50 to-yellow-100 rounded-2xl p-3 shadow-cute border-2 border-orange-200 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-cute animate-pulse-soft">
            <Fire size={24} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center border border-white">
            <SparklesIcon size={8} className="text-orange-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black text-orange-800">{racha}</span>
            <span className="text-xs font-bold text-orange-600">día{racha !== 1 ? 's' : ''} seguidos</span>
          </div>
          <p className="text-[10px] text-orange-500 font-medium">{getMessage(racha)} Cuidando tu huerto</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: Math.min(racha, 7) }).map((_, i) => (
            <div key={i} className="w-1.5 h-4 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full animate-grow" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
