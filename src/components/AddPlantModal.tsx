import { useState } from 'react';
import { db } from '../db/database';
import { plantIcons } from './PlantIcons';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';
import { X, Plus, Save } from 'lucide-react';

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPlantModal({ isOpen, onClose, onSuccess }: AddPlantModalProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    nombre: '',
    fase_actual: 'Plántula',
    horario_solar: '9:00–14:00 | Pleno sol',
    frecuencia_riego_dias: 3,
    ajuste_manejo: '',
    fertilizantes_recomendados: '',
    prohibiciones: '',
    emoji: '🌱',
    color: '#22c55e',
  });

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  if (!isOpen) return null;

  const plantList = Object.keys(plantIcons);
  const phases = ['Plántula', 'Crecimiento vegetativo', 'Crecimiento activo', 'Floración', 'Fructificación', 'Maduración'];
  const sunOptions = [
    '6:00–12:00 | Pleno sol',
    '9:00–14:00 | Pleno sol',
    '8:00–15:00 | Pleno sol',
    '9:00–13:00 | Sol parcial',
    '10:00–14:00 | Semisombra',
    '8:00–12:00 | Sombra',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('Por favor, ingresa un nombre para la planta');
      return;
    }

    try {
      await db.plantas.add({
        nombre: formData.nombre,
        fase_actual: formData.fase_actual,
        horario_solar: formData.horario_solar,
        frecuencia_riego_dias: formData.frecuencia_riego_dias,
        ajuste_manejo: formData.ajuste_manejo,
        fertilizantes_recomendados: formData.fertilizantes_recomendados,
        prohibiciones: formData.prohibiciones,
        emoji: formData.emoji,
        color: formData.color,
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        nombre: '',
        fase_actual: 'Plántula',
        horario_solar: '9:00–14:00 | Pleno sol',
        frecuencia_riego_dias: 3,
        ajuste_manejo: '',
        fertilizantes_recomendados: '',
        prohibiciones: '',
        emoji: '🌱',
        color: '#22c55e',
      });
      setSelectedIcon(null);
    } catch (error) {
      console.error('Error al añadir planta:', error);
      alert('Error al añadir la planta. Por favor, intenta de nuevo.');
    }
  };

  const selectPlantTemplate = (plantName: string) => {
    setFormData(prev => ({
      ...prev,
      nombre: plantName,
    }));
    setSelectedIcon(plantName);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Añadir Nueva Planta
              </h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Personaliza los detalles de tu planta
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plant Templates */}
          <div>
            <label className={`text-sm font-bold mb-3 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Plantillas de Plantas
            </label>
            <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Selecciona una plantilla o crea una planta personalizada
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2">
              {plantList.map((plantName) => {
                const IconComponent = plantIcons[plantName];
                return (
                  <button
                    key={plantName}
                    type="button"
                    onClick={() => selectPlantTemplate(plantName)}
                    className={`p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedIcon === plantName
                        ? isDark
                          ? 'border-green-500 bg-green-900/30'
                          : 'border-green-500 bg-green-50'
                        : isDark
                        ? 'border-gray-700 bg-gray-700/50 hover:border-gray-600'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent size={32} />
                      <span className={`text-[10px] font-medium text-center ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {plantName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Nombre de la Planta *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Mi Tomate Especial"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
              required
            />
          </div>

          {/* Fase Actual */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Fase de Crecimiento
            </label>
            <select
              value={formData.fase_actual}
              onChange={(e) => setFormData({ ...formData, fase_actual: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            >
              {phases.map(phase => (
                <option key={phase} value={phase}>{phase}</option>
              ))}
            </select>
          </div>

          {/* Horario Solar */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Horario Solar
            </label>
            <select
              value={formData.horario_solar}
              onChange={(e) => setFormData({ ...formData, horario_solar: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            >
              {sunOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Frecuencia de Riego */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Frecuencia de Riego (días)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={formData.frecuencia_riego_dias}
              onChange={(e) => setFormData({ ...formData, frecuencia_riego_dias: parseInt(e.target.value) || 3 })}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Cada cuántos días necesita riego
            </p>
          </div>

          {/* Ajuste de Manejo */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Ajuste de Manejo
            </label>
            <textarea
              value={formData.ajuste_manejo}
              onChange={(e) => setFormData({ ...formData, ajuste_manejo: e.target.value })}
              placeholder="Ej: Poda cada 2 semanas, entutorado necesario"
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
          </div>

          {/* Fertilizantes Recomendados */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Fertilizantes Recomendados
            </label>
            <textarea
              value={formData.fertilizantes_recomendados}
              onChange={(e) => setFormData({ ...formData, fertilizantes_recomendados: e.target.value })}
              placeholder="Ej: Compost, té de plátano, cáscaras de huevo"
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
          </div>

          {/* Prohibiciones */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Prohibiciones
            </label>
            <textarea
              value={formData.prohibiciones}
              onChange={(e) => setFormData({ ...formData, prohibiciones: e.target.value })}
              placeholder="Ej: No usar fertilizantes químicos, evitar exceso de agua"
              rows={2}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all resize-none ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-green-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-500'
              } focus:outline-none focus:ring-2 focus:ring-green-500/20`}
            />
          </div>

          {/* Color */}
          <div>
            <label className={`text-sm font-bold mb-2 block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Color de la Planta
            </label>
            <div className="flex gap-2 flex-wrap">
              {['#22c55e', '#16a34a', '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#6366f1', '#06b6d4'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${
                    formData.color === color
                      ? 'border-gray-900 dark:border-white scale-110'
                      : isDark
                      ? 'border-gray-600'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Guardar Planta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
