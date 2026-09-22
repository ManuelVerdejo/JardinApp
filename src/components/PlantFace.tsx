import { Icon } from './Icon';

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
      <Icon emoji={emoji} size={28} />
      <div className="absolute -bottom-1 -right-1">
        <Icon emoji={config.face} size={16} />
      </div>
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
  return <Icon emoji={faces[status]} size={14} />;
}

// Mood indicator con mensaje
export function MoodMessage({ status, nombre }: { status: 'happy' | 'thirsty' | 'critical'; nombre: string }) {
  const messages = {
    happy: `${nombre} está feliz y contenta`,
    thirsty: `${nombre} tiene sed... ¡regar pronto!`,
    critical: `${nombre} necesita agua YA!`,
  };
  const icons = {
    happy: '✨',
    thirsty: '💦',
    critical: '🆘',
  };
  return (
    <p className="text-xs text-gray-500 italic flex items-center gap-1">
      <Icon emoji={icons[status]} size={12} />
      {messages[status]}
    </p>
  );
}
