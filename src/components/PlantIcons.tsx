import React from 'react';

type IconProps = { size?: number; className?: string };

// ============ PLANTAS AROMÁTICAS ============

export const Basil = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V32" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 32C28 28 24 24 24 18C24 12 28 8 32 8C36 8 40 12 40 18C40 24 36 28 32 32Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 40C28 38 22 36 20 32C18 28 22 26 26 28C30 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 40C36 38 42 36 44 32C46 28 42 26 38 28C34 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <circle cx="32" cy="18" r="3" fill="#22c55e" opacity="0.5"/>
  </svg>
);

export const Mint = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 28C28 24 22 22 20 16C18 10 24 6 28 8C32 10 32 14 32 14" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 28C36 24 42 22 44 16C46 10 40 6 36 8C32 10 32 14 32 14" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 38C28 36 22 36 20 32C18 28 22 26 26 28C30 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 38C36 36 42 36 44 32C46 28 42 26 38 28C34 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M28 20L32 24L36 20" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Rosemary = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="28" cy="24" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(-20 28 24)"/>
    <ellipse cx="36" cy="24" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(20 36 24)"/>
    <ellipse cx="26" cy="32" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(-25 26 32)"/>
    <ellipse cx="38" cy="32" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(25 38 32)"/>
    <ellipse cx="28" cy="40" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(-20 28 40)"/>
    <ellipse cx="36" cy="40" rx="3" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" transform="rotate(20 36 40)"/>
  </svg>
);

export const Thyme = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V24" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="28" cy="24" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="36" cy="24" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="26" cy="32" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="38" cy="32" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="28" cy="40" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="36" cy="40" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="30" cy="48" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <circle cx="34" cy="48" r="3" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
  </svg>
);

export const Oregano = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="28" cy="28" rx="6" ry="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="36" cy="28" rx="6" ry="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="26" cy="38" rx="5" ry="7" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="38" cy="38" rx="5" ry="7" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <circle cx="28" cy="28" r="2" fill="#22c55e" opacity="0.5"/>
    <circle cx="36" cy="28" r="2" fill="#22c55e" opacity="0.5"/>
  </svg>
);

export const Sage = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V32" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="32" cy="28" rx="10" ry="14" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
    <ellipse cx="32" cy="28" rx="8" ry="12" fill="#cbd5e1" opacity="0.5"/>
    <path d="M28 24L32 28L36 24" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 32L32 28L36 32" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Cilantro = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 28L28 20L24 24L20 18" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 28L36 20L40 24L44 18" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3" fill="#4ade80"/>
    <circle cx="20" cy="18" r="3" fill="#4ade80"/>
    <circle cx="40" cy="24" r="3" fill="#4ade80"/>
    <circle cx="44" cy="18" r="3" fill="#4ade80"/>
    <path d="M32 38L28 32L24 36" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M32 38L36 32L40 36" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="24" cy="36" r="3" fill="#4ade80"/>
    <circle cx="40" cy="36" r="3" fill="#4ade80"/>
  </svg>
);

export const Parsley = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 28C28 24 24 20 24 16C24 12 28 10 32 10C36 10 40 12 40 16C40 20 36 24 32 28Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M28 18L32 22L36 18" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 24L32 20L36 24" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M32 38C28 36 24 34 24 30C24 26 28 24 32 24" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 38C36 36 40 34 40 30C40 26 36 24 32 24" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
  </svg>
);

// ============ HORTALIZAS ============

export const Tomato = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="36" r="18" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
    <circle cx="32" cy="36" r="16" fill="#f87171" opacity="0.3"/>
    <path d="M32 18C32 18 28 14 24 14C20 14 18 18 18 22C18 26 22 28 26 28" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 18C32 18 36 14 40 14C44 14 46 18 46 22C46 26 42 28 38 28" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 18V14" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="26" cy="32" rx="3" ry="5" fill="#fca5a5" opacity="0.4"/>
  </svg>
);

export const Lettuce = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="40" rx="20" ry="16" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="36" rx="18" ry="14" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="32" rx="16" ry="12" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <path d="M24 32C24 32 28 28 32 28C36 28 40 32 40 32" stroke="#16a34a" strokeWidth="1.5" opacity="0.5"/>
    <path d="M26 36C26 36 30 34 32 34C34 34 38 36 38 36" stroke="#16a34a" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const Spinach = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V32" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="28" cy="28" rx="8" ry="12" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="36" cy="28" rx="8" ry="12" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="24" rx="6" ry="10" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M28 24L32 28L36 24" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 32L32 28L36 32" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Carrot = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56L24 24C24 20 28 16 32 16C36 16 40 20 40 24L32 56Z" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
    <path d="M28 20C28 20 24 12 20 12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 18C32 18 32 10 32 8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 20C36 20 40 12 44 12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="28" y1="28" x2="36" y2="28" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
    <line x1="29" y1="36" x2="35" y2="36" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
    <line x1="30" y1="44" x2="34" y2="44" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
  </svg>
);

export const Radish = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="40" rx="12" ry="16" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="10" ry="14" fill="#f87171" opacity="0.3"/>
    <path d="M32 24V16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 20C28 20 24 16 22 16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 20C36 20 40 16 42 16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="22" cy="16" rx="4" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <ellipse cx="42" cy="16" rx="4" ry="6" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <path d="M32 16V8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="8" rx="3" ry="5" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
  </svg>
);

export const Pepper = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M28 10C28 10 26 8 28 6C30 4 34 4 36 6C38 8 36 10 36 10" stroke="#16a34a" strokeWidth="2"/>
    <path d="M24 14C20 14 16 20 16 30C16 42 22 52 32 52C42 52 48 42 48 30C48 20 44 14 40 14C38 14 36 16 32 16C28 16 26 14 24 14Z" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 16V52" stroke="#16a34a" strokeWidth="1.5" opacity="0.3"/>
    <ellipse cx="26" cy="32" rx="3" ry="8" fill="#4ade80" opacity="0.4"/>
  </svg>
);

export const Cucumber = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="32" rx="10" ry="24" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="32" rx="8" ry="22" fill="#4ade80" opacity="0.3"/>
    <circle cx="28" cy="24" r="1.5" fill="#16a34a" opacity="0.5"/>
    <circle cx="36" cy="24" r="1.5" fill="#16a34a" opacity="0.5"/>
    <circle cx="28" cy="32" r="1.5" fill="#16a34a" opacity="0.5"/>
    <circle cx="36" cy="32" r="1.5" fill="#16a34a" opacity="0.5"/>
    <circle cx="28" cy="40" r="1.5" fill="#16a34a" opacity="0.5"/>
    <circle cx="36" cy="40" r="1.5" fill="#16a34a" opacity="0.5"/>
  </svg>
);

export const Zucchini = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="32" rx="12" ry="22" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="32" rx="10" ry="20" fill="#86efac" opacity="0.3"/>
    <path d="M32 10V8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="8" rx="4" ry="3" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5"/>
    <line x1="26" y1="20" x2="38" y2="20" stroke="#16a34a" strokeWidth="1" opacity="0.3"/>
    <line x1="26" y1="32" x2="38" y2="32" stroke="#16a34a" strokeWidth="1" opacity="0.3"/>
    <line x1="26" y1="44" x2="38" y2="44" stroke="#16a34a" strokeWidth="1" opacity="0.3"/>
  </svg>
);

// ============ FRUTAS ============

export const Strawberry = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56C24 56 16 48 16 36C16 24 24 16 32 16C40 16 48 24 48 36C48 48 40 56 32 56Z" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
    <path d="M32 16C32 16 28 12 24 12C20 12 18 16 18 20C18 24 22 26 26 26" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 16C32 16 36 12 40 12C44 12 46 16 46 20C46 24 42 26 38 26" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <circle cx="26" cy="28" r="1.5" fill="#fbbf24"/>
    <circle cx="32" cy="32" r="1.5" fill="#fbbf24"/>
    <circle cx="38" cy="28" r="1.5" fill="#fbbf24"/>
    <circle cx="28" cy="38" r="1.5" fill="#fbbf24"/>
    <circle cx="36" cy="38" r="1.5" fill="#fbbf24"/>
    <circle cx="32" cy="44" r="1.5" fill="#fbbf24"/>
  </svg>
);

export const Blueberry = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="16" fill="#6366f1" stroke="#4f46e5" strokeWidth="2"/>
    <circle cx="32" cy="32" r="14" fill="#818cf8" opacity="0.3"/>
    <circle cx="28" cy="28" r="2" fill="#a5b4fc" opacity="0.5"/>
    <circle cx="36" cy="28" r="2" fill="#a5b4fc" opacity="0.5"/>
    <circle cx="32" cy="36" r="2" fill="#a5b4fc" opacity="0.5"/>
    <path d="M32 16V12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="12" rx="4" ry="3" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5"/>
  </svg>
);

// ============ FLORES ============

export const Sunflower = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="10" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
    <circle cx="32" cy="32" r="8" fill="#a16207" opacity="0.5"/>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx={32 + Math.cos((angle * Math.PI) / 180) * 16}
        cy={32 + Math.sin((angle * Math.PI) / 180) * 16}
        rx="6"
        ry="10"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="1.5"
        transform={`rotate(${angle} ${32 + Math.cos((angle * Math.PI) / 180) * 16} ${32 + Math.sin((angle * Math.PI) / 180) * 16})`}
      />
    ))}
  </svg>
);

export const Marigold = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="8" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <ellipse
        key={i}
        cx={32 + Math.cos((angle * Math.PI) / 180) * 14}
        cy={32 + Math.sin((angle * Math.PI) / 180) * 14}
        rx="4"
        ry="8"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="1"
        transform={`rotate(${angle} ${32 + Math.cos((angle * Math.PI) / 180) * 14} ${32 + Math.sin((angle * Math.PI) / 180) * 14})`}
      />
    ))}
  </svg>
);

// ============ MAPA DE PLANTAS ============

export const plantIcons: Record<string, React.FC<IconProps>> = {
  // Aromáticas
  'Albahaca': Basil,
  'Hierbabuena': Mint,
  'Menta': Mint,
  'Romero': Rosemary,
  'Tomillo': Thyme,
  'Orégano': Oregano,
  'Salvia': Sage,
  'Cilantro': Cilantro,
  'Perejil': Parsley,
  
  // Hortalizas
  'Tomate': Tomato,
  'Lechuga': Lettuce,
  'Espinaca': Spinach,
  'Zanahoria': Carrot,
  'Rábano': Radish,
  'Pimiento': Pepper,
  'Pepino': Cucumber,
  'Calabacín': Zucchini,
  
  // Frutas
  'Fresa': Strawberry,
  'Arándano': Blueberry,
  
  // Flores
  'Girasol': Sunflower,
  'Caléndula': Marigold,
};
