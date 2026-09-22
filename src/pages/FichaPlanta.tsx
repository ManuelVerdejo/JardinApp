import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from '../components/Icon';
import { WaterDrop, Sun, Scissors, Alert as AlertIcon, Check } from '../components/Icons';
import { ArrowLeft } from 'lucide-react';

interface Props {
  nombre: string;
  onBack: () => void;
}

type TabType = 'info' | 'riegos' | 'crecimiento' | 'salud' | 'cosechas';

export default function FichaPlanta({ nombre, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  
  const planta = useLiveQuery(() => db.plantas.where('nombre').equals(nombre).first(), [nombre]);
  const riegos = useLiveQuery(() => db.riegos.where('planta_nombre').equals(nombre).reverse().sortBy('fecha'), [nombre]) || [];
  const bitacora = useLiveQuery(() => db.bitacora.where('planta_nombre').equals(nombre).sortBy('fecha'), [nombre]) || [];
  const salud = useLiveQuery(() => db.salud.where('planta_nombre').equals(nombre).reverse().sortBy('fecha_deteccion'), [nombre]) || [];
  const cosechas = useLiveQuery(() => db.cosechas.where('planta_nombre').equals(nombre).reverse().sortBy('fecha'), [nombre]) || [];

  if (!planta) {
    return (
      <div className="text-center py-12">
        <Icon emoji="🌱" size={50} className="mx-auto" />
        <p className="text-gray-500 mt-4 font-medium">Planta no encontrada</p>
        <button onClick={onBack} className="mt-4 text-green-600 font-bold btn-cute">← Volver</button>
      </div>
    );
  }

  const ultimoRiego = riegos[0];
  const diasDesdeRiego = ultimoRiego
    ? Math.floor((Date.now() - new Date(ultimoRiego.fecha).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const diasRestantes = diasDesdeRiego !== null ? planta.frecuencia_riego_dias - diasDesdeRiego : -999;
  
  const faceStatus = diasRestantes > 0 ? 'happy' : diasRestantes === 0 ? 'thirsty' : 'critical';

  const tabs = [
    { id: 'info' as const, label: 'Ficha', emoji: '🌿' },
    { id: 'riegos' as const, label: 'Riegos', emoji: '💧' },
    { id: 'crecimiento' as const, label: 'Altura', emoji: '📏' },
    { id: 'salud' as const, label: 'Salud', emoji: '🐛' },
    { id: 'cosechas' as const, label: 'Cosecha', emoji: '✂️' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-green-700 text-sm font-bold btn-cute bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Hero card */}
      <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-cute-lg border-2 border-white sticker animate-bounce-in ${
        faceStatus === 'happy' ? 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50' :
        faceStatus === 'thirsty' ? 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50' :
        'bg-gradient-to-br from-red-100 via-pink-50 to-rose-50'
      }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-cute ${
              faceStatus === 'happy' ? 'bg-green-200/50' :
              faceStatus === 'thirsty' ? 'bg-yellow-200/50' :
              'bg-red-200/50'
            }`}>
              <Icon emoji={planta.emoji} size={40} className="animate-float" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-cute ${
              faceStatus === 'happy' ? 'bg-green-300' :
              faceStatus === 'thirsty' ? 'bg-yellow-300' :
              'bg-red-300'
            }`}>
              <Icon emoji={faceStatus === 'happy' ? '😊' : faceStatus === 'thirsty' ? '😅' : '🥺'} size={14} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 truncate">{planta.nombre}</h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{planta.fase_actual}</p>
            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
              <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold text-white flex-shrink-0 ${
                faceStatus === 'happy' ? 'bg-green-500' :
                faceStatus === 'thirsty' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {faceStatus === 'happy' ? '✨ Feliz' : faceStatus === 'thirsty' ? '💦 Con sed' : '🆘 Sedienta'}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border ${
          faceStatus === 'happy' ? 'bg-green-50/80 border-green-200' :
          faceStatus === 'thirsty' ? 'bg-yellow-50/80 border-yellow-200' :
          'bg-red-50/80 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <WaterDrop size={12} className="flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-gray-700">
              {diasDesdeRiego !== null
                ? `Último riego: hace ${diasDesdeRiego} día(s) | Frecuencia: cada ${planta.frecuencia_riego_dias}d`
                : 'Sin registros de riego aún'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 px-0.5 -mx-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-300 btn-cute border-2 flex-shrink-0 active:scale-95 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-white shadow-lg shadow-green-200 scale-105' 
                : 'bg-white text-gray-600 border-gray-100 hover:border-green-200 shadow-sm'
            }`}
          >
            <Icon emoji={tab.emoji} size={12} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de tabs */}
      <div className="animate-fade-in">
        {activeTab === 'info' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-green-100 p-5 space-y-4 shadow-cute-lg">
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-3 border border-yellow-100">
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-xl flex items-center justify-center shadow-cute">
                <Sun size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Horario solar</p>
                <p className="text-sm text-gray-600">{planta.horario_solar}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
              <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-cute">
                <Scissors size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Manejo recomendado</p>
                <p className="text-sm text-gray-600">{planta.ajuste_manejo}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 border border-blue-100">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-cute">
                <WaterDrop size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Fertilizantes</p>
                <p className="text-sm text-gray-600">{planta.fertilizantes_recomendados}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-3 border border-red-100">
              <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-pink-400 rounded-xl flex items-center justify-center shadow-cute">
                <AlertIcon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Prohibiciones</p>
                <p className="text-sm text-red-600 font-medium">{planta.prohibiciones}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'riegos' && (
          <div className="space-y-2">
            {riegos.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-blue-100 shadow-cute">
                <WaterDrop size={50} className="mx-auto text-blue-300" />
                <p className="text-gray-400 mt-3 font-medium">Sin registros de riego</p>
              </div>
            ) : (
              riegos.slice(0, 20).map((r, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-blue-100 p-3 flex items-center gap-3 shadow-cute animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <WaterDrop size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{r.tipo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{r.fecha}</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">{r.cantidad}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'crecimiento' && (
          <div className="space-y-2">
            {bitacora.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-green-100 shadow-cute">
                <Icon emoji="📏" size={50} className="mx-auto" />
                <p className="text-gray-400 mt-3 font-medium">Sin mediciones registradas</p>
              </div>
            ) : (
              [...bitacora].reverse().map((b, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-green-100 p-3 flex items-center gap-3 shadow-cute animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Icon emoji="📏" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{b.altura_cm} cm</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{b.fecha}</span>
                      <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full font-medium">{b.num_plantas} planta(s)</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-t from-green-400 to-emerald-300 rounded-t-full" 
                      style={{ height: `${Math.min(100, (b.altura_cm / 30) * 100)}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'salud' && (
          <div className="space-y-2">
            {salud.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-orange-100 shadow-cute">
                <Icon emoji="🌟" size={50} className="mx-auto" />
                <p className="text-gray-400 mt-3 font-medium">¡Sin incidencias!</p>
                <p className="text-xs text-gray-400 mt-1">Tu planta está sana y feliz</p>
              </div>
            ) : (
              salud.map((s, i) => (
                <div key={i} className={`rounded-2xl border-2 p-4 shadow-cute animate-fade-in ${
                  s.estado === 'Resuelto' 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                }`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon emoji={s.estado === 'Resuelto' ? '✅' : '🔍'} size={20} />
                      <p className="text-sm font-bold text-gray-800">{s.sintoma_riesgo}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${
                      s.estado === 'Resuelto' ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-amber-400 to-yellow-400'
                    }`}>{s.estado}</span>
                  </div>
                  <div className="space-y-1 ml-7">
                    <p className="text-xs text-gray-600"><Icon emoji="🤔" size={12} className="inline" /> <span className="font-medium">Causa:</span> {s.causa_probable}</p>
                    <p className="text-xs text-gray-600"><Icon emoji="💊" size={12} className="inline" /> <span className="font-medium">Tratamiento:</span> {s.tratamiento_natural}</p>
                    <p className="text-xs text-gray-400 mt-1"><Icon emoji="📅" size={12} className="inline" /> Detectado: {s.fecha_deteccion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cosechas' && (
          <div className="space-y-2">
            {cosechas.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-purple-100 shadow-cute">
                <Scissors size={50} className="mx-auto text-purple-300" />
                <p className="text-gray-400 mt-3 font-medium">Sin cosechas registradas</p>
                <p className="text-xs text-gray-400 mt-1">¡Pronto recogerás tus primeros frutos!</p>
              </div>
            ) : (
              cosechas.map((c, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-100 p-3 flex items-center gap-3 shadow-cute animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Scissors size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{c.parte_cosechada}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{c.fecha}</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">{c.cantidad_estimada} uds</span>
                    </div>
                  </div>
                  <Icon emoji="🎉" size={20} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
