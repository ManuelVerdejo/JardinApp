import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { ChevronLeft, ChevronRight, Filter, CheckCircle2, Circle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useConfetti, ConfettiOverlay } from './Confetti';

type TaskType = 'riego' | 'fertilizante' | 'salud' | 'poda';
type EventStatus = 'pendiente' | 'completado';

interface CalendarTask {
  id: string;
  type: TaskType;
  date: string;
  planta: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  status: EventStatus;
  data?: any; // Para guardar referencia al objeto original
}

export default function Calendar() {
  const { isDark } = useTheme();
  const { pieces, trigger: triggerConfetti } = useConfetti();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.where('estado').equals('En seguimiento').toArray()) || [];
  const planesFertilizacion = useLiveQuery(() => db.planesFertilizacion.where('activo').equals(1).toArray()) || [];
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<TaskType>>(
    new Set(['riego', 'fertilizante', 'salud', 'poda'])
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Generar tareas programadas
  const allTasks = useMemo((): CalendarTask[] => {
    const tasks: CalendarTask[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generar tareas para los próximos 90 días
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Tareas de riego basadas en frecuencia
      plantas.forEach(planta => {
        const lastWater = riegos
          .filter(r => r.planta_nombre === planta.nombre)
          .sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
        
        if (lastWater) {
          const lastDate = new Date(lastWater.fecha);
          const daysSince = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSince > 0 && daysSince % planta.frecuencia_riego_dias === 0) {
            const taskId = `riego-${planta.nombre}-${dateStr}`;
            tasks.push({
              id: taskId,
              type: 'riego',
              date: dateStr,
              planta: planta.nombre,
              emoji: planta.emoji,
              title: `Riego: ${planta.nombre}`,
              subtitle: `Cada ${planta.frecuencia_riego_dias} días`,
              color: 'blue',
              status: completedTasks.has(taskId) ? 'completado' : 'pendiente',
            });
          }
        }
      });

      // Tareas de fertilización basadas en planes
      planesFertilizacion.forEach(plan => {
        const lastDate = new Date(plan.ultima_aplicacion);
        const daysSince = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince > 0 && daysSince % plan.frecuencia_dias === 0) {
          const taskId = `fertilizante-${plan.planta_nombre}-${plan.fertilizante_nombre}-${dateStr}`;
          const planta = plantas.find(p => p.nombre === plan.planta_nombre);
          tasks.push({
            id: taskId,
            type: 'fertilizante',
            date: dateStr,
            planta: plan.planta_nombre,
            emoji: planta?.emoji || '🌱',
            title: `Fertilizar: ${plan.planta_nombre}`,
            subtitle: plan.fertilizante_nombre,
            color: 'green',
            status: completedTasks.has(taskId) ? 'completado' : 'pendiente',
            data: plan,
          });
        }
      });

      // Alertas de salud activas (revisar cada 3 días)
      salud.forEach(s => {
        const detectionDate = new Date(s.fecha_deteccion);
        const daysSince = Math.floor((date.getTime() - detectionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince >= 0 && daysSince % 3 === 0) {
          const taskId = `salud-${s.planta_nombre}-${dateStr}`;
          const planta = plantas.find(p => p.nombre === s.planta_nombre);
          tasks.push({
            id: taskId,
            type: 'salud',
            date: dateStr,
            planta: s.planta_nombre,
            emoji: planta?.emoji || '🐛',
            title: `Revisar: ${s.planta_nombre}`,
            subtitle: s.sintoma_riesgo,
            color: 'orange',
            status: completedTasks.has(taskId) ? 'completado' : 'pendiente',
            data: s,
          });
        }
      });

      // Podas programadas (cada 15 días para plantas que lo necesitan)
      plantas.forEach(planta => {
        if (planta.ajuste_manejo.toLowerCase().includes('poda')) {
          const daysSinceStart = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceStart % 15 === 0) {
            const taskId = `poda-${planta.nombre}-${dateStr}`;
            tasks.push({
              id: taskId,
              type: 'poda',
              date: dateStr,
              planta: planta.nombre,
              emoji: planta.emoji,
              title: `Poda: ${planta.nombre}`,
              subtitle: planta.ajuste_manejo,
              color: 'pink',
              status: completedTasks.has(taskId) ? 'completado' : 'pendiente',
            });
          }
        }
      });
    }

    return tasks.filter(t => activeFilters.has(t.type));
  }, [plantas, riegos, planesFertilizacion, salud, activeFilters, year, month, completedTasks]);

  // Filtrar tareas del mes actual
  const monthTasks = useMemo(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return allTasks.filter(t => t.date.startsWith(monthStr));
  }, [allTasks, year, month]);

  // Contar tareas por día
  const tasksByDate = useMemo(() => {
    const map: Record<string, CalendarTask[]> = {};
    monthTasks.forEach(task => {
      if (!map[task.date]) map[task.date] = [];
      map[task.date].push(task);
    });
    return map;
  }, [monthTasks]);

  // Tareas del día seleccionado
  const selectedTasks = selectedDate ? (tasksByDate[selectedDate] || []) : [];

  // Estadísticas del mes
  const monthStats = useMemo(() => {
    const stats = {
      riegos: monthTasks.filter(t => t.type === 'riego').length,
      fertilizantes: monthTasks.filter(t => t.type === 'fertilizante').length,
      salud: monthTasks.filter(t => t.type === 'salud').length,
      podas: monthTasks.filter(t => t.type === 'poda').length,
      completadas: monthTasks.filter(t => t.status === 'completado').length,
    };
    return stats;
  }, [monthTasks]);

  const toggleFilter = (type: TaskType) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
        triggerConfetti();
      }
      return newSet;
    });
  };

  const filterConfig = {
    riego: { emoji: '💧', label: 'Riegos', color: 'blue' },
    fertilizante: { emoji: '🧪', label: 'Fertilizantes', color: 'green' },
    salud: { emoji: '🐛', label: 'Salud', color: 'orange' },
    poda: { emoji: '✂️', label: 'Podas', color: 'pink' },
  };

  const getTaskColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-400 dark:bg-blue-600',
      green: 'bg-green-400 dark:bg-green-600',
      orange: 'bg-orange-400 dark:bg-orange-600',
      pink: 'bg-pink-400 dark:bg-pink-600',
    };
    return colors[color] || 'bg-gray-400';
  };

  const getTextClasses = (color: string) => {
    const textColors: Record<string, string> = {
      blue: isDark ? 'text-blue-300' : 'text-blue-800',
      green: isDark ? 'text-green-300' : 'text-green-800',
      orange: isDark ? 'text-orange-300' : 'text-orange-800',
      pink: isDark ? 'text-pink-300' : 'text-pink-800',
    };
    return textColors[color] || 'text-gray-800';
  };

  const getSubtitleClasses = (color: string) => {
    const subtitleColors: Record<string, string> = {
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      green: isDark ? 'text-green-400' : 'text-green-600',
      orange: isDark ? 'text-orange-400' : 'text-orange-600',
      pink: isDark ? 'text-pink-400' : 'text-pink-600',
    };
    return subtitleColors[color] || 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      <ConfettiOverlay pieces={pieces} />

      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📅" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Calendario de Tareas</h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Planifica y gestiona tus tareas</p>
      </div>

      {/* Filtros */}
      <div className={`rounded-2xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Filtrar tareas</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(filterConfig) as TaskType[]).map(type => {
            const config = filterConfig[type];
            const isActive = activeFilters.has(type);
            
            const activeGradients: Record<string, string> = {
              blue: 'bg-gradient-to-r from-blue-400 to-blue-500',
              green: 'bg-gradient-to-r from-green-400 to-green-500',
              orange: 'bg-gradient-to-r from-orange-400 to-orange-500',
              pink: 'bg-gradient-to-r from-pink-400 to-pink-500',
            };
            
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all btn-cute border-2 ${
                  isActive
                    ? `${activeGradients[config.color]} text-white border-white shadow-md`
                    : isDark
                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                <Icon emoji={config.emoji} size={12} />
                <span className="text-[11px]">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-cute-lg ${
        isDark ? 'bg-gray-800/80 border-2 border-indigo-900' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'
      }`}>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevMonth} 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all btn-cute active:scale-95 ${
              isDark ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'
            }`}
          >
            <ChevronLeft size={18} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <h3 className={`text-sm sm:text-base font-black ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={goToToday}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all btn-cute ${
                isDark ? 'bg-indigo-900 text-indigo-400 hover:bg-indigo-800' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
            >
              Hoy
            </button>
          </div>
          
          <button 
            onClick={nextMonth} 
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all btn-cute active:scale-95 ${
              isDark ? 'bg-indigo-900 hover:bg-indigo-800' : 'bg-indigo-100 hover:bg-indigo-200'
            }`}
          >
            <ChevronRight size={18} className={isDark ? 'text-indigo-400' : 'text-indigo-600'} />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className={`text-center text-[10px] sm:text-xs font-bold py-1 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const taskCount = dayTasks.length;
            const pendingCount = dayTasks.filter(t => t.status === 'pendiente').length;
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center relative transition-all btn-cute ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg scale-110 z-10'
                    : isToday
                    ? isDark
                      ? 'bg-indigo-900 text-indigo-300 font-bold ring-2 ring-indigo-500'
                      : 'bg-indigo-100 text-indigo-700 font-bold ring-2 ring-indigo-300'
                    : isDark
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">{day}</span>
                {taskCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-full px-0.5">
                    {dayTasks.slice(0, 4).map((task, j) => (
                      <div 
                        key={j} 
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : getTaskColorClasses(task.color)
                        } ${task.status === 'completado' ? 'opacity-50' : ''}`}
                      ></div>
                    ))}
                    {taskCount > 4 && (
                      <span className={`text-[8px] font-bold ${isSelected ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        +{taskCount - 4}
                      </span>
                    )}
                  </div>
                )}
                {pendingCount > 0 && !isSelected && (
                  <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Month stats */}
      <div className={`rounded-2xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
        <h4 className={`text-xs font-black mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Resumen del Mes
        </h4>
        <div className="grid grid-cols-5 gap-2">
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{monthStats.riegos}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>Riegos</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>{monthStats.fertilizantes}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>Fertiliz.</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{monthStats.salud}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-orange-500' : 'text-orange-600'}`}>Salud</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>{monthStats.podas}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-pink-500' : 'text-pink-600'}`}>Podas</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{monthStats.completadas}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-purple-500' : 'text-purple-600'}`}>Hechas</p>
          </div>
        </div>
      </div>

      {/* Selected date tasks */}
      {selectedDate && (
        <div className={`rounded-2xl p-4 shadow-cute animate-fade-in ${
          isDark ? 'bg-gray-800/80 border-2 border-indigo-900' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-black text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Tareas del {selectedDate.split('-').reverse().join('/')}
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {selectedTasks.length} tarea{selectedTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {selectedTasks.length === 0 ? (
            <div className="text-center py-6">
              <Icon emoji="📭" size={40} className="mx-auto opacity-50" />
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sin tareas para este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-start gap-3 rounded-xl p-3 border-2 transition-all ${
                    task.status === 'completado' ? 'opacity-60' : ''
                  } ${
                    isDark 
                      ? `${task.color === 'blue' ? 'bg-blue-900/30 border-blue-800' : 
                           task.color === 'green' ? 'bg-green-900/30 border-green-800' :
                           task.color === 'orange' ? 'bg-orange-900/30 border-orange-800' :
                           'bg-pink-900/30 border-pink-800'}`
                      : `${task.color === 'blue' ? 'bg-blue-50 border-blue-200' : 
                           task.color === 'green' ? 'bg-green-50 border-green-200' :
                           task.color === 'orange' ? 'bg-orange-50 border-orange-200' :
                           'bg-pink-50 border-pink-200'}`
                  }`}
                >
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="flex-shrink-0 mt-0.5"
                  >
                    {task.status === 'completado' ? (
                      <CheckCircle2 size={20} className="text-green-500" />
                    ) : (
                      <Circle size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    )}
                  </button>
                  <div className="flex-shrink-0">
                    <Icon emoji={task.emoji} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${getTextClasses(task.color)} ${
                      task.status === 'completado' ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${getSubtitleClasses(task.color)}`}>
                      {task.subtitle}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getTaskColorClasses(task.color)}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No date selected message */}
      {!selectedDate && (
        <div className={`text-center py-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}`}>
          <Icon emoji="👆" size={32} className="mx-auto opacity-50" />
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Selecciona un día para ver las tareas
          </p>
        </div>
      )}
    </div>
  );
}
