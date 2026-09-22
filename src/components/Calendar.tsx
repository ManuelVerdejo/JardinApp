import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const riegos = useLiveQuery(() => db.riegos.toArray()) || [];
  const cosechas = useLiveQuery(() => db.cosechas.toArray()) || [];
  const bitacora = useLiveQuery(() => db.bitacora.toArray()) || [];
  const salud = useLiveQuery(() => db.salud.toArray()) || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (date: string) => {
    return {
      riegos: riegos.filter(r => r.fecha === date),
      cosechas: cosechas.filter(c => c.fecha === date),
      bitacora: bitacora.filter(b => b.fecha === date),
      salud: salud.filter(s => s.fecha_deteccion === date),
    };
  };

  const hasEvents = (date: string) => {
    const events = getEventsForDate(date);
    return events.riegos.length + events.cosechas.length + events.bitacora.length + events.salud.length;
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📅" size={40} className="mx-auto animate-float" />
        <h2 className="text-lg font-black text-gray-800 dark:text-gray-200 mt-2">Calendario del Huerto</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Visualiza todos los eventos</p>
      </div>

      {/* Calendar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-indigo-100 dark:border-indigo-900 p-3 sm:p-4 shadow-cute-lg">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors btn-cute">
            <ChevronLeft size={16} className="text-indigo-600 dark:text-indigo-400" />
          </button>
          <h3 className="text-sm sm:text-base font-black text-gray-800 dark:text-gray-200">
            {monthNames[month]} {year}
          </h3>
          <button onClick={nextMonth} className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors btn-cute">
            <ChevronRight size={16} className="text-indigo-600 dark:text-indigo-400" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 py-1">
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
            const eventCount = hasEvents(dateStr);
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center relative transition-all btn-cute ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg scale-110'
                    : isToday
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">{day}</span>
                {eventCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(eventCount, 3) }).map((_, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400 dark:bg-indigo-500'}`}></div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date events */}
      {selectedDate && selectedEvents && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 p-4 shadow-cute animate-fade-in">
          <h4 className="font-black text-sm text-gray-800 dark:text-gray-200 mb-3">
            Eventos del {selectedDate.split('-').reverse().join('/')}
          </h4>
          
          {selectedEvents.riegos.length + selectedEvents.cosechas.length + selectedEvents.bitacora.length + selectedEvents.salud.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">Sin eventos este día</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.riegos.map((r, i) => (
                <div key={`riego-${i}`} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-2">
                  <Icon emoji="💧" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-300 truncate">{r.planta_nombre}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">{r.tipo} · {r.cantidad}</p>
                  </div>
                </div>
              ))}
              {selectedEvents.cosechas.map((c, i) => (
                <div key={`cosecha-${i}`} className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl p-2">
                  <Icon emoji="✂️" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-purple-800 dark:text-purple-300 truncate">{c.planta_nombre}</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400">{c.parte_cosechada} · {c.cantidad_estimada} uds</p>
                  </div>
                </div>
              ))}
              {selectedEvents.bitacora.map((b, i) => (
                <div key={`bitacora-${i}`} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 rounded-xl p-2">
                  <Icon emoji="📏" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-green-800 dark:text-green-300 truncate">{b.planta_nombre}</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400">{b.altura_cm} cm</p>
                  </div>
                </div>
              ))}
              {selectedEvents.salud.map((s, i) => (
                <div key={`salud-${i}`} className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl p-2">
                  <Icon emoji="🐛" size={16} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-orange-800 dark:text-orange-300 truncate">{s.planta_nombre}</p>
                    <p className="text-[10px] text-orange-600 dark:text-orange-400">{s.sintoma_riesgo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
