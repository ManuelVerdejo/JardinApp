import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: (data: any) => boolean;
  points: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-water',
    name: 'Primer Riego',
    description: 'Regaste tu primera planta',
    emoji: '💧',
    condition: (data) => data.riegos.length >= 1,
    points: 10,
  },
  {
    id: 'water-10',
    name: 'Regador Dedicado',
    description: '10 riegos registrados',
    emoji: '🚿',
    condition: (data) => data.riegos.length >= 10,
    points: 25,
  },
  {
    id: 'water-50',
    name: 'Maestro del Agua',
    description: '50 riegos registrados',
    emoji: '🌊',
    condition: (data) => data.riegos.length >= 50,
    points: 100,
  },
  {
    id: 'first-harvest',
    name: 'Primera Cosecha',
    description: 'Cosechaste por primera vez',
    emoji: '🎉',
    condition: (data) => data.cosechas.length >= 1,
    points: 20,
  },
  {
    id: 'harvest-10',
    name: 'Cosechador',
    description: '10 cosechas registradas',
    emoji: '🧺',
    condition: (data) => data.cosechas.length >= 10,
    points: 50,
  },
  {
    id: 'growth-tracker',
    name: 'Observador',
    description: '5 mediciones de crecimiento',
    emoji: '📏',
    condition: (data) => data.bitacora.length >= 5,
    points: 30,
  },
  {
    id: 'health-guardian',
    name: 'Guardián de la Salud',
    description: 'Resolviste una incidencia',
    emoji: '💚',
    condition: (data) => data.salud.filter((s: any) => s.estado === 'Resuelto').length >= 1,
    points: 40,
  },
  {
    id: 'plant-collector',
    name: 'Coleccionista',
    description: 'Tienes 5 o más plantas',
    emoji: '🌿',
    condition: (data) => data.plantas.length >= 5,
    points: 30,
  },
  {
    id: 'diverse-garden',
    name: 'Jardín Diverso',
    description: 'Tienes 9 o más plantas',
    emoji: '🏡',
    condition: (data) => data.plantas.length >= 9,
    points: 75,
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
  },
];

export function Achievements() {
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  const data = { plantas, riegos, cosechas, bitacora, salud };

  const unlockedAchievements = achievements.filter(a => a.condition(data));
  const lockedAchievements = achievements.filter(a => !a.condition(data));
  
  const totalPoints = unlockedAchievements.reduce((acc, a) => acc + a.points, 0);
  const maxPoints = achievements.reduce((acc, a) => acc + a.points, 0);
  
  // Calcular nivel de jardinero
  const nivel = Math.floor(totalPoints / 50) + 1;
  const puntosParaNivel = totalPoints % 50;
  const progresoNivel = (puntosParaNivel / 50) * 100;

  const getNivelTitle = (nivel: number) => {
    if (nivel >= 10) return 'Maestro Jardinero';
    if (nivel >= 7) return 'Jardinero Experto';
    if (nivel >= 5) return 'Jardinero Avanzado';
    if (nivel >= 3) return 'Jardinero Intermedio';
    if (nivel >= 2) return 'Aprendiz de Jardinero';
    return 'Jardinero Novato';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="🏆" size={40} className="mx-auto animate-float" />
        <h2 className="text-lg font-black text-gray-800 dark:text-gray-200 mt-2">Logros y Niveles</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Desbloquea logros cuidando tu huerto</p>
      </div>

      {/* Level card */}
      <div className="bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-yellow-900/30 dark:via-amber-900/20 dark:to-orange-900/30 rounded-2xl sm:rounded-3xl border-2 border-yellow-200 dark:border-yellow-800 p-4 shadow-cute-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-cute">
              <span className="text-white font-black text-xl">{nivel}</span>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
              <Icon emoji="⭐" size={14} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-amber-900 dark:text-amber-300">{getNivelTitle(nivel)}</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400">{totalPoints} / {maxPoints} puntos</p>
            <div className="w-full h-2 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden mt-1.5">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progresoNivel}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1">
              {50 - puntosParaNivel} puntos para el siguiente nivel
            </p>
          </div>
        </div>
      </div>

      {/* Unlocked achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1">
            <Icon emoji="✅" size={14} />
            Desbloqueados ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {unlockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border-2 border-green-200 dark:border-green-800 shadow-cute animate-bounce-in"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon emoji={achievement.emoji} size={24} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-green-800 dark:text-green-300 truncate">{achievement.name}</p>
                    <p className="text-[9px] text-green-600 dark:text-green-400">+{achievement.points} pts</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1">
            <Icon emoji="🔒" size={14} />
            Por desbloquear ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {lockedAchievements.map(achievement => (
              <div
                key={achievement.id}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 border-2 border-gray-200 dark:border-gray-700 opacity-60"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xs">🔒</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">{achievement.name}</p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-500">+{achievement.points} pts</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-500">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
