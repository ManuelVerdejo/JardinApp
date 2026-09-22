import Dexie, { type Table } from 'dexie';

// ============ MODELO DE DATOS ============

export interface Planta {
  planta_id?: number;
  nombre: string;
  fase_actual: string;
  horario_solar: string;
  frecuencia_riego_dias: number;
  ajuste_manejo: string;
  fertilizantes_recomendados: string;
  prohibiciones: string;
  emoji: string;
  color: string;
}

export interface Riego {
  id?: number;
  planta_nombre: string;
  fecha: string; // YYYY-MM-DD
  tipo: string; // Agua, Agua con café, Infusión, etc.
  cantidad: string; // Poca, Normal, Mucha
}

export interface BitacoraCrecimiento {
  id?: number;
  fecha: string;
  planta_nombre: string;
  altura_cm: number;
  num_plantas: number;
}

export interface SaludVegetal {
  id?: number;
  fecha_deteccion: string;
  planta_nombre: string;
  sintoma_riesgo: string;
  causa_probable: string;
  tratamiento_natural: string;
  estado: 'En seguimiento' | 'Resuelto';
  fecha_revision: string;
}

export interface Cosecha {
  id?: number;
  fecha: string;
  planta_nombre: string;
  parte_cosechada: string; // Puntas, Hojas, etc.
  cantidad_estimada: number;
}

// ============ BASE DE DATOS DEXIE ============

export class HuertoDB extends Dexie {
  plantas!: Table<Planta, number>;
  riegos!: Table<Riego, number>;
  bitacora!: Table<BitacoraCrecimiento, number>;
  salud!: Table<SaludVegetal, number>;
  cosechas!: Table<Cosecha, number>;

  constructor() {
    super('HuertoUrbanoDB');
    this.version(1).stores({
      plantas: '++planta_id, nombre',
      riegos: '++id, planta_nombre, fecha',
      bitacora: '++id, planta_nombre, fecha',
      salud: '++id, planta_nombre, fecha_deteccion, estado',
      cosechas: '++id, planta_nombre, fecha',
    });
  }
}

export const db = new HuertoDB();
