import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Droplets, Ruler, Bug, Scissors, Check } from 'lucide-react';

type FormType = 'riego' | 'crecimiento' | 'salud' | 'cosecha';

export default function Registro() {
  const [activeForm, setActiveForm] = useState<FormType>('riego');
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const [showSuccess, setShowSuccess] = useState(false);

  const nombres = plantas.map(p => p.nombre);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const forms = [
    { id: 'riego' as const, icon: <Droplets size={18} />, label: 'Riego', color: 'bg-blue-500' },
    { id: 'crecimiento' as const, icon: <Ruler size={18} />, label: 'Altura', color: 'bg-green-500' },
    { id: 'salud' as const, icon: <Bug size={18} />, label: 'Salud', color: 'bg-orange-500' },
    { id: 'cosecha' as const, icon: <Scissors size={18} />, label: 'Cosecha', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <Check size={16} />
          <span className="text-sm font-medium">¡Registrado!</span>
        </div>
      )}

      {/* Form tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {forms.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveForm(f.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeForm === f.id
                ? `${f.color} text-white shadow-md`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Forms */}
      {activeForm === 'riego' && <FormRiego nombres={nombres} onSuccess={handleSuccess} />}
      {activeForm === 'crecimiento' && <FormCrecimiento nombres={nombres} onSuccess={handleSuccess} />}
      {activeForm === 'salud' && <FormSalud nombres={nombres} onSuccess={handleSuccess} />}
      {activeForm === 'cosecha' && <FormCosecha nombres={nombres} onSuccess={handleSuccess} />}
    </div>
  );
}

// ============ FORMULARIO DE RIEGO ============
function FormRiego({ nombres, onSuccess }: { nombres: string[]; onSuccess: () => void }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [tipo, setTipo] = useState('Agua limpia');
  const [cantidad, setCantidad] = useState('Normal');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const tipos = ['Agua limpia', 'Té de plátano', 'Infusión de café', 'Agua de arroz', 'Cáscara de huevo', 'Humus líquido', 'Infusión de arroz'];
  const cantidades = ['Poca', 'Normal', 'Mucha'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.riegos.add({ planta_nombre: planta, fecha, tipo, cantidad });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <Droplets size={16} className="text-blue-500" /> Registrar Riego
      </h3>
      
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Planta</label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Tipo de riego</label>
        <div className="grid grid-cols-2 gap-1.5">
          {tipos.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`p-2 rounded-lg text-xs font-medium border transition-all ${
                tipo === t ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Cantidad</label>
        <div className="flex gap-2">
          {cantidades.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCantidad(c)}
              className={`flex-1 p-2 rounded-lg text-xs font-medium border transition-all ${
                cantidad === c ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {c === 'Poca' ? '💧' : c === 'Normal' ? '💧💧' : '💧💧💧'} {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-300 outline-none" />
      </div>

      <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
        💧 Registrar Riego
      </button>
    </form>
  );
}

// ============ FORMULARIO DE CRECIMIENTO ============
function FormCrecimiento({ nombres, onSuccess }: { nombres: string[]; onSuccess: () => void }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [altura, setAltura] = useState('');
  const [numPlantas, setNumPlantas] = useState('1');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!altura) return;
    await db.bitacora.add({ planta_nombre: planta, fecha, altura_cm: parseFloat(altura), num_plantas: parseInt(numPlantas) });
    onSuccess();
    setAltura('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <Ruler size={16} className="text-green-500" /> Medición de Crecimiento
      </h3>
      
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Planta</label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-green-300 outline-none">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Altura (cm)</label>
          <input type="number" step="0.1" value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ej: 12.5" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-green-300 outline-none" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Nº plantas</label>
          <input type="number" value={numPlantas} onChange={e => setNumPlantas(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-green-300 outline-none" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-green-300 outline-none" />
      </div>

      <button type="submit" className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
        📏 Registrar Medición
      </button>
    </form>
  );
}

// ============ FORMULARIO DE SALUD ============
function FormSalud({ nombres, onSuccess }: { nombres: string[]; onSuccess: () => void }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [sintoma, setSintoma] = useState('');
  const [causa, setCausa] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [estado, setEstado] = useState<'En seguimiento' | 'Resuelto'>('En seguimiento');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaRevision, setFechaRevision] = useState('');

  const sintomasRapidos = ['Hojas amarillas', 'Manchas en hojas', 'Pulgones', 'Hojas caídas', 'Tallo débil', 'Moho blanco'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sintoma) return;
    await db.salud.add({
      planta_nombre: planta,
      fecha_deteccion: fecha,
      sintoma_riesgo: sintoma,
      causa_probable: causa,
      tratamiento_natural: tratamiento,
      estado,
      fecha_revision: fechaRevision || fecha,
    });
    onSuccess();
    setSintoma('');
    setCausa('');
    setTratamiento('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <Bug size={16} className="text-orange-500" /> Incidencia de Salud
      </h3>
      
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Planta</label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Síntoma (rápido)</label>
        <div className="flex flex-wrap gap-1.5">
          {sintomasRapidos.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setSintoma(s)}
              className={`px-2 py-1 rounded-lg text-xs border transition-all ${
                sintoma === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input type="text" value={sintoma} onChange={e => setSintoma(e.target.value)} placeholder="O escribe otro síntoma..." className="w-full mt-2 p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Causa probable</label>
        <input type="text" value={causa} onChange={e => setCausa(e.target.value)} placeholder="Ej: Exceso de humedad" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Tratamiento natural</label>
        <input type="text" value={tratamiento} onChange={e => setTratamiento(e.target.value)} placeholder="Ej: Infusión de cola de caballo" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-orange-300 outline-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Estado</label>
          <select value={estado} onChange={e => setEstado(e.target.value as any)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 outline-none">
            <option value="En seguimiento">En seguimiento</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Fecha revisión</label>
          <input type="date" value={fechaRevision} onChange={e => setFechaRevision(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 outline-none" />
        </div>
      </div>

      <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
        🐛 Registrar Incidencia
      </button>
    </form>
  );
}

// ============ FORMULARIO DE COSECHA ============
function FormCosecha({ nombres, onSuccess }: { nombres: string[]; onSuccess: () => void }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [parte, setParte] = useState('Hojas');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const partes = ['Hojas', 'Puntas', 'Tallos', 'Flores', 'Frutos', 'Raíces'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantidad) return;
    await db.cosechas.add({ planta_nombre: planta, fecha, parte_cosechada: parte, cantidad_estimada: parseInt(cantidad) });
    onSuccess();
    setCantidad('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <Scissors size={16} className="text-purple-500" /> Registrar Cosecha
      </h3>
      
      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Planta</label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Parte cosechada</label>
        <div className="flex flex-wrap gap-1.5">
          {partes.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setParte(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                parte === p ? 'bg-purple-500 text-white border-purple-500' : 'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Cantidad estimada (unidades)</label>
        <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Ej: 10" className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none" />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1 block">Fecha</label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:ring-2 focus:ring-purple-300 outline-none" />
      </div>

      <button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium text-sm transition-all active:scale-[0.98]">
        ✂️ Registrar Cosecha
      </button>
    </form>
  );
}
