import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type EventType = 'riego' | 'cosecha' | 'medicion' | 'salud' | 'poda';

interface CalendarEvent {
  type: EventType;
  date: string;
  planta: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
}

export default function Calendar() {
  const { isDark } = useTheme();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(
    new Set(['riego', 'cosecha', 'medicion', 'salud', 'poda'])
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

  // Convertir todos los eventos a formato unificado
  const allEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Riegos
    riegos.forEach(r => {
      const planta = plantas.find(p => p.nombre === r.planta_nombre);
      events.push({
        type: 'riego',
        date: r.fecha,
        planta: r.planta_nombre,
        emoji: planta?.emoji || '💧',
        title: `Riego: ${r.planta_nombre}`,
        subtitle: `${r.tipo} · ${r.cantidad}`,
        color: 'blue',
        bgColor: 'bg-blue-50 border-blue-200',
        darkBgColor: 'dark:bg-blue-900/30 dark:border-blue-800',
      });
    });

    // Cosechas
    cosechas.forEach(c => {
      const planta = plantas.find(p => p.nombre === c.planta_nombre);
      events.push({
        type: 'cosecha',
        date: c.fecha,
        planta: c.planta_nombre,
        emoji: planta?.emoji || '✂️',
        title: `Cosecha: ${c.planta_nombre}`,
        subtitle: `${c.parte_cosechada} · ${c.cantidad_estimada} uds`,
        color: 'purple',
        bgColor: 'bg-purple-50 border-purple-200',
        darkBgColor: 'dark:bg-purple-900/30 dark:border-purple-800',
      });
    });

    // Mediciones de crecimiento
    bitacora.forEach(b => {
      const planta = plantas.find(p => p.nombre === b.planta_nombre);
      events.push({
        type: 'medicion',
        date: b.fecha,
        planta: b.planta_nombre,
        emoji: planta?.emoji || '📏',
        title: `Medición: ${b.planta_nombre}`,
        subtitle: `${b.altura_cm} cm · ${b.num_plantas} planta(s)`,
        color: 'green',
        bgColor: 'bg-green-50 border-green-200',
        darkBgColor: 'dark:bg-green-900/30 dark:border-green-800',
      });
    });

    // Incidencias de salud
    salud.forEach(s => {
      const planta = plantas.find(p => p.nombre === s.planta_nombre);
      events.push({
        type: 'salud',
        date: s.fecha_deteccion,
        planta: s.planta_nombre,
        emoji: planta?.emoji || '🐛',
        title: `Incidencia: ${s.planta_nombre}`,
        subtitle: `${s.sintoma_riesgo} · ${s.estado}`,
        color: 'orange',
        bgColor: 'bg-orange-50 border-orange-200',
        darkBgColor: 'dark:bg-orange-900/30 dark:border-orange-800',
      });
    });

    // Podas (simuladas basadas en ajuste_manejo de plantas)
    // En una implementación real, esto vendría de una tabla de podas
    // Por ahora, generamos eventos de poda cada 15 días para plantas que lo necesitan
    plantas.forEach(planta => {
      if (planta.ajuste_manejo.toLowerCase().includes('poda')) {
        // Generar podas cada 15 días del mes actual
        for (let day = 1; day <= daysInMonth; day += 15) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          events.push({
            type: 'poda',
            date: dateStr,
            planta: planta.nombre,
            emoji: planta.emoji,
            title: `Poda programada: ${planta.nombre}`,
            subtitle: planta.ajuste_manejo,
            color: 'pink',
            bgColor: 'bg-pink-50 border-pink-200',
            darkBgColor: 'dark:bg-pink-900/30 dark:border-pink-800',
          });
        }
      }
    });

    return events.filter(e => activeFilters.has(e.type));
  }, [riegos, cosechas, bitacora, salud, plantas, activeFilters, year, month, daysInMonth]);

  // Filtrar eventos del mes actual
  const monthEvents = useMemo(() => {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    return allEvents.filter(e => e.date.startsWith(monthStr));
  }, [allEvents, year, month]);

  // Contar eventos por día
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    monthEvents.forEach(event => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [monthEvents]);

  // Eventos del día seleccionado
  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  // Estadísticas del mes
  const monthStats = useMemo(() => {
    const stats = {
      riegos: monthEvents.filter(e => e.type === 'riego').length,
      cosechas: monthEvents.filter(e => e.type === 'cosecha').length,
      mediciones: monthEvents.filter(e => e.type === 'medicion').length,
      salud: monthEvents.filter(e => e.type === 'salud').length,
      podas: monthEvents.filter(e => e.type === 'poda').length,
    };
    return stats;
  }, [monthEvents]);

  const toggleFilter = (type: EventType) => {
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

  const filterConfig = {
    riego: { emoji: '💧', label: 'Riegos', color: 'blue' },
    cosecha: { emoji: '✂️', label: 'Cosechas', color: 'purple' },
    medicion: { emoji: '📏', label: 'Mediciones', color: 'green' },
    salud: { emoji: '🐛', label: 'Salud', color: 'orange' },
    poda: { emoji: '✂️', label: 'Podas', color: 'pink' },
  };

  const getEventColorClasses = (color: string, isSelected: boolean = false) => {
    const colors: Record<string, string> = {
      blue: isSelected ? 'bg-blue-500' : 'bg-blue-400 dark:bg-blue-600',
      purple: isSelected ? 'bg-purple-500' : 'bg-purple-400 dark:bg-purple-600',
      green: isSelected ? 'bg-green-500' : 'bg-green-400 dark:bg-green-600',
      orange: isSelected ? 'bg-orange-500' : 'bg-orange-400 dark:bg-orange-600',
      pink: isSelected ? 'bg-pink-500' : 'bg-pink-400 dark:bg-pink-600',
    };
    return colors[color] || 'bg-gray-400';
  };

  const getTextClasses = (color: string) => {
    const textColors: Record<string, string> = {
      blue: isDark ? 'text-blue-300' : 'text-blue-800',
      purple: isDark ? 'text-purple-300' : 'text-purple-800',
      green: isDark ? 'text-green-300' : 'text-green-800',
      orange: isDark ? 'text-orange-300' : 'text-orange-800',
      pink: isDark ? 'text-pink-300' : 'text-pink-800',
    };
    return textColors[color] || 'text-gray-800';
  };

  const getSubtitleClasses = (color: string) => {
    const subtitleColors: Record<string, string> = {
      blue: isDark ? 'text-blue-400' : 'text-blue-600',
      purple: isDark ? 'text-purple-400' : 'text-purple-600',
      green: isDark ? 'text-green-400' : 'text-green-600',
      orange: isDark ? 'text-orange-400' : 'text-orange-600',
      pink: isDark ? 'text-pink-400' : 'text-pink-600',
    };
    return subtitleColors[color] || 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📅" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Calendario del Huerto</h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Visualiza todos los eventos</p>
      </div>

      {/* Filtros */}
      <div className={`rounded-2xl p-3 shadow-cute ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Filtrar eventos</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(filterConfig) as EventType[]).map(type => {
            const config = filterConfig[type];
            const isActive = activeFilters.has(type);
            
            const activeGradients: Record<string, string> = {
              blue: 'bg-gradient-to-r from-blue-400 to-blue-500',
              purple: 'bg-gradient-to-r from-purple-400 to-purple-500',
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
            const dayEvents = eventsByDate[dateStr] || [];
            const eventCount = dayEvents.length;
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
                {eventCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-full px-0.5">
                    {dayEvents.slice(0, 4).map((event, j) => (
                      <div 
                        key={j} 
                        className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : getEventColorClasses(event.color)
                        }`}
                      ></div>
                    ))}
                    {eventCount > 4 && (
                      <span className={`text-[8px] font-bold ${isSelected ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        +{eventCount - 4}
                      </span>
                    )}
                  </div>
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
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{monthStats.cosechas}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-purple-500' : 'text-purple-600'}`}>Cosechas</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-green-900/30' : 'bg-green-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-700'}`}>{monthStats.mediciones}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-green-500' : 'text-green-600'}`}>Mediciones</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>{monthStats.salud}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-orange-500' : 'text-orange-600'}`}>Salud</p>
          </div>
          <div className={`text-center p-2 rounded-xl ${isDark ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
            <p className={`text-lg font-black ${isDark ? 'text-pink-400' : 'text-pink-700'}`}>{monthStats.podas}</p>
            <p className={`text-[9px] font-medium ${isDark ? 'text-pink-500' : 'text-pink-600'}`}>Podas</p>
          </div>
        </div>
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className={`rounded-2xl p-4 shadow-cute animate-fade-in ${
          isDark ? 'bg-gray-800/80 border-2 border-indigo-900' : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-100'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-black text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              Eventos del {selectedDate.split('-').reverse().join('/')}
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isDark ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              {selectedEvents.length} evento{selectedEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {selectedEvents.length === 0 ? (
            <div className="text-center py-6">
              <Icon emoji="📭" size={40} className="mx-auto opacity-50" />
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sin eventos este día</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedEvents.map((event, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-3 rounded-xl p-3 border-2 transition-all hover:scale-[1.02] ${
                    isDark ? event.darkBgColor : event.bgColor
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Icon emoji={event.emoji} size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${getTextClasses(event.color)}`}>
                      {event.title}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${getSubtitleClasses(event.color)}`}>
                      {event.subtitle}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${getEventColorClasses(event.color)}`}></div>
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
            Selecciona un día para ver los eventos
          </p>
        </div>
      )}
    </div>
  );
}
