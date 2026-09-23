import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { AddFertilizerModal } from './AddFertilizerModal';

export function FertilizerInventory() {
  const { isDark } = useTheme();
  const fertilizantes = useLiveQuery(() => db.fertilizantes.toArray()) || [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFertilizer, setEditingFertilizer] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este fertilizante?')) {
      await db.fertilizantes.delete(id);
    }
  };

  const handleEdit = (id: number) => {
    setEditingFertilizer(id);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <Icon emoji="🧪" size={40} className="mx-auto animate-float" />
        <h2 className={`text-lg font-black mt-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Inventario de Fertilizantes
        </h2>
        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Gestiona tus fertilizantes naturales
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-3 text-center shadow-cute ${
          isDark ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-800' : 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-white'
        }`}>
          <Package size={24} className={`mx-auto ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
            {fertilizantes.length}
          </p>
          <p className={`text-[10px] font-bold ${isDark ? 'text-green-500' : 'text-green-600'}`}>
            Fertilizantes
          </p>
        </div>
        <div className={`rounded-2xl p-3 text-center shadow-cute ${
          isDark ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-800' : 'bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white'
        }`}>
          <Icon emoji="💧" size={24} className="mx-auto" />
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            {fertilizantes.reduce((acc, f) => acc + f.cantidad, 0).toFixed(1)}
          </p>
          <p className={`text-[10px] font-bold ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
            Total disponible
          </p>
        </div>
      </div>

      {/* List */}
      {fertilizantes.length === 0 ? (
        <div className={`rounded-2xl p-8 text-center ${
          isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200'
        }`}>
          <Icon emoji="🧪" size={60} className="mx-auto opacity-50" />
          <p className={`text-sm mt-4 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No tienes fertilizantes en tu inventario
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Añade tu primer fertilizante natural
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fertilizantes.map((fertilizante) => (
            <div
              key={fertilizante.id}
              className={`rounded-2xl p-4 shadow-cute border-2 transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Icon emoji={fertilizante.nombre} size={48} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {fertilizante.nombre}
                  </h3>
                  {fertilizante.descripcion && (
                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {fertilizante.descripcion}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      {fertilizante.cantidad} {fertilizante.unidad}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Creado: {new Date(fertilizante.fecha_creacion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  {fertilizante.notas && (
                    <p className={`text-[10px] mt-2 italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      📝 {fertilizante.notas}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(fertilizante.id!)}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                      isDark ? 'bg-blue-900/50 text-blue-400 hover:bg-blue-900' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                    aria-label="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(fertilizante.id!)}
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${
                      isDark ? 'bg-red-900/50 text-red-400 hover:bg-red-900' : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 sm:right-8 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Añadir fertilizante"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Add Modal */}
      <AddFertilizerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingFertilizer(null);
        }}
        onSuccess={() => {
          // Refresh data
        }}
      />
    </div>
  );
}
