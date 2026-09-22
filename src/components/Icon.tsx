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
    return (
      <span 
        className={`inline-flex items-center justify-center ${className}`}
        style={{ 
          width: size, 
          height: size, 
          display: 'inline-flex',
          flexShrink: 0,
        }}
      >
        <IconComponent size={size} />
      </span>
    );
  }
  
  // Fallback: renderizar el emoji si no hay SVG disponible
  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.7,
        display: 'inline-flex',
        flexShrink: 0,
      }}
    >
      {emoji}
    </span>
  );
}

// Componente inline para usar dentro de texto
export function IconInline({ emoji, size = 16, className = '' }: Props) {
  return <Icon emoji={emoji} size={size} className={className} />;
}
