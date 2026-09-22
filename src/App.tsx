import { useState, useEffect } from 'react';
import { db } from './db/database';
import { plantasIniciales, riegosIniciales, bitacoraInicial, saludInicial, cosechasIniciales } from './data/seedData';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import Analisis from './pages/Analisis';
import FichaPlanta from './pages/FichaPlanta';
import { Home, Plus, BarChart3, Settings, Leaf, Sparkles } from 'lucide-react';

type TabType = 'dashboard' | 'registro' | 'analisis' | 'ficha' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedPlanta, setSelectedPlanta] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Inicializar base de datos con datos semilla si está vacía
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

  // Pantalla de carga cute
  if (!isInitialized || showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-yellow-50 flex items-center justify-center bg-pattern">
        <div className="text-center animate-bounce-in">
          <div className="relative inline-block">
            <span className="text-7xl animate-float">🌱</span>
            <div className="absolute -top-2 -right-2 text-2xl animate-sparkle">✨</div>
            <div className="absolute -bottom-1 -left-3 text-xl animate-sparkle" style={{ animationDelay: '0.5s' }}>💧</div>
          </div>
          <h1 className="mt-6 text-3xl font-black text-green-800">Mi Huerto</h1>
          <p className="mt-2 text-sm text-green-600 font-medium">Preparando tu jardín mágico...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-yellow-50/30 pb-24 max-w-lg mx-auto bg-pattern">
      {/* Header cute */}
      <header className="sticky top-0 z-40 glass-strong px-4 py-3 border-b border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="text-2xl animate-wiggle">🌱</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse-soft"></div>
            </div>
            <div>
              <h1 className="text-lg font-black text-green-900 leading-tight">Mi Huerto</h1>
              <p className="text-[10px] text-green-600 font-medium -mt-0.5">Tu jardín feliz 🌿</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-cute">
              <Sparkles size={12} className="text-yellow-500" />
              <span className="text-[10px] font-bold text-green-700">Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 animate-fade-in">
        {activeTab === 'dashboard' && <Dashboard onOpenFicha={openFicha} />}
        {activeTab === 'registro' && <Registro />}
        {activeTab === 'analisis' && <Analisis />}
        {activeTab === 'ficha' && <FichaPlanta nombre={selectedPlanta} onBack={() => setActiveTab('dashboard')} />}
      </main>

      {/* Bottom Navigation cute */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
        <div className="max-w-lg mx-auto px-3 pb-2">
          <div className="glass-strong rounded-2xl shadow-cute-lg border border-white/60 px-2 py-2 flex justify-around items-center">
            <NavButton
              icon={<Home size={20} />}
              label="Inicio"
              emoji="🏠"
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              color="green"
            />
            <NavButton
              icon={<Plus size={20} />}
              label="Registro"
              emoji="✏️"
              active={activeTab === 'registro'}
              onClick={() => setActiveTab('registro')}
              color="pink"
            />
            <NavButton
              icon={<BarChart3 size={20} />}
              label="Análisis"
              emoji="📊"
              active={activeTab === 'analisis'}
              onClick={() => setActiveTab('analisis')}
              color="purple"
            />
            <NavButton
              icon={<Settings size={20} />}
              label="Datos"
              emoji="💾"
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              color="blue"
            />
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {activeTab === 'settings' && <SettingsPanel onClose={() => setActiveTab('dashboard')} />}
    </div>
  );
}

function NavButton({ icon, label, emoji, active, onClick, color }: { 
  icon: React.ReactNode; label: string; emoji: string; active: boolean; onClick: () => void; color: 'green' | 'pink' | 'purple' | 'blue'
}) {
  const colors: Record<string, string> = {
    green: active ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-200' : 'text-gray-500',
    pink: active ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-lg shadow-pink-200' : 'text-gray-500',
    purple: active ? 'bg-gradient-to-br from-purple-400 to-violet-500 text-white shadow-lg shadow-purple-200' : 'text-gray-500',
    blue: active ? 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg shadow-blue-200' : 'text-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-300 btn-cute ${
        active ? `${colors[color]} scale-105` : 'hover:bg-gray-100/50'
      }`}
    >
      <span className="text-base">{active ? emoji : ''}</span>
      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

function SettingsPanel({ onClose }: { onClose: () => void }) {
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
      lines.push('\n=== BITÁCORA ===');
      lines.push('fecha,planta_nombre,altura_cm,num_plantas');
      data.bitacora.forEach(b => {
        lines.push(`"${b.fecha}","${b.planta_nombre}",${b.altura_cm},${b.num_plantas}`);
      });
      lines.push('\n=== SALUD ===');
      lines.push('fecha_deteccion,planta_nombre,sintoma,causa,tratamiento,estado,fecha_revision');
      data.salud.forEach(s => {
        lines.push(`"${s.fecha_deteccion}","${s.planta_nombre}","${s.sintoma_riesgo}","${s.causa_probable}","${s.tratamiento_natural}","${s.estado}","${s.fecha_revision}"`);
      });
      lines.push('\n=== COSECHAS ===');
      lines.push('fecha,planta_nombre,parte_cosechada,cantidad');
      data.cosechas.forEach(c => {
        lines.push(`"${c.fecha}","${c.planta_nombre}","${c.parte_cosechada}",${c.cantidad_estimada}`);
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
    if (confirm('⚠️ ¿Seguro que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) {
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
    <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-end justify-center" onClick={onClose}>
      <div className="bg-white/95 backdrop-blur-xl rounded-t-3xl w-full max-w-lg p-6 pb-8 animate-slide-up border-t border-white/50" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <h2 className="text-xl font-black text-gray-900">Gestión de Datos</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors btn-cute">
            ×
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => exportData('json')}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:border-green-300 transition-all btn-cute shadow-cute"
          >
            <span className="text-3xl">📦</span>
            <div className="text-left">
              <p className="font-bold text-green-900">Exportar JSON</p>
              <p className="text-xs text-green-700">Backup completo de todos los datos</p>
            </div>
          </button>
          
          <button
            onClick={() => exportData('csv')}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-all btn-cute shadow-cute"
          >
            <span className="text-3xl">📊</span>
            <div className="text-left">
              <p className="font-bold text-blue-900">Exportar CSV</p>
              <p className="text-xs text-blue-700">Compatible con Excel y hojas de cálculo</p>
            </div>
          </button>
          
          <button
            onClick={importData}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-all btn-cute shadow-cute"
          >
            <span className="text-3xl">📥</span>
            <div className="text-left">
              <p className="font-bold text-amber-900">Importar JSON</p>
              <p className="text-xs text-amber-700">Restaurar desde un backup anterior</p>
            </div>
          </button>
          
          <button
            onClick={resetData}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 hover:border-red-300 transition-all btn-cute shadow-cute"
          >
            <span className="text-3xl">🔄</span>
            <div className="text-left">
              <p className="font-bold text-red-900">Reiniciar datos</p>
              <p className="text-xs text-red-700">Volver a los datos de ejemplo</p>
            </div>
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Hecho con 💚 para tu huerto</p>
        </div>
      </div>
    </div>
  );
}
