import { useState, useEffect } from 'react';
import { db } from './db/database';
import { plantasIniciales, riegosIniciales, bitacoraInicial, saludInicial, cosechasIniciales } from './data/seedData';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import Analisis from './pages/Analisis';
import FichaPlanta from './pages/FichaPlanta';
import Calendar from './components/Calendar';
import { Achievements } from './components/Achievements';
import { VirtualGarden } from './components/VirtualGarden';
import { InfographicGenerator } from './components/InfographicGenerator';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FontSizeProvider } from './context/FontSizeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { FontSizeControl } from './components/FontSizeControl';
import { LoadingAnimation } from './components/LoadingAnimation';
import { Icon } from './components/Icon';
import { Seedling, Sparkles as SparklesIcon, Package, Chart, Download, Refresh } from './components/Icons';
import { Home, Plus, BarChart3, Save, Calendar as CalendarIcon, Trophy, Flower2, FileText } from 'lucide-react';

type TabType = 'dashboard' | 'registro' | 'analisis' | 'ficha' | 'calendar' | 'achievements' | 'garden' | 'infographic' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedPlanta, setSelectedPlanta] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const initDB = async () => {
      const count = await db.plantas.count();
      if (count === 0) {
        await db.plantas.bulkAdd(plantasIniciales as any);
        await db.riegos.bulkAdd(riegosIniciales as any);
        await db.bitacora.bulkAdd(bitacoraInicial as any);
        await db.salud.bulkAdd(saludInicial as any);
        await db.cosechas.bulkAdd(cosechasIniciales as any);
      }
      setIsInitialized(true);
    };
    initDB();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const openFicha = (nombre: string) => {
    setSelectedPlanta(nombre);
    setActiveTab('ficha');
  };

  if (!isInitialized || showWelcome) {
    return <LoadingAnimation type="growing" message="Preparando tu jardín mágico..." />;
  }

  return (
    <div className={`min-h-screen pb-24 max-w-lg mx-auto transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-emerald-50/50 to-yellow-50/30 bg-pattern'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 border-b ${
        isDark ? 'bg-gray-900/90 border-gray-700' : 'glass-strong border-white/50'
      } backdrop-blur-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative">
              <Seedling size={24} className="animate-wiggle sm:hidden" />
              <Seedling size={28} className="animate-wiggle hidden sm:block" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse-soft"></div>
            </div>
            <div>
              <h1 className={`text-base sm:text-lg font-black leading-tight ${isDark ? 'text-gray-100' : 'text-green-900'}`}>Mi Huerto</h1>
              <p className={`text-[9px] sm:text-[10px] font-medium -mt-0.5 ${isDark ? 'text-gray-400' : 'text-green-600'}`}>Tu jardín feliz</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontSizeControl />
            <ThemeToggle />
            <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-cute ${
              isDark ? 'bg-gray-700' : 'glass'
            }`}>
              <SparklesIcon size={10} className="text-yellow-500 sm:hidden" />
              <SparklesIcon size={12} className="text-yellow-500 hidden sm:block" />
              <span className={`text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-gray-300' : 'text-green-700'}`}>Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`px-3 sm:px-4 py-3 sm:py-4 pb-24 animate-fade-in ${isDark ? 'text-gray-200' : ''}`}>
        {activeTab === 'dashboard' && <Dashboard onOpenFicha={openFicha} />}
        {activeTab === 'registro' && <Registro />}
        {activeTab === 'analisis' && <Analisis />}
        {activeTab === 'ficha' && <FichaPlanta nombre={selectedPlanta} onBack={() => setActiveTab('dashboard')} />}
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'garden' && <VirtualGarden />}
        {activeTab === 'infographic' && <InfographicGenerator />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="max-w-lg mx-auto px-2 sm:px-3 pb-1 sm:pb-2">
          <div className={`rounded-2xl shadow-cute-lg border px-1 sm:px-2 py-1.5 sm:py-2 flex justify-around items-center ${
            isDark ? 'bg-gray-800/95 border-gray-700' : 'glass-strong border-white/60'
          } backdrop-blur-md`}>
            <NavButton label="Inicio" iconKey="home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} color="green" isDark={isDark} />
            <NavButton label="Calendario" iconKey="calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} color="indigo" isDark={isDark} />
            <NavButton label="Resumen" iconKey="infographic" active={activeTab === 'infographic'} onClick={() => setActiveTab('infographic')} color="purple" isDark={isDark} />
            <NavButton label="Logros" iconKey="trophy" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} color="yellow" isDark={isDark} />
            <NavButton label="Jardín" iconKey="garden" active={activeTab === 'garden'} onClick={() => setActiveTab('garden')} color="pink" isDark={isDark} />
          </div>
        </div>
      </nav>

      {activeTab === 'settings' && <SettingsPanel onClose={() => setActiveTab('dashboard')} isDark={isDark} />}
    </div>
  );
}

function NavButton({ label, iconKey, active, onClick, color, isDark }: { 
  label: string; iconKey: 'home' | 'calendar' | 'trophy' | 'garden' | 'infographic'; active: boolean; onClick: () => void; color: string; isDark: boolean;
}) {
  const icons = {
    home: <Home size={20} />,
    calendar: <CalendarIcon size={20} />,
    trophy: <Trophy size={20} />,
    garden: <Flower2 size={20} />,
    infographic: <FileText size={20} />,
  };

  const inlineIcons = {
    home: '🏠',
    calendar: '📅',
    trophy: '🏆',
    garden: '🏡',
    infographic: '📊',
  };

  const colors: Record<string, string> = {
    green: active ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    indigo: active ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-indigo-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    yellow: active ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    pink: active ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    blue: active ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    purple: active ? 'bg-gradient-to-br from-purple-400 to-violet-500 text-white shadow-lg shadow-purple-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 btn-cute min-w-[50px] sm:min-w-[60px] ${
        active ? `${colors[color]} scale-105` : isDark ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100/50 active:bg-gray-100'
      }`}
    >
      <span className="text-base leading-none">{active ? <Icon emoji={inlineIcons[iconKey]} size={20} /> : icons[iconKey]}</span>
      <span className={`text-[9px] sm:text-[10px] font-bold leading-tight ${active ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

function SettingsPanel({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  const exportData = async (format: 'json' | 'csv') => {
    const data = {
      plantas: await db.plantas.toArray(),
      riegos: await db.riegos.toArray(),
      bitacora: await db.bitacora.toArray(),
      salud: await db.salud.toArray(),
      cosechas: await db.cosechas.toArray(),
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `huerto_backup_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      const lines: string[] = [];
      lines.push('=== PLANTAS ===');
      lines.push('nombre,fase_actual,horario_solar,frecuencia_riego_dias,ajuste_manejo,fertilizantes,prohibiciones');
      data.plantas.forEach(p => {
        lines.push(`"${p.nombre}","${p.fase_actual}","${p.horario_solar}",${p.frecuencia_riego_dias},"${p.ajuste_manejo}","${p.fertilizantes_recomendados}","${p.prohibiciones}"`);
      });
      lines.push('\n=== RIEGOS ===');
      lines.push('planta_nombre,fecha,tipo,cantidad');
      data.riegos.forEach(r => {
        lines.push(`"${r.planta_nombre}","${r.fecha}","${r.tipo}","${r.cantidad}"`);
      });
      content = lines.join('\n');
      filename = `huerto_backup_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await db.plantas.clear();
        await db.riegos.clear();
        await db.bitacora.clear();
        await db.salud.clear();
        await db.cosechas.clear();
        if (data.plantas) await db.plantas.bulkAdd(data.plantas);
        if (data.riegos) await db.riegos.bulkAdd(data.riegos);
        if (data.bitacora) await db.bitacora.bulkAdd(data.bitacora);
        if (data.salud) await db.salud.bulkAdd(data.salud);
        if (data.cosechas) await db.cosechas.bulkAdd(data.cosechas);
        alert('✨ ¡Datos restaurados con éxito!');
        window.location.reload();
      } catch (err) {
        alert('❌ Error al importar: archivo no válido');
      }
    };
    input.click();
  };

  const resetData = async () => {
    if (confirm('⚠️ ¿Seguro que quieres borrar TODOS los datos?')) {
      await db.plantas.clear();
      await db.riegos.clear();
      await db.bitacora.clear();
      await db.salud.clear();
      await db.cosechas.clear();
      await db.plantas.bulkAdd(plantasIniciales as any);
      await db.riegos.bulkAdd(riegosIniciales as any);
      await db.bitacora.bulkAdd(bitacoraInicial as any);
      await db.salud.bulkAdd(saludInicial as any);
      await db.cosechas.bulkAdd(cosechasIniciales as any);
      alert('🔄 ¡Datos reiniciados!');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div 
        className={`rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl ${
          isDark ? 'bg-gray-800/95 border-t-2 border-gray-700' : 'bg-white/95 border-t-2 border-white/50'
        } backdrop-blur-xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`sticky top-0 pt-4 pb-3 px-4 sm:px-6 border-b z-10 ${
          isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-100'
        } backdrop-blur-xl`}>
          <div className={`w-12 h-1.5 rounded-full mx-auto mb-3 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Save size={24} className={isDark ? 'text-blue-400' : 'text-blue-500'} flex-shrink-0 />
              <h2 className={`text-base sm:text-lg font-black truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Gestión de Datos</h2>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all btn-cute active:scale-95 flex-shrink-0 ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Cerrar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4 pb-6 space-y-3">
          <button onClick={() => exportData('json')} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
            isDark ? 'bg-green-900/30 border-green-800' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            <Package size={32} />
            <div className="text-left flex-1 min-w-0">
              <p className={`font-bold text-sm ${isDark ? 'text-green-300' : 'text-green-900'}`}>Exportar JSON</p>
              <p className={`text-xs ${isDark ? 'text-green-400' : 'text-green-700'}`}>Backup completo</p>
            </div>
          </button>
          
          <button onClick={() => exportData('csv')} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
            isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
          }`}>
            <Chart size={32} />
            <div className="text-left flex-1 min-w-0">
              <p className={`font-bold text-sm ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Exportar CSV</p>
              <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Compatible con Excel</p>
            </div>
          </button>
          
          <button onClick={importData} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
            isDark ? 'bg-amber-900/30 border-amber-800' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
          }`}>
            <Download size={32} />
            <div className="text-left flex-1 min-w-0">
              <p className={`font-bold text-sm ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>Importar JSON</p>
              <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Restaurar backup</p>
            </div>
          </button>
          
          <button onClick={resetData} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
            isDark ? 'bg-red-900/30 border-red-800' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
          }`}>
            <Refresh size={32} />
            <div className="text-left flex-1 min-w-0">
              <p className={`font-bold text-sm ${isDark ? 'text-red-300' : 'text-red-900'}`}>Reiniciar datos</p>
              <p className={`text-xs ${isDark ? 'text-red-400' : 'text-red-700'}`}>Volver a datos de ejemplo</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FontSizeProvider>
        <AppContent />
      </FontSizeProvider>
    </ThemeProvider>
  );
}
