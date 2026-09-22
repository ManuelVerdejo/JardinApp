import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Planta } from '../db/database';
import { PlantFace, MoodMessage } from '../components/PlantFace';
import { useConfetti, ConfettiOverlay } from '../components/Confetti';
import StreakBadge from '../components/StreakBadge';
import { Icon } from '../components/Icon';
import { WaterDrop, Rainbow, Alert } from '../components/Icons';
import { Clock } from 'lucide-react';

interface Props {
  onOpenFicha: (nombre: string) => void;
}

export default function Dashboard({ onOpenFicha }: Props) {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const alertasSalud = useLiveQuery(() => db.salud.where('estado').equals('En seguimiento').toArray()) || [];
  const [refreshKey, setRefreshKey] = useState(0);
  const { pieces, trigger: triggerConfetti } = useConfetti();
  const [justWatered, setJustWatered] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(k => k + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const quickWater = async (plantaNombre: string) => {
    await db.riegos.add({
      planta_nombre: plantaNombre,
      fecha: new Date().toISOString().split('T')[0],
      tipo: 'Agua limpia',
      cantidad: 'Normal',
    });
    setJustWatered(plantaNombre);
    triggerConfetti();
    setTimeout(() => setJustWatered(null), 1500);
    setRefreshKey(k => k + 1);
  };

  const getWaterStatus = (planta: Planta) => {
    const riegosPlanta = riegos
      .filter(r => r.planta_nombre === planta.nombre)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    
    if (riegosPlanta.length === 0) {
      return { daysSince: null, daysRemaining: -999, lastWater: null, status: 'critical' as const, face: 'critical' as const };
    }

    const lastWater = riegosPlanta[0];
    const lastDate = new Date(lastWater.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = planta.frecuencia_riego_dias - daysSince;

    let status: 'happy' | 'thirsty' | 'critical';
    if (daysRemaining > 0) status = 'happy';
    else if (daysRemaining === 0) status = 'thirsty';
    else status = 'critical';

    return { daysSince, daysRemaining, lastWater, status, face: status };
  };

  const cardStyles = {
    happy: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      badge: 'bg-gradient-to-r from-green-400 to-emerald-400',
      text: 'text-green-800',
      btn: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-green-200',
    },
    thirsty: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      border: 'border-yellow-200',
      badge: 'bg-gradient-to-r from-yellow-400 to-amber-400',
      text: 'text-yellow-800',
      btn: 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 shadow-yellow-200',
    },
    critical: {
      bg: 'bg-gradient-to-br from-red-50 to-pink-50',
      border: 'border-red-200',
      badge: 'bg-gradient-to-r from-red-400 to-pink-400',
      text: 'text-red-800',
      btn: 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-red-200',
    },
  };

  const sortedPlantas = [...plantas].sort((a, b) => {
    const sa = getWaterStatus(a);
    const sb = getWaterStatus(b);
    return sa.daysRemaining - sb.daysRemaining;
  });

  const happyCount = plantas.filter(p => getWaterStatus(p).status === 'happy').length;
  const thirstyCount = plantas.filter(p => getWaterStatus(p).status === 'thirsty').length;
  const criticalCount = plantas.filter(p => getWaterStatus(p).status === 'critical').length;

  const frases = [
    '¡Cada gota cuenta!',
    'Tu huerto te agradece',
    '¡Hoy es un gran día para cultivar!',
    'Las plantas son felices contigo',
    '¡Sigue así, jardinero/a!',
  ];
  const fraseDelDia = frases[new Date().getDay() % frases.length];

  return (
    <div className="space-y-5">
      <ConfettiOverlay pieces={pieces} />

      {/* Frase del día */}
      <div className="glass rounded-2xl p-3 shadow-cute animate-fade-in">
        <div className="flex items-center gap-2">
          <Rainbow size={20} className="animate-wiggle" />
          <p className="text-xs font-bold text-green-700">{fraseDelDia}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-3 text-center shadow-cute sticker animate-fade-in border-2 border-white">
          <Icon emoji="😊" size={28} className="mx-auto" />
          <p className="text-2xl font-black text-green-700 mt-1">{happyCount}</p>
          <p className="text-[10px] text-green-600 font-bold">Felices</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-3 text-center shadow-cute sticker animate-fade-in border-2 border-white" style={{ animationDelay: '0.1s' }}>
          <Icon emoji="😅" size={28} className="mx-auto" />
          <p className="text-2xl font-black text-yellow-700 mt-1">{thirstyCount}</p>
          <p className="text-[10px] text-yellow-600 font-bold">Con sed</p>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-3 text-center shadow-cute sticker animate-fade-in border-2 border-white" style={{ animationDelay: '0.2s' }}>
          <Icon emoji="🥺" size={28} className="mx-auto" />
          <p className="text-2xl font-black text-red-700 mt-1">{criticalCount}</p>
          <p className="text-[10px] text-red-600 font-bold">Urgente</p>
        </div>
      </div>

      {/* Alertas de salud */}
      {alertasSalud.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 shadow-cute animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-amber-200 rounded-full flex items-center justify-center">
              <Alert size={14} />
            </div>
            <span className="text-sm font-black text-amber-800">Alertas de Salud</span>
            <span className="ml-auto bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{alertasSalud.length}</span>
          </div>
          <div className="space-y-1.5">
            {alertasSalud.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-1.5">
                <Icon emoji={plantas.find(p => p.nombre === s.planta_nombre)?.emoji || '🌱'} size={16} />
                <span className="text-xs font-bold text-amber-800">{s.planta_nombre}</span>
                <span className="text-xs text-amber-600 truncate">{s.sintoma_riesgo}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semáforo de riego */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-cute">
            <WaterDrop size={14} />
          </div>
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">Semáforo de Riego</h2>
        </div>
        
        <div className="space-y-2.5 sm:space-y-3">
          {sortedPlantas.map((planta, index) => {
            const status = getWaterStatus(planta);
            const style = cardStyles[status.status];
            const isWatered = justWatered === planta.nombre;
            
            return (
              <div
                key={planta.planta_id}
                className={`rounded-2xl border-2 ${style.border} ${style.bg} p-3 sm:p-4 shadow-cute transition-all duration-300 ${
                  isWatered ? 'animate-pop scale-[1.02]' : ''
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Plant face */}
                  <div className="relative flex-shrink-0">
                    <PlantFace status={status.face} emoji={planta.emoji} />
                    {isWatered && (
                      <div className="absolute -top-2 -right-2 animate-heart">
                        <WaterDrop size={18} />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0" onClick={() => onOpenFicha(planta.nombre)}>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <h3 className={`font-black text-xs sm:text-sm ${style.text} truncate`}>{planta.nombre}</h3>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full text-white font-bold ${style.badge} shadow-sm flex items-center gap-0.5 sm:gap-1 flex-shrink-0`}>
                        {status.status === 'happy' ? <><Icon emoji="✨" size={10} /> Al día</> : 
                         status.status === 'thirsty' ? <><Icon emoji="💦" size={10} /> Regar hoy</> : 
                         <><Icon emoji="🆘" size={10} /> ¡Sedienta!</>}
                      </span>
                    </div>
                    <MoodMessage status={status.status} nombre={planta.nombre} />
                    <div className="flex items-center gap-2 sm:gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="text-gray-400" />
                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                          {status.daysSince !== null ? `Hace ${status.daysSince}d` : 'Sin registros'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <WaterDrop size={10} />
                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Cada {planta.frecuencia_riego_dias}d</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quickWater(planta.nombre);
                    }}
                    className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-white transition-all btn-cute shadow-lg ${style.btn} flex items-center gap-1 flex-shrink-0 active:scale-95`}
                  >
                    <WaterDrop size={14} />
                    <span className="hidden sm:inline">Regar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Racha */}
      <StreakBadge />

      {/* Footer cute */}
      <div className="text-center pt-4 pb-2">
        <p className="text-[10px] text-gray-400 font-medium">
          Toca una planta para ver su ficha completa ✨
        </p>
      </div>
    </div>
  );
}
