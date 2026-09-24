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
import { FertilizerInventory } from './components/FertilizerInventory';
import { FertilizationPlan } from './components/FertilizationPlan';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FontSizeProvider } from './context/FontSizeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { FontSizeControl } from './components/FontSizeControl';
import { LoadingAnimation } from './components/LoadingAnimation';
import { Icon } from './components/Icon';
import { Seedling, Sparkles as SparklesIcon, Package, Chart, Download, Refresh } from './components/Icons';
import { Home, Plus, BarChart3, Save, Calendar as CalendarIcon, Trophy, Flower2, FileText, FlaskConical, CalendarDays, FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { exportToCsv, exportToExcel, processSpreadsheetFile } from './utils/spreadsheetExportImport';
import { useConfetti, ConfettiOverlay } from './components/Confetti';

type TabType = 'dashboard' | 'registro' | 'analisis' | 'ficha' | 'calendar' | 'achievements' | 'garden' | 'infographic' | 'fertilizers' | 'fertilization-plan' | 'settings';

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
            <div className="relative flex-shrink-0">
              <img 
                src="/app-icon.jpg" 
                alt="Logo Mi Huerto" 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-cute object-cover border-2 border-white/80 dark:border-gray-700 animate-wiggle"
              />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse-soft"></div>
            </div>
            <div>
              <h1 className={`text-base sm:text-lg font-black leading-tight ${isDark ? 'text-gray-100' : 'text-green-900'}`}>Mi Huerto</h1>
              <p className={`text-[9px] sm:text-[10px] font-medium -mt-0.5 ${isDark ? 'text-gray-400' : 'text-green-600'}`}>Tu jardín feliz</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 sm:p-2 rounded-xl transition-all btn-cute shadow-sm flex items-center gap-1 ${
                isDark 
                  ? 'bg-gray-800 text-emerald-400 hover:bg-gray-700' 
                  : 'bg-white/80 text-emerald-600 hover:bg-white'
              }`}
              title="Gestión de Datos (Excel, CSV, Backup)"
              aria-label="Gestión de Datos"
            >
              <Save size={18} />
            </button>
            <FontSizeControl />
            <ThemeToggle />
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
        {activeTab === 'fertilizers' && <FertilizerInventory />}
        {activeTab === 'fertilization-plan' && <FertilizationPlan />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="max-w-lg mx-auto px-2 sm:px-3 pb-1 sm:pb-2">
          <div className={`rounded-2xl shadow-cute-lg border px-1 sm:px-2 py-1.5 sm:py-2 flex justify-around items-center ${
            isDark ? 'bg-gray-800/95 border-gray-700' : 'glass-strong border-white/60'
          } backdrop-blur-md`}>
            <NavButton label="Inicio" iconKey="home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} color="green" isDark={isDark} />
            <NavButton label="Calendario" iconKey="calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} color="indigo" isDark={isDark} />
            <NavButton label="Fertilizantes" iconKey="fertilizers" active={activeTab === 'fertilizers'} onClick={() => setActiveTab('fertilizers')} color="blue" isDark={isDark} />
            <NavButton label="Plan" iconKey="fertilization-plan" active={activeTab === 'fertilization-plan'} onClick={() => setActiveTab('fertilization-plan')} color="orange" isDark={isDark} />
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
  label: string; iconKey: 'home' | 'calendar' | 'trophy' | 'garden' | 'infographic' | 'fertilizers' | 'fertilization-plan'; active: boolean; onClick: () => void; color: string; isDark: boolean;
}) {
  const icons = {
    home: <Home size={20} />,
    calendar: <CalendarIcon size={20} />,
    trophy: <Trophy size={20} />,
    garden: <Flower2 size={20} />,
    infographic: <FileText size={20} />,
    fertilizers: <FlaskConical size={20} />,
    'fertilization-plan': <CalendarDays size={20} />,
  };

  const inlineIcons = {
    home: '🏠',
    calendar: '📅',
    trophy: '🏆',
    garden: '🏡',
    infographic: '📊',
    fertilizers: '🧪',
    'fertilization-plan': '📆',
  };

  const colors: Record<string, string> = {
    green: active ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    indigo: active ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-lg shadow-indigo-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    yellow: active ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    pink: active ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    blue: active ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    purple: active ? 'bg-gradient-to-br from-purple-400 to-violet-500 text-white shadow-lg shadow-purple-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
    orange: active ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-200/50' : isDark ? 'text-gray-400' : 'text-gray-500',
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
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { pieces, trigger: triggerConfetti } = useConfetti();

  const handleExportExcel = async () => {
    try {
      const plantas = await db.plantas.toArray();
      const riegos = await db.riegos.toArray();
      exportToExcel(plantas, riegos);
      setStatusMsg({ type: 'success', text: '📊 ¡Archivo Excel (.xlsx) exportado con éxito!' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Error al exportar a Excel: ' + (err?.message || 'Error desconocido') });
    }
  };

  const handleExportCsv = async () => {
    try {
      const plantas = await db.plantas.toArray();
      const riegos = await db.riegos.toArray();
      exportToCsv(plantas, riegos);
      setStatusMsg({ type: 'success', text: '📄 ¡Archivo CSV exportado con éxito!' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Error al exportar a CSV: ' + (err?.message || 'Error desconocido') });
    }
  };

  const handleExportJson = async () => {
    try {
      const data = {
        plantas: await db.plantas.toArray(),
        riegos: await db.riegos.toArray(),
        bitacora: await db.bitacora.toArray(),
        salud: await db.salud.toArray(),
        cosechas: await db.cosechas.toArray(),
        fertilizantes: await db.fertilizantes.toArray(),
        planesFertilizacion: await db.planesFertilizacion.toArray(),
      };
      const content = JSON.stringify(data, null, 2);
      const filename = `huerto_backup_${new Date().toISOString().split('T')[0]}.json`;
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: '💾 ¡Copia JSON completa exportada!' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Error al exportar JSON: ' + (err?.message || 'Error desconocido') });
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const result = await processSpreadsheetFile(file, importMode);
      triggerConfetti();
      setStatusMsg({ type: 'success', text: `✨ ${result.message}` });
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `❌ ${err?.message || 'Error al importar el archivo'}` });
      setIsProcessing(false);
    }
  };

  const resetData = async () => {
    if (confirm('⚠️ ¿Seguro que quieres borrar TODOS los datos y restaurar los de ejemplo?')) {
      await db.plantas.clear();
      await db.riegos.clear();
      await db.bitacora.clear();
      await db.salud.clear();
      await db.cosechas.clear();
      await db.fertilizantes.clear();
      await db.planesFertilizacion.clear();
      await db.plantas.bulkAdd(plantasIniciales as any);
      await db.riegos.bulkAdd(riegosIniciales as any);
      await db.bitacora.bulkAdd(bitacoraInicial as any);
      await db.salud.bulkAdd(saludInicial as any);
      await db.cosechas.bulkAdd(cosechasIniciales as any);
      alert('🔄 ¡Datos reiniciados a los valores de ejemplo!');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <ConfettiOverlay pieces={pieces} />
      <div 
        className={`rounded-t-3xl w-full max-w-lg max-h-[88vh] overflow-y-auto animate-slide-up shadow-2xl ${
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
              <Save size={24} className={isDark ? 'text-emerald-400' : 'text-emerald-500'} flex-shrink-0 />
              <h2 className={`text-base sm:text-lg font-black truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Gestión de Datos</h2>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all btn-cute active:scale-95 flex-shrink-0 ${
                isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Cerrar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div className={`mx-4 mt-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce-in ${
            statusMsg.type === 'success'
              ? isDark ? 'bg-emerald-950/70 border border-emerald-700 text-emerald-200' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : isDark ? 'bg-rose-950/70 border border-rose-700 text-rose-200' : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <AlertCircle size={18} className="flex-shrink-0" />}
            <span className="flex-1">{statusMsg.text}</span>
          </div>
        )}
        
        <div className="p-4 pb-8 space-y-4">
          {/* SECCIÓN EXPORTAR */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 px-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Exportar Datos (Formato 2 Tablas)
            </h3>
            <div className="space-y-2.5">
              {/* Botón Excel */}
              <button 
                onClick={handleExportExcel} 
                className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
                  isDark ? 'bg-emerald-900/30 border-emerald-700 hover:bg-emerald-900/40' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-emerald-800/60 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <FileSpreadsheet size={24} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`font-black text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>Exportar Excel (.xlsx)</p>
                  <p className={`text-xs ${isDark ? 'text-emerald-400/80' : 'text-emerald-700'}`}>Formato 2 tablas (Riegos + Resumen por Planta)</p>
                </div>
              </button>
              
              {/* Botón CSV */}
              <button 
                onClick={handleExportCsv} 
                className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute active:scale-[0.98] ${
                  isDark ? 'bg-blue-900/30 border-blue-700 hover:bg-blue-900/40' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-blue-800/60 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Chart size={24} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`font-black text-sm ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>Exportar CSV (.csv)</p>
                  <p className={`text-xs ${isDark ? 'text-blue-400/80' : 'text-blue-700'}`}>Formato exacto con codificación UTF-8 compatible</p>
                </div>
              </button>

              {/* Botón JSON */}
              <button 
                onClick={handleExportJson} 
                className={`w-full flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border transition-all btn-cute ${
                  isDark ? 'bg-gray-800/60 border-gray-700 hover:bg-gray-700/60' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-gray-700 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  <Package size={20} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`font-bold text-xs ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Backup JSON Completo</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Incluye bitácora, cosechas y salud vegetal</p>
                </div>
              </button>
            </div>
          </div>

          {/* SECCIÓN IMPORTAR */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-wider mb-2.5 px-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Importar Datos
            </h3>

            {/* Selector de modo de importación */}
            <div className={`p-2.5 rounded-2xl border mb-3 flex items-center justify-between gap-2 text-xs ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-amber-50/50 border-amber-100'
            }`}>
              <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-amber-900'}`}>Modo de riego:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    importMode === 'replace'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reemplazar
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    importMode === 'merge'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Añadir / Fusionar
                </button>
              </div>
            </div>

            {/* Input file button */}
            <label className={`w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border-2 transition-all btn-cute shadow-cute cursor-pointer active:scale-[0.98] ${
              isProcessing ? 'opacity-50 pointer-events-none' : ''
            } ${
              isDark ? 'bg-amber-900/30 border-amber-700 hover:bg-amber-900/40' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-300'
            }`}>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.json,.txt"
                className="hidden"
                disabled={isProcessing}
                onChange={handleFileImport}
              />
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-amber-800/60 text-amber-300' : 'bg-amber-100 text-amber-700'
              }`}>
                <Upload size={24} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
                  {isProcessing ? 'Procesando archivo...' : 'Seleccionar Archivo (Excel / CSV / JSON)'}
                </p>
                <p className={`text-xs ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>
                  Restaura o carga automáticamente plantas y riegos
                </p>
              </div>
            </label>
          </div>

          {/* REINICIAR */}
          <div className="pt-2 border-t border-dashed border-gray-300/40 dark:border-gray-700/60">
            <button onClick={resetData} className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all btn-cute ${
              isDark ? 'bg-red-950/20 border-red-900/40 hover:bg-red-950/30' : 'bg-red-50/50 border-red-200 hover:bg-red-100/60'
            }`}>
              <Refresh size={20} className={isDark ? 'text-red-400' : 'text-red-500'} />
              <div className="text-left flex-1 min-w-0">
                <p className={`font-bold text-xs ${isDark ? 'text-red-300' : 'text-red-800'}`}>Reiniciar a datos de ejemplo</p>
                <p className={`text-[10px] ${isDark ? 'text-red-400/70' : 'text-red-600'}`}>Borra las modificaciones actuales</p>
              </div>
            </button>
          </div>
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
