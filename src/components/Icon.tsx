import React from 'react';
import { iconMap } from './Icons';

interface Props {
  emoji: string;
  size?: number;
  className?: string;
}

// Componente que renderiza un SVG en lugar de un emoji
export function Icon({ emoji, size = 24, className = '' }: Props) {
  const IconComponent = iconMap[emoji];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  // Fallback: renderizar el emoji si no hay SVG disponible
  return <span className={className} style={{ fontSize: size * 0.75 }}>{emoji}</span>;
}

// Componente inline para usar dentro de texto
export function IconInline({ emoji, size = 16, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <Icon emoji={emoji} size={size} />
    </span>
  );
}
