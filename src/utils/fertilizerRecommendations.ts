// Sistema de recomendación automática de fertilizantes

export interface RecomendacionFertilizante {
  fertilizante: string;
  razon: string;
  beneficio: string;
  frecuenciaRecomendada: number; // días
  prioridad: 'alta' | 'media' | 'baja';
}

// Base de conocimiento de recomendaciones por tipo de planta
export const recomendacionesPorTipo: Record<string, RecomendacionFertilizante[]> = {
  'aromatica': [
    {
      fertilizante: 'Té de plátano',
      razon: 'Rico en potasio, esencial para el desarrollo de aceites esenciales',
      beneficio: 'Mejora el aroma y la producción de hojas',
      frecuenciaRecomendada: 15,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Ceniza de madera',
      razon: 'Aporta potasio y minerales traza',
      beneficio: 'Fortalece los tallos y mejora la resistencia',
      frecuenciaRecomendada: 30,
      prioridad: 'media'
    },
    {
      fertilizante: 'Compost',
      razon: 'Proporciona nutrientes balanceados de liberación lenta',
      beneficio: 'Mejora la estructura del suelo y la disponibilidad de nutrientes',
      frecuenciaRecomendada: 20,
      prioridad: 'media'
    }
  ],
  'hortaliza': [
    {
      fertilizante: 'Humus de lombriz',
      razon: 'Alto contenido de nitrógeno y microorganismos beneficiosos',
      beneficio: 'Acelera el crecimiento y mejora la absorción de nutrientes',
      frecuenciaRecomendada: 10,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Infusión de ortiga',
      razon: 'Rica en nitrógeno, hierro y otros minerales',
      beneficio: 'Estimula el crecimiento vegetativo vigoroso',
      frecuenciaRecomendada: 14,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Posos de café',
      razon: 'Fuente de nitrógeno y mejora la acidez del suelo',
      beneficio: 'Ideal para hortalizas de hoja verde',
      frecuenciaRecomendada: 15,
      prioridad: 'media'
    },
    {
      fertilizante: 'Cáscaras de huevo',
      razon: 'Aporte de calcio para prevenir enfermedades',
      beneficio: 'Fortalece las paredes celulares y previene el blossom end rot',
      frecuenciaRecomendada: 20,
      prioridad: 'media'
    }
  ],
  'fruta': [
    {
      fertilizante: 'Té de plátano',
      razon: 'Alto contenido de potasio para la fructificación',
      beneficio: 'Mejora la calidad y cantidad de frutos',
      frecuenciaRecomendada: 12,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Cáscaras de huevo',
      razon: 'Calcio esencial para la formación de frutos',
      beneficio: 'Previene enfermedades y mejora la firmeza del fruto',
      frecuenciaRecomendada: 15,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Compost',
      razon: 'Nutrientes balanceados para todo el ciclo de vida',
      beneficio: 'Sostiene la producción continua de frutos',
      frecuenciaRecomendada: 20,
      prioridad: 'media'
    },
    {
      fertilizante: 'Humus de lombriz',
      razon: 'Microorganismos que mejoran la absorción de nutrientes',
      beneficio: 'Aumenta la resistencia a enfermedades y estrés',
      frecuenciaRecomendada: 15,
      prioridad: 'media'
    }
  ],
  'flor': [
    {
      fertilizante: 'Té de plátano',
      razon: 'Potasio para estimular la floración',
      beneficio: 'Aumenta el número y tamaño de las flores',
      frecuenciaRecomendada: 14,
      prioridad: 'alta'
    },
    {
      fertilizante: 'Ceniza de madera',
      razon: 'Potasio y minerales para colores vibrantes',
      beneficio: 'Intensifica los colores de las flores',
      frecuenciaRecomendada: 25,
      prioridad: 'media'
    },
    {
      fertilizante: 'Infusión de manzanilla',
      razon: 'Propiedades fungicidas naturales',
      beneficio: 'Previene enfermedades fúngicas en las flores',
      frecuenciaRecomendada: 20,
      prioridad: 'media'
    }
  ],
  'otro': [
    {
      fertilizante: 'Compost',
      razon: 'Nutrientes balanceados para cualquier tipo de planta',
      beneficio: 'Mejora la salud general de la planta',
      frecuenciaRecomendada: 20,
      prioridad: 'media'
    },
    {
      fertilizante: 'Humus de lombriz',
      razon: 'Mejora la estructura del suelo y la biología',
      beneficio: 'Aumenta la capacidad de retención de agua y nutrientes',
      frecuenciaRecomendada: 15,
      prioridad: 'media'
    }
  ]
};

// Función para obtener recomendaciones basadas en el nombre de la planta
export function getRecomendaciones(nombrePlanta: string): RecomendacionFertilizante[] {
  const nombreLower = nombrePlanta.toLowerCase();
  
  // Detectar tipo de planta por nombre
  let tipoPlanta = 'otro';
  
  const aromaticas = ['albahaca', 'menta', 'hierbabuena', 'romero', 'tomillo', 'orégano', 'oregano', 'salvia', 'cilantro', 'perejil', 'lavanda'];
  const hortalizas = ['tomate', 'lechuga', 'espinaca', 'zanahoria', 'rábano', 'rabano', 'pimiento', 'pepino', 'calabacín', 'calabacin', 'cebolla', 'ajo'];
  const frutas = ['fresa', 'frutilla', 'arándano', 'arandano', 'manzana', 'naranja', 'limón', 'limon', 'uva'];
  const flores = ['girasol', 'caléndula', 'calendula', 'rosa', 'margarita', 'violeta', 'lavanda'];
  
  if (aromaticas.some(a => nombreLower.includes(a))) {
    tipoPlanta = 'aromatica';
  } else if (hortalizas.some(h => nombreLower.includes(h))) {
    tipoPlanta = 'hortaliza';
  } else if (frutas.some(f => nombreLower.includes(f))) {
    tipoPlanta = 'fruta';
  } else if (flores.some(f => nombreLower.includes(f))) {
    tipoPlanta = 'flor';
  }
  
  return recomendacionesPorTipo[tipoPlanta] || recomendacionesPorTipo['otro'];
}

// Función para calcular la próxima fecha de aplicación
export function calcularProximaAplicacion(ultimaAplicacion: string, frecuenciaDias: number): string {
  const fecha = new Date(ultimaAplicacion);
  fecha.setDate(fecha.getDate() + frecuenciaDias);
  return fecha.toISOString().split('T')[0];
}

// Función para verificar si es momento de fertilizar
export function esMomentoDeFertilizar(proximaAplicacion: string): boolean {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaAplicacion = new Date(proximaAplicacion);
  fechaAplicacion.setHours(0, 0, 0, 0);
  return hoy >= fechaAplicacion;
}

// Función para obtener días restantes
export function getDiasRestantes(proximaAplicacion: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaAplicacion = new Date(proximaAplicacion);
  fechaAplicacion.setHours(0, 0, 0, 0);
  const diffTime = fechaAplicacion.getTime() - hoy.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
