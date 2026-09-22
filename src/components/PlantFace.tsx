// Componente que muestra la "cara" de la planta según su estado de riego
export function PlantFace({ status, emoji }: { status: 'happy' | 'thirsty' | 'critical'; emoji: string }) {
  const faces = {
    happy: { face: '😊', bg: 'bg-green-100', ring: 'ring-green-300' },
    thirsty: { face: '😅', bg: 'bg-yellow-100', ring: 'ring-yellow-300' },
    critical: { face: '🥺', bg: 'bg-red-100', ring: 'ring-red-300' },
  };

  const config = faces[status];

  return (
    <div className={`relative w-12 h-12 ${config.bg} rounded-full flex items-center justify-center ring-2 ${config.ring} ring-offset-2`}>
      <span className="text-2xl">{emoji}</span>
      <span className="absolute -bottom-1 -right-1 text-sm">{config.face}</span>
    </div>
  );
}

// Mini face indicator
export function MiniFace({ status }: { status: 'happy' | 'thirsty' | 'critical' }) {
  const faces = {
    happy: '😊',
    thirsty: '😅',
    critical: '🥺',
  };
  return <span className="text-sm">{faces[status]}</span>;
}

// Mood indicator con mensaje
export function MoodMessage({ status, nombre }: { status: 'happy' | 'thirsty' | 'critical'; nombre: string }) {
  const messages = {
    happy: `${nombre} está feliz y contenta 🌟`,
    thirsty: `${nombre} tiene sed... ¡regar pronto! 💦`,
    critical: `${nombre} necesita agua YA! 🆘`,
  };
  return <p className="text-xs text-gray-500 italic">{messages[status]}</p>;
}
