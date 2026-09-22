import { useState, useEffect } from 'react';
import { db } from './db/database';
import { plantasIniciales, riegosIniciales, bitacoraInicial, saludInicial, cosechasIniciales } from './data/seedData';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import Analisis from './pages/Analisis';
import FichaPlanta from './pages/FichaPlanta';
import { Home, Plus, BarChart3, Settings, Leaf } from 'lucide-react';

type TabType = 'dashboard' | 'registro' | 'analisis' | 'ficha' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedPlanta, setSelectedPlanta] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

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

  const openFicha = (nombre: string) => {
    setSelectedPlanta(nombre);
    setActiveTab('ficha');
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-green-600 mx-auto animate-pulse" />
          <p className="mt-4 text-green-800 font-medium text-lg">Cargando tu huerto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 pb-20 max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-green-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="text-lg font-bold text-green-900">Mi Huerto</h1>
          </div>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Offline ✓</span>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4">
        {activeTab === 'dashboard' && <Dashboard onOpenFicha={openFicha} />}
        {activeTab === 'registro' && <Registro />}
        {activeTab === 'analisis' && <Analisis />}
        {activeTab === 'ficha' && <FichaPlanta nombre={selectedPlanta} onBack={() => setActiveTab('dashboard')} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-lg z-50">
        <div className="max-w-lg mx-auto flex justify-around items-center py-2">
          <NavButton
            icon={<Home size={20} />}
            label="Inicio"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <NavButton
            icon={<Plus size={20} />}
            label="Registro"
            active={activeTab === 'registro'}
            onClick={() => setActiveTab('registro')}
          />
          <NavButton
            icon={<BarChart3 size={20} />}
            label="Análisis"
            active={activeTab === 'analisis'}
            onClick={() => setActiveTab('analisis')}
          />
          <NavButton
            icon={<Settings size={20} />}
            label="Datos"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </div>
      </nav>

      {/* Settings Modal */}
      {activeTab === 'settings' && <SettingsPanel onClose={() => setActiveTab('dashboard')} />}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
        active ? 'text-green-700 bg-green-50' : 'text-gray-500 hover:text-green-600'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
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
      // CSV export - concatenar todas las tablas
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
        // Limpiar y restaurar
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
        alert('✅ Datos restaurados correctamente');
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
      // Re-seed
      await db.plantas.bulkAdd(plantasIniciales as any);
      await db.riegos.bulkAdd(riegosIniciales as any);
      await db.bitacora.bulkAdd(bitacoraInicial as any);
      await db.salud.bulkAdd(saludInicial as any);
      await db.cosechas.bulkAdd(cosechasIniciales as any);
      alert('🔄 Datos reiniciados');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Gestión de Datos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => exportData('json')}
            className="w-full flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl">📦</span>
            <div className="text-left">
              <p className="font-semibold text-green-900">Exportar JSON</p>
              <p className="text-xs text-green-700">Backup completo de todos los datos</p>
            </div>
          </button>
          
          <button
            onClick={() => exportData('csv')}
            className="w-full flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-semibold text-blue-900">Exportar CSV</p>
              <p className="text-xs text-blue-700">Compatible con Excel y hojas de cálculo</p>
            </div>
          </button>
          
          <button
            onClick={importData}
            className="w-full flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <span className="text-2xl">📥</span>
            <div className="text-left">
              <p className="font-semibold text-amber-900">Importar JSON</p>
              <p className="text-xs text-amber-700">Restaurar desde un backup anterior</p>
            </div>
          </button>
          
          <button
            onClick={resetData}
            className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
          >
            <span className="text-2xl">🔄</span>
            <div className="text-left">
              <p className="font-semibold text-red-900">Reiniciar datos</p>
              <p className="text-xs text-red-700">Volver a los datos de ejemplo</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
