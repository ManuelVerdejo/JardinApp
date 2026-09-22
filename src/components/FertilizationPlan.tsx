import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { PlanFertilizacion } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';
import { getRecomendaciones, calcularProximaAplicacion, esMomentoDeFertilizar, getDiasRestantes } from '../utils/fertilizerRecommendations';
import { Plus, Calendar, Check, X, AlertCircle } from 'lucide-react';

export function FertilizationPlan() {
  const { isDark } = useTheme();
  const plantas = useLiveQuery(() => db.plantas.toArray()) || [];
  const planes = useLiveQuery(() => db.planesFertilizacion.toArray()) || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlanta, setSelectedPlanta] = useState<string>('');
  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);

  useEffect(() => {
    if (selectedPlanta) {
      const recs = getRecomendaciones(selectedPlanta);
      setRecomendaciones(recs);
    }
  }, [selectedPlanta]);

  const handleAddPlan = async (fertilizante: string, frecuencia: number) => {
    const hoy = new Date().toISOString().split('T')[0];
    const proximaAplicacion = calcularProximaAplicacion(hoy, frecuencia);

    const nuevoPlan: PlanFertilizacion = {
      planta_nombre: selectedPlanta,
      fertilizante_nombre: fertilizante,
      frecuencia_dias: frecuencia,
      ultima_aplicacion: hoy,
      proxima_aplicacion: proximaAplicacion,
      activo: true,
      notas: ''
    };

    await db.planesFertilizacion.add(nuevoPlan);
    setShowAddModal(false);
    setSelectedPlanta('');
  };

  const handleAplicar = async (plan: PlanFertilizacion) => {
    const hoy = new Date().toISOString().split('T')[0];
    const proximaAplicacion = calcularProximaAplicacion(hoy, plan.frecuencia_dias);

    await db.planesFertilizacion.update(plan.id!, {
      ultima_aplicacion: hoy,
      proxima_aplicacion: proximaAplicacion
    });
  };

  const handleToggleActivo = async (plan: PlanFertilizacion) => {
    await db.planesFertilizacion.update(plan.id!, {
      activo: !plan.activo
    });
  };

  const handleEliminar = async (planId: number) => {
    if (confirm('¿Estás seguro de eliminar este plan de fertilización?')) {
      await db.planesFertilizacion.delete(planId);
    }
  };

  // Agrupar planes por planta
  const planesPorPlanta = planes.reduce((acc, plan) => {
    if (!acc[plan.planta_nombre]) {
      acc[plan.planta_nombre] = [];
    }
    acc[plan.planta_nombre].push(plan);
    return acc;
  }, {} as Record<string, PlanFertilizacion[]>);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="📅" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Plan de Fertilización
        </h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Recomendaciones automáticas y programación
        </p>
      </div>

      {/* Alertas de fertilización pendiente */}
      {planes.filter(p => p.activo && esMomentoDeFertilizar(p.proxima_aplicacion)).length > 0 && (
        <div className={`rounded-2xl p-4 border-2 ${
          isDark ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
            <h3 className={`text-sm font-bold ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>
              Fertilización Pendiente
            </h3>
          </div>
          <div className="space-y-2">
            {planes
              .filter(p => p.activo && esMomentoDeFertilizar(p.proxima_aplicacion))
              .map(plan => (
                <div key={plan.id} className={`flex items-center justify-between p-2 rounded-xl ${
                  isDark ? 'bg-gray-800/50' : 'bg-white/50'
                }`}>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {plan.planta_nombre}
                    </p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.fertilizante_nombre}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAplicar(plan)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isDark 
                        ? 'bg-green-600 text-white hover:bg-green-500' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    Aplicar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Planes activos */}
      {Object.keys(planesPorPlanta).length > 0 && (
        <div className="space-y-3">
          <h3 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            Planes Activos
          </h3>
          {Object.entries(planesPorPlanta).map(([plantaNombre, planesPlanta]) => (
            <div key={plantaNombre} className={`rounded-2xl p-4 border-2 ${
              isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon emoji={plantas.find(p => p.nombre === plantaNombre)?.emoji || '🌱'} size={32} />
                <h4 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {plantaNombre}
                </h4>
              </div>
              <div className="space-y-2">
                {planesPlanta.map(plan => {
                  const diasRestantes = getDiasRestantes(plan.proxima_aplicacion);
                  const esUrgente = diasRestantes <= 0;
                  const esPronto = diasRestantes > 0 && diasRestantes <= 3;

                  return (
                    <div key={plan.id} className={`p-3 rounded-xl border ${
                      esUrgente 
                        ? isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
                        : esPronto
                        ? isDark ? 'bg-yellow-900/30 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
                        : isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${!plan.activo ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon emoji={plan.fertilizante_nombre} size={20} />
                            <p className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                              {plan.fertilizante_nombre}
                            </p>
                          </div>
                          <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Cada {plan.frecuencia_dias} días
                          </p>
                          <p className={`text-[10px] mt-1 ${
                            esUrgente 
                              ? isDark ? 'text-red-400' : 'text-red-600'
                              : esPronto
                              ? isDark ? 'text-yellow-400' : 'text-yellow-600'
                              : isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {esUrgente ? '¡Aplicar hoy!' : `En ${diasRestantes} días`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {esUrgente && plan.activo && (
                            <button
                              onClick={() => handleAplicar(plan)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isDark ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                              title="Aplicar ahora"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleToggleActivo(plan)}
                            className={`p-1.5 rounded-lg transition-all ${
                              plan.activo
                                ? isDark ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'
                                : isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-400 text-white hover:bg-gray-500'
                            }`}
                            title={plan.activo ? 'Pausar' : 'Activar'}
                          >
                            {plan.activo ? <Check size={14} /> : <X size={14} />}
                          </button>
                          <button
                            onClick={() => handleEliminar(plan.id!)}
                            className={`p-1.5 rounded-lg transition-all ${
                              isDark ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                            title="Eliminar"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {planes.length === 0 && (
        <div className={`rounded-2xl p-8 text-center ${
          isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200'
        }`}>
          <Icon emoji="📅" size={60} className="mx-auto opacity-50" />
          <p className={`text-sm mt-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No tienes planes de fertilización
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Crea tu primer plan y recibe recomendaciones automáticas
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 sm:right-8 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Crear plan de fertilización"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Modal para añadir plan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Crear Plan de Fertilización
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPlanta('');
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selector de planta */}
              <div>
                <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Selecciona una planta
                </label>
                <select
                  value={selectedPlanta}
                  onChange={(e) => setSelectedPlanta(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500'
                      : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'
                  } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
                >
                  <option value="">-- Seleccionar --</option>
                  {plantas.map(planta => (
                    <option key={planta.planta_id} value={planta.nombre}>
                      {planta.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recomendaciones automáticas */}
              {selectedPlanta && recomendaciones.length > 0 && (
                <div>
                  <label className={`text-sm font-bold mb-3 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Recomendaciones Automáticas
                  </label>
                  <div className="space-y-3">
                    {recomendaciones.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-xl border-2 ${
                        rec.prioridad === 'alta'
                          ? isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-300'
                          : rec.prioridad === 'media'
                          ? isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-300'
                          : isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-300'
                      }`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon emoji={rec.fertilizante} size={24} />
                              <h4 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                {rec.fertilizante}
                              </h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                rec.prioridad === 'alta'
                                  ? isDark ? 'bg-green-700 text-green-200' : 'bg-green-500 text-white'
                                  : rec.prioridad === 'media'
                                  ? isDark ? 'bg-blue-700 text-blue-200' : 'bg-blue-500 text-white'
                                  : isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-400 text-white'
                              }`}>
                                {rec.prioridad.toUpperCase()}
                              </span>
                            </div>
                            <p className={`text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              <strong>Razón:</strong> {rec.razon}
                            </p>
                            <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <strong>Beneficio:</strong> {rec.beneficio}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <strong>Frecuencia recomendada:</strong> Cada {rec.frecuenciaRecomendada} días
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddPlan(rec.fertilizante, rec.frecuenciaRecomendada)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                              isDark
                                ? 'bg-green-600 text-white hover:bg-green-500'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlanta && recomendaciones.length === 0 && (
                <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm">No hay recomendaciones disponibles para esta planta</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
