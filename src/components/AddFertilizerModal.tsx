import React, { useState } from 'react';
import { db } from '../db/database';
import { Fertilizante } from '../db/database';
import { fertilizerIcons } from './FertilizerIcons';
import { X } from 'lucide-react';

interface AddFertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFertilizerModal({ isOpen, onClose, onSuccess }: AddFertilizerModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidad: 1,
    unidad: 'litros',
    notas: '',
  });

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const fertilizerList = Object.keys(fertilizerIcons);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('Por favor, ingresa un nombre para el fertilizante');
      return;
    }

    try {
      const newFertilizer: Fertilizante = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        cantidad: formData.cantidad,
        unidad: formData.unidad,
        fecha_creacion: new Date().toISOString().split('T')[0],
        notas: formData.notas,
      };

      await db.fertilizantes.add(newFertilizer);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        nombre: '',
        descripcion: '',
        cantidad: 1,
        unidad: 'litros',
        notas: '',
      });
      setSelectedIcon(null);
    } catch (error) {
      console.error('Error al añadir fertilizante:', error);
      alert('Error al añadir el fertilizante. Por favor, intenta de nuevo.');
    }
  };

  const selectFertilizerTemplate = (fertilizerName: string) => {
    setFormData(prev => ({
      ...prev,
      nombre: fertilizerName,
    }));
    setSelectedIcon(fertilizerName);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Añadir Fertilizante Natural
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Plantillas de Fertilizantes */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">
              Plantillas de Fertilizantes
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Selecciona una plantilla o crea un fertilizante personalizado
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2">
              {fertilizerList.map((fertilizerName) => {
                const IconComponent = fertilizerIcons[fertilizerName];
                return (
                  <button
                    key={fertilizerName}
                    type="button"
                    onClick={() => selectFertilizerTemplate(fertilizerName)}
                    className={`p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedIcon === fertilizerName
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent size={32} />
                      <span className="text-[10px] font-medium text-center text-gray-700 dark:text-gray-300">
                        {fertilizerName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
              Nombre del Fertilizante *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Té de plátano casero"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Ej: Rico en potasio, ideal para plantas con flores"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
            />
          </div>

          {/* Cantidad y Unidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                Cantidad
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                Unidad
              </label>
              <select
                value={formData.unidad}
                onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                className="select-cute w-full px-4 py-3 rounded-xl border-2 border-emerald-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="litros">Litros</option>
                <option value="ml">Mililitros</option>
                <option value="kg">Kilogramos</option>
                <option value="g">Gramos</option>
                <option value="tazas">Tazas</option>
                <option value="cucharadas">Cucharadas</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              placeholder="Ej: Preparar cada 2 semanas, almacenar en lugar fresco"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar Fertilizante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
