import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from '../components/Icon';
import { useConfetti, ConfettiOverlay } from '../components/Confetti';
import { WaterDrop, Ruler, Bug, Scissors, Banana, Coffee, Rice, Egg, Worm, TestTube, Sun, Leaf as LeafIcon, Flower, Pepper, Carrot, Check, Pill, Clipboard as ClipboardIcon } from '../components/Icons';
import { Check as CheckLucide } from 'lucide-react';

type FormType = 'riego' | 'crecimiento' | 'salud' | 'cosecha';

export default function Registro() {
  const [activeForm, setActiveForm] = useState<FormType>('riego');
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const [showSuccess, setShowSuccess] = useState(false);
  const { pieces, trigger: triggerConfetti } = useConfetti();

  const nombres = plantas.map(p => p.nombre);

  const handleSuccess = () => {
    setShowSuccess(true);
    triggerConfetti();
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const forms = [
    { id: 'riego' as const, icon: '💧', label: 'Riego', gradient: 'from-blue-400 to-cyan-400', activeGradient: 'from-blue-500 to-cyan-500' },
    { id: 'crecimiento' as const, icon: '📏', label: 'Altura', gradient: 'from-green-400 to-emerald-400', activeGradient: 'from-green-500 to-emerald-500' },
    { id: 'salud' as const, icon: '🐛', label: 'Salud', gradient: 'from-orange-400 to-amber-400', activeGradient: 'from-orange-500 to-amber-500' },
    { id: 'cosecha' as const, icon: '✂️', label: 'Cosecha', gradient: 'from-purple-400 to-pink-400', activeGradient: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="space-y-5">
      <ConfettiOverlay pieces={pieces} />

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-5 py-3 rounded-2xl shadow-cute-lg flex items-center gap-2 border-2 border-white">
            <Check size={20} />
            <span className="text-sm font-black">¡Registrado con éxito!</span>
            <Icon emoji="💚" size={18} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📝" size={40} className="mx-auto animate-float" />
        <h2 className="text-lg font-black text-gray-800 mt-2">Registro Rápido</h2>
        <p className="text-xs text-gray-500 font-medium">Añade datos a tu huerto en un toque</p>
      </div>

      {/* Form tabs cute */}
      <div className="flex gap-2 overflow-x-auto pb-1 px-1">
        {forms.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveForm(f.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 btn-cute border-2 ${
              activeForm === f.id
                ? `bg-gradient-to-r ${f.activeGradient} text-white border-white shadow-lg scale-105`
                : `bg-white text-gray-600 border-gray-100 hover:border-gray-200 shadow-sm`
            }`}
          >
            <Icon emoji={f.icon} size={18} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="animate-fade-in">
        {activeForm === 'riego' && <FormRiego nombres={nombres} onSuccess={handleSuccess} plantas={plantas} />}
        {activeForm === 'crecimiento' && <FormCrecimiento nombres={nombres} onSuccess={handleSuccess} plantas={plantas} />}
        {activeForm === 'salud' && <FormSalud nombres={nombres} onSuccess={handleSuccess} plantas={plantas} />}
        {activeForm === 'cosecha' && <FormCosecha nombres={nombres} onSuccess={handleSuccess} plantas={plantas} />}
      </div>
    </div>
  );
}

// ============ FORMULARIO DE RIEGO ============
function FormRiego({ nombres, onSuccess, plantas }: { nombres: string[]; onSuccess: () => void; plantas: any[] }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [tipo, setTipo] = useState('Agua limpia');
  const [cantidad, setCantidad] = useState('Normal');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const tipos = [
    { name: 'Agua limpia', emoji: '💧' },
    { name: 'Té de plátano', emoji: '🍌' },
    { name: 'Infusión de café', emoji: '☕' },
    { name: 'Agua de arroz', emoji: '🍚' },
    { name: 'Cáscara de huevo', emoji: '🥚' },
    { name: 'Humus líquido', emoji: '🪱' },
    { name: 'Infusión de arroz', emoji: '🌾' },
  ];
  const cantidades = [
    { name: 'Poca', level: 1 },
    { name: 'Normal', level: 2 },
    { name: 'Mucha', level: 3 },
  ];

  const plantaActual = plantas.find(p => p.nombre === planta);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.riegos.add({ planta_nombre: planta, fecha, tipo, cantidad });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-blue-100 p-5 space-y-5 shadow-cute-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-cute">
          <WaterDrop size={18} />
        </div>
        <h3 className="font-black text-gray-800">Registrar Riego</h3>
      </div>
      
      {plantaActual && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-3 flex items-center gap-3 border border-blue-100">
          <Icon emoji={plantaActual.emoji} size={32} />
          <div>
            <p className="font-bold text-sm text-blue-900">{plantaActual.nombre}</p>
            <p className="text-[10px] text-blue-600">{plantaActual.fase_actual}</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🌱" size={14} /> Planta
        </label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-3 rounded-xl border-2 border-blue-100 text-sm bg-blue-50/50 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none font-medium">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1">
          <TestTube size={14} /> Tipo de riego
        </label>
        <div className="grid grid-cols-2 gap-2">
          {tipos.map(t => (
            <button
              key={t.name}
              type="button"
              onClick={() => setTipo(t.name)}
              className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all btn-cute flex items-center gap-1.5 ${
                tipo === t.name 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-white shadow-lg scale-[1.02]' 
                  : 'bg-white text-gray-700 border-gray-100 hover:border-blue-200'
              }`}
            >
              <Icon emoji={t.emoji} size={16} />
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1">
          <Icon emoji="📊" size={14} /> Cantidad
        </label>
        <div className="flex gap-2">
          {cantidades.map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => setCantidad(c.name)}
              className={`flex-1 p-3 rounded-xl text-xs font-bold border-2 transition-all btn-cute ${
                cantidad === c.name 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-white shadow-lg scale-[1.02]' 
                  : 'bg-white text-gray-700 border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="text-center flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: c.level }).map((_, i) => (
                    <WaterDrop key={i} size={10} />
                  ))}
                </div>
                <span className="mt-0.5">{c.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="📅" size={14} /> Fecha
        </label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-3 rounded-xl border-2 border-blue-100 text-sm bg-blue-50/50 focus:ring-2 focus:ring-blue-300 outline-none font-medium" />
      </div>

      <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-2xl font-black text-sm transition-all btn-cute shadow-lg shadow-blue-200 border-2 border-white/50 flex items-center justify-center gap-2">
        <WaterDrop size={20} />
        ¡Registrar Riego!
        <Icon emoji="✨" size={18} />
      </button>
    </form>
  );
}

// ============ FORMULARIO DE CRECIMIENTO ============
function FormCrecimiento({ nombres, onSuccess, plantas }: { nombres: string[]; onSuccess: () => void; plantas: any[] }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [altura, setAltura] = useState('');
  const [numPlantas, setNumPlantas] = useState('1');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const plantaActual = plantas.find(p => p.nombre === planta);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!altura) return;
    await db.bitacora.add({ planta_nombre: planta, fecha, altura_cm: parseFloat(altura), num_plantas: parseInt(numPlantas) });
    onSuccess();
    setAltura('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-green-100 p-5 space-y-5 shadow-cute-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-cute">
          <Ruler size={18} />
        </div>
        <h3 className="font-black text-gray-800">Medición de Crecimiento</h3>
      </div>

      {plantaActual && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 flex items-center gap-3 border border-green-100">
          <Icon emoji={plantaActual.emoji} size={32} />
          <div>
            <p className="font-bold text-sm text-green-900">{plantaActual.nombre}</p>
            <p className="text-[10px] text-green-600">{plantaActual.fase_actual}</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🌱" size={14} /> Planta
        </label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-3 rounded-xl border-2 border-green-100 text-sm bg-green-50/50 focus:ring-2 focus:ring-green-300 outline-none font-medium">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
            <Ruler size={14} /> Altura (cm)
          </label>
          <input type="number" step="0.1" value={altura} onChange={e => setAltura(e.target.value)} placeholder="Ej: 12.5" className="w-full p-3 rounded-xl border-2 border-green-100 text-sm bg-green-50/50 focus:ring-2 focus:ring-green-300 outline-none font-medium" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
            <Icon emoji="🌿" size={14} /> Nº plantas
          </label>
          <input type="number" value={numPlantas} onChange={e => setNumPlantas(e.target.value)} className="w-full p-3 rounded-xl border-2 border-green-100 text-sm bg-green-50/50 focus:ring-2 focus:ring-green-300 outline-none font-medium" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="📅" size={14} /> Fecha
        </label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-3 rounded-xl border-2 border-green-100 text-sm bg-green-50/50 focus:ring-2 focus:ring-green-300 outline-none font-medium" />
      </div>

      <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl font-black text-sm transition-all btn-cute shadow-lg shadow-green-200 border-2 border-white/50 flex items-center justify-center gap-2">
        <Ruler size={20} />
        ¡Registrar Medición!
        <Icon emoji="🌱" size={18} />
      </button>
    </form>
  );
}

// ============ FORMULARIO DE SALUD ============
function FormSalud({ nombres, onSuccess, plantas }: { nombres: string[]; onSuccess: () => void; plantas: any[] }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [sintoma, setSintoma] = useState('');
  const [causa, setCausa] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [estado, setEstado] = useState<'En seguimiento' | 'Resuelto'>('En seguimiento');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaRevision, setFechaRevision] = useState('');

  const sintomasRapidos = [
    { name: 'Hojas amarillas', emoji: '🍂' },
    { name: 'Manchas en hojas', emoji: '🟤' },
    { name: 'Pulgones', emoji: '🐛' },
    { name: 'Hojas caídas', emoji: '😢' },
    { name: 'Tallo débil', emoji: '🥀' },
    { name: 'Moho blanco', emoji: '🍄' },
  ];

  const plantaActual = plantas.find(p => p.nombre === planta);

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
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-orange-100 p-5 space-y-5 shadow-cute-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-cute">
          <Bug size={18} />
        </div>
        <h3 className="font-black text-gray-800">Incidencia de Salud</h3>
      </div>

      {plantaActual && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-3 flex items-center gap-3 border border-orange-100">
          <Icon emoji={plantaActual.emoji} size={32} />
          <div>
            <p className="font-bold text-sm text-orange-900">{plantaActual.nombre}</p>
            <p className="text-[10px] text-orange-600">{plantaActual.fase_actual}</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🌱" size={14} /> Planta
        </label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 focus:ring-2 focus:ring-orange-300 outline-none font-medium">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1">
          <Icon emoji="🔍" size={14} /> Síntoma (toca uno o escribe)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {sintomasRapidos.map(s => (
            <button
              key={s.name}
              type="button"
              onClick={() => setSintoma(s.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all btn-cute flex items-center gap-1 ${
                sintoma === s.name 
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-white border-white shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-100 hover:border-orange-200'
              }`}
            >
              <Icon emoji={s.emoji} size={14} />
              {s.name}
            </button>
          ))}
        </div>
        <input type="text" value={sintoma} onChange={e => setSintoma(e.target.value)} placeholder="O escribe otro síntoma..." className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 focus:ring-2 focus:ring-orange-300 outline-none font-medium" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🤔" size={14} /> Causa probable
        </label>
        <input type="text" value={causa} onChange={e => setCausa(e.target.value)} placeholder="Ej: Exceso de humedad" className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 focus:ring-2 focus:ring-orange-300 outline-none font-medium" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Pill size={14} /> Tratamiento natural
        </label>
        <input type="text" value={tratamiento} onChange={e => setTratamiento(e.target.value)} placeholder="Ej: Infusión de cola de caballo" className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 focus:ring-2 focus:ring-orange-300 outline-none font-medium" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
            <ClipboardIcon size={14} /> Estado
          </label>
          <select value={estado} onChange={e => setEstado(e.target.value as any)} className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 outline-none font-medium">
            <option value="En seguimiento">En seguimiento</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
            <Icon emoji="📅" size={14} /> Revisión
          </label>
          <input type="date" value={fechaRevision} onChange={e => setFechaRevision(e.target.value)} className="w-full p-3 rounded-xl border-2 border-orange-100 text-sm bg-orange-50/50 outline-none font-medium" />
        </div>
      </div>

      <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white rounded-2xl font-black text-sm transition-all btn-cute shadow-lg shadow-orange-200 border-2 border-white/50 flex items-center justify-center gap-2">
        <Bug size={20} />
        ¡Registrar Incidencia!
        <Icon emoji="💪" size={18} />
      </button>
    </form>
  );
}

// ============ FORMULARIO DE COSECHA ============
function FormCosecha({ nombres, onSuccess, plantas }: { nombres: string[]; onSuccess: () => void; plantas: any[] }) {
  const [planta, setPlanta] = useState(nombres[0] || '');
  const [parte, setParte] = useState('Hojas');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const partes = [
    { name: 'Hojas', emoji: '🍃' },
    { name: 'Puntas', emoji: '🌿' },
    { name: 'Tallos', emoji: '🌾' },
    { name: 'Flores', emoji: '🌸' },
    { name: 'Frutos', emoji: '🫑' },
    { name: 'Raíces', emoji: '🥕' },
  ];

  const plantaActual = plantas.find(p => p.nombre === planta);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantidad) return;
    await db.cosechas.add({ planta_nombre: planta, fecha, parte_cosechada: parte, cantidad_estimada: parseInt(cantidad) });
    onSuccess();
    setCantidad('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-100 p-5 space-y-5 shadow-cute-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-cute">
          <Scissors size={18} />
        </div>
        <h3 className="font-black text-gray-800">Registrar Cosecha</h3>
      </div>

      {plantaActual && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 flex items-center gap-3 border border-purple-100">
          <Icon emoji={plantaActual.emoji} size={32} />
          <div>
            <p className="font-bold text-sm text-purple-900">{plantaActual.nombre}</p>
            <p className="text-[10px] text-purple-600">{plantaActual.fase_actual}</p>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🌱" size={14} /> Planta
        </label>
        <select value={planta} onChange={e => setPlanta(e.target.value)} className="w-full p-3 rounded-xl border-2 border-purple-100 text-sm bg-purple-50/50 focus:ring-2 focus:ring-purple-300 outline-none font-medium">
          {nombres.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-2 block flex items-center gap-1">
          <Icon emoji="🌿" size={14} /> Parte cosechada
        </label>
        <div className="grid grid-cols-3 gap-2">
          {partes.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => setParte(p.name)}
              className={`p-2.5 rounded-xl text-xs font-bold border-2 transition-all btn-cute flex flex-col items-center gap-0.5 ${
                parte === p.name 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white border-white shadow-lg scale-[1.02]' 
                  : 'bg-white text-gray-700 border-gray-100 hover:border-purple-200'
              }`}
            >
              <Icon emoji={p.emoji} size={20} />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="🔢" size={14} /> Cantidad (unidades)
        </label>
        <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} placeholder="Ej: 10" className="w-full p-3 rounded-xl border-2 border-purple-100 text-sm bg-purple-50/50 focus:ring-2 focus:ring-purple-300 outline-none font-medium" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-600 mb-1.5 block flex items-center gap-1">
          <Icon emoji="📅" size={14} /> Fecha
        </label>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full p-3 rounded-xl border-2 border-purple-100 text-sm bg-purple-50/50 focus:ring-2 focus:ring-purple-300 outline-none font-medium" />
      </div>

      <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-2xl font-black text-sm transition-all btn-cute shadow-lg shadow-purple-200 border-2 border-white/50 flex items-center justify-center gap-2">
        <Scissors size={20} />
        ¡Registrar Cosecha!
        <Icon emoji="🎉" size={18} />
      </button>
    </form>
  );
}


