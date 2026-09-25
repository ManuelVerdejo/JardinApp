import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';
import StreakBadge from './StreakBadge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (data: any) => boolean;
  points: number;
  category: 'riego' | 'cosecha' | 'crecimiento' | 'salud' | 'especial';
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
}

const achievements: Achievement[] = [
  // Riegos
  {
    id: 'first-water',
    name: 'Primera Gota',
    description: 'Regaste tu primera planta',
    emoji: '💧',
    condition: (data) => data.riegos.length >= 1,
    points: 10,
    category: 'riego',
    rarity: 'comun',
  },
  {
    id: 'water-10',
    name: 'Regador Dedicado',
    description: '10 riegos registrados',
    emoji: '🚿',
    condition: (data) => data.riegos.length >= 10,
    points: 25,
    category: 'riego',
    rarity: 'comun',
  },
  {
    id: 'water-50',
    name: 'Maestro del Agua',
    description: '50 riegos registrados',
    emoji: '🌊',
    condition: (data) => data.riegos.length >= 50,
    points: 100,
    category: 'riego',
    rarity: 'raro',
  },
  {
    id: 'water-100',
    name: 'Dios de la Lluvia',
    description: '100 riegos registrados',
    emoji: '⛈️',
    condition: (data) => data.riegos.length >= 100,
    points: 250,
    category: 'riego',
    rarity: 'epico',
  },
  {
    id: 'water-365',
    name: 'Leyenda del Riego',
    description: '365 riegos registrados',
    emoji: '🌧️',
    condition: (data) => data.riegos.length >= 365,
    points: 500,
    category: 'riego',
    rarity: 'legendario',
  },
  
  // Cosechas
  {
    id: 'first-harvest',
    name: 'Primera Cosecha',
    description: 'Cosechaste por primera vez',
    emoji: '🎉',
    condition: (data) => data.cosechas.length >= 1,
    points: 20,
    category: 'cosecha',
    rarity: 'comun',
  },
  {
    id: 'harvest-10',
    name: 'Cosechador',
    description: '10 cosechas registradas',
    emoji: '🧺',
    condition: (data) => data.cosechas.length >= 10,
    points: 50,
    category: 'cosecha',
    rarity: 'comun',
  },
  {
    id: 'harvest-50',
    name: 'Agricultor Experto',
    description: '50 cosechas registradas',
    emoji: '👨‍🌾',
    condition: (data) => data.cosechas.length >= 50,
    points: 150,
    category: 'cosecha',
    rarity: 'raro',
  },
  {
    id: 'harvest-100',
    name: 'Maestro de la Cosecha',
    description: '100 cosechas registradas',
    emoji: '🏆',
    condition: (data) => data.cosechas.length >= 100,
    points: 300,
    category: 'cosecha',
    rarity: 'epico',
  },
  
  // Crecimiento
  {
    id: 'growth-tracker',
    name: 'Observador',
    description: '5 mediciones de crecimiento',
    emoji: '📏',
    condition: (data) => data.bitacora.length >= 5,
    points: 30,
    category: 'crecimiento',
    rarity: 'comun',
  },
  {
    id: 'growth-25',
    name: 'Científico de Plantas',
    description: '25 mediciones de crecimiento',
    emoji: '🔬',
    condition: (data) => data.bitacora.length >= 25,
    points: 75,
    category: 'crecimiento',
    rarity: 'raro',
  },
  {
    id: 'growth-100',
    name: 'Botánico Experto',
    description: '100 mediciones de crecimiento',
    emoji: '🧬',
    condition: (data) => data.bitacora.length >= 100,
    points: 200,
    category: 'crecimiento',
    rarity: 'epico',
  },
  
  // Salud
  {
    id: 'health-guardian',
    name: 'Guardián de la Salud',
    description: 'Resolviste una incidencia',
    emoji: '💚',
    condition: (data) => data.salud.filter((s: any) => s.estado === 'Resuelto').length >= 1,
    points: 40,
    category: 'salud',
    rarity: 'comun',
  },
  {
    id: 'health-10',
    name: 'Doctor de Plantas',
    description: '10 incidencias resueltas',
    emoji: '👨‍⚕️',
    condition: (data) => data.salud.filter((s: any) => s.estado === 'Resuelto').length >= 10,
    points: 100,
    category: 'salud',
    rarity: 'raro',
  },
  {
    id: 'health-50',
    name: 'Sanador Maestro',
    description: '50 incidencias resueltas',
    emoji: '✨',
    condition: (data) => data.salud.filter((s: any) => s.estado === 'Resuelto').length >= 50,
    points: 250,
    category: 'salud',
    rarity: 'epico',
  },
  
  // Especiales
  {
    id: 'plant-collector',
    name: 'Coleccionista',
    description: 'Tienes 5 o más plantas',
    emoji: '🌿',
    condition: (data) => data.plantas.length >= 5,
    points: 30,
    category: 'especial',
    rarity: 'comun',
  },
  {
    id: 'diverse-garden',
    name: 'Jardín Diverso',
    description: 'Tienes 9 o más plantas',
    emoji: '🏡',
    condition: (data) => data.plantas.length >= 9,
    points: 75,
    category: 'especial',
    rarity: 'raro',
  },
  {
    id: 'total-records-25',
    name: 'Registrador Activo',
    description: '25 registros totales',
    emoji: '📝',
    condition: (data) => {
      const total = data.riegos.length + data.cosechas.length + data.bitacora.length + data.salud.length;
      return total >= 25;
    },
    points: 50,
    category: 'especial',
    rarity: 'comun',
  },
  {
    id: 'total-records-100',
    name: 'Jardinero Experto',
    description: '100 registros totales',
    emoji: '👨‍🌾',
    condition: (data) => {
      const total = data.riegos.length + data.cosechas.length + data.bitacora.length + data.salud.length;
      return total >= 100;
    },
    points: 200,
    category: 'especial',
    rarity: 'raro',
  },
  {
    id: 'total-records-500',
    name: 'Leyenda del Huerto',
    description: '500 registros totales',
    emoji: '👑',
    condition: (data) => {
      const total = data.riegos.length + data.cosechas.length + data.bitacora.length + data.salud.length;
      return total >= 500;
    },
    points: 500,
    category: 'especial',
    rarity: 'legendario',
  },
];

export function Achievements() {
  const { isDark } = useTheme();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const data = { plantas, riegos, cosechas, bitacora, salud };

  const unlockedAchievements = achievements.filter(a => a.condition(data));
  const lockedAchievements = achievements.filter(a => !a.condition(data));
  
  const totalPoints = unlockedAchievements.reduce((acc, a) => acc + a.points, 0);
  const maxPoints = achievements.reduce((acc, a) => acc + a.points, 0);
  
  // Calcular nivel de jardinero
  const nivel = Math.floor(totalPoints / 50) + 1;
  const puntosParaNivel = totalPoints % 50;
  const progresoNivel = (puntosParaNivel / 50) * 100;

  // Detectar nuevos logros desbloqueados
  useEffect(() => {
    const lastUnlocked = localStorage.getItem('huerto-last-unlocked');
    const currentUnlocked = unlockedAchievements.map(a => a.id).join(',');
    
    if (lastUnlocked && lastUnlocked !== currentUnlocked) {
      const lastIds = lastUnlocked.split(',');
      const newIds = unlockedAchievements.map(a => a.id).filter(id => !lastIds.includes(id));
      
      if (newIds.length > 0) {
        const newAchievement = achievements.find(a => a.id === newIds[0]);
        if (newAchievement) {
          setNewlyUnlocked(newAchievement.id);
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
            setNewlyUnlocked(null);
          }, 3000);
        }
      }
    }
    
    localStorage.setItem('huerto-last-unlocked', currentUnlocked);
  }, [unlockedAchievements.length]);

  const getNivelTitle = (nivel: number) => {
    if (nivel >= 20) return 'Leyenda del Huerto';
    if (nivel >= 15) return 'Maestro Jardinero';
    if (nivel >= 10) return 'Jardinero Experto';
    if (nivel >= 7) return 'Jardinero Avanzado';
    if (nivel >= 5) return 'Jardinero Intermedio';
    if (nivel >= 3) return 'Aprendiz de Jardinero';
    if (nivel >= 2) return 'Jardinero Novato';
    return 'Semilla de Jardinero';
  };

  const getNivelEmoji = (nivel: number) => {
    if (nivel >= 20) return '👑';
    if (nivel >= 15) return '🏆';
    if (nivel >= 10) return '⭐';
    if (nivel >= 7) return '🌟';
    if (nivel >= 5) return '✨';
    if (nivel >= 3) return '🌱';
    if (nivel >= 2) return '🌿';
    return '🌰';
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      comun: isDark ? 'from-gray-700 to-gray-800 border-gray-600' : 'from-gray-100 to-gray-200 border-gray-300',
      raro: isDark ? 'from-blue-900 to-blue-950 border-blue-700' : 'from-blue-100 to-blue-200 border-blue-400',
      epico: isDark ? 'from-purple-900 to-purple-950 border-purple-700' : 'from-purple-100 to-purple-200 border-purple-400',
      legendario: isDark ? 'from-yellow-900 to-yellow-950 border-yellow-600' : 'from-yellow-100 to-yellow-200 border-yellow-500',
    };
    return colors[rarity as keyof typeof colors] || colors.comun;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      comun: 'Común',
      raro: 'Raro',
      epico: 'Épico',
      legendario: 'Legendario',
    };
    return labels[rarity as keyof typeof labels] || 'Común';
  };

  const categories = [
    { id: 'todos', label: 'Todos', emoji: '🎯' },
    { id: 'riego', label: 'Riego', emoji: '💧' },
    { id: 'cosecha', label: 'Cosecha', emoji: '✂️' },
    { id: 'crecimiento', label: 'Crecimiento', emoji: '📏' },
    { id: 'salud', label: 'Salud', emoji: '🐛' },
    { id: 'especial', label: 'Especial', emoji: '⭐' },
  ];

  const filteredUnlocked = selectedCategory === 'todos' 
    ? unlockedAchievements 
    : unlockedAchievements.filter(a => a.category === selectedCategory);
  
  const filteredLocked = selectedCategory === 'todos'
    ? lockedAchievements
    : lockedAchievements.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Notificación de nuevo logro */}
      {showNotification && newlyUnlocked && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-wiggle">
                {achievements.find(a => a.id === newlyUnlocked)?.emoji}
              </span>
              <div>
                <p className="text-xs font-bold opacity-90">¡Nuevo logro desbloqueado!</p>
                <p className="text-lg font-black">
                  {achievements.find(a => a.id === newlyUnlocked)?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="🏆" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Logros y Niveles
        </h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Desbloquea logros cuidando tu huerto
        </p>
      </div>

      {/* Racha de días */}
      <StreakBadge showEmpty={true} />

      {/* Level card mejorado */}
      <div className={`rounded-2xl sm:rounded-3xl p-4 shadow-cute-lg border-2 ${
        isDark 
          ? 'bg-gradient-to-br from-yellow-900/30 via-amber-900/20 to-orange-900/30 border-yellow-800' 
          : 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-cute ${
              isDark 
                ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
                : 'bg-gradient-to-br from-yellow-400 to-orange-500'
            }`}>
              <span className="text-4xl">{getNivelEmoji(nivel)}</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-400">
              <span className="text-sm font-black text-yellow-600">{nivel}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`text-base font-black ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
              {getNivelTitle(nivel)}
            </h3>
            <p className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
              {totalPoints} / {maxPoints} puntos
            </p>
            <div className={`w-full h-3 rounded-full overflow-hidden mt-2 ${
              isDark ? 'bg-yellow-900' : 'bg-yellow-200'
            }`}>
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progresoNivel}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <p className={`text-[10px] font-bold mt-1 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
              {50 - puntosParaNivel} puntos para el siguiente nivel
            </p>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className={`rounded-2xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all btn-cute border-2 flex-shrink-0 ${
                selectedCategory === cat.id
                  ? isDark
                    ? 'bg-indigo-900 text-indigo-300 border-indigo-700'
                    : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                  : isDark
                  ? 'bg-gray-700 text-gray-400 border-gray-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logros desbloqueados */}
      {filteredUnlocked.length > 0 && (
        <div>
          <h3 className={`text-xs font-black mb-2 flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Icon emoji="✅" size={14} />
            Desbloqueados ({filteredUnlocked.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredUnlocked.map(achievement => (
              <div
                key={achievement.id}
                className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-xl p-3 border-2 shadow-cute animate-bounce-in relative overflow-hidden`}
              >
                {/* Efecto brillante para legendarios */}
                {achievement.rarity === 'legendario' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                )}
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon emoji={achievement.emoji} size={28} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {achievement.name}
                      </p>
                      <p className={`text-[10px] font-bold ${
                        achievement.rarity === 'legendario' 
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : achievement.rarity === 'epico'
                          ? 'text-purple-600 dark:text-purple-400'
                          : achievement.rarity === 'raro'
                          ? 'text-blue-600 dark:text-blue-400'
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        +{achievement.points} pts · {getRarityLabel(achievement.rarity)}
                      </p>
                    </div>
                  </div>
                  <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logros bloqueados */}
      {filteredLocked.length > 0 && (
        <div>
          <h3 className={`text-xs font-black mb-2 flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Icon emoji="🔒" size={14} />
            Por desbloquear ({filteredLocked.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {filteredLocked.map(achievement => (
              <div
                key={achievement.id}
                className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-xl p-3 border-2 opacity-60 relative overflow-hidden`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-gray-400/50 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.name}
                    </p>
                    <p className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      +{achievement.points} pts · {getRarityLabel(achievement.rarity)}
                    </p>
                  </div>
                </div>
                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
