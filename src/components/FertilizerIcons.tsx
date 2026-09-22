import React from 'react';

type IconProps = { size?: number; className?: string };

// ============ FERTILIZANTES NATURALES ============

export const BananaTea = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M20 20C20 20 18 16 20 14C22 12 26 12 28 14C30 16 28 20 28 20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M32 20C32 20 30 16 32 14C34 12 38 12 40 14C42 16 40 20 40 20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="14" ry="16" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="12" ry="14" fill="#fde68a" opacity="0.5"/>
    <path d="M26 36L30 40L34 36" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Eggshells = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="36" rx="16" ry="20" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <path d="M24 28L28 32L24 36" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M36 28L40 32L36 36" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M28 40L32 44L36 40" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="28" cy="32" r="2" fill="#fbbf24" opacity="0.6"/>
    <circle cx="36" cy="32" r="2" fill="#fbbf24" opacity="0.6"/>
    <circle cx="32" cy="40" r="2" fill="#fbbf24" opacity="0.6"/>
  </svg>
);

export const CoffeeGrounds = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M20 24H44V48C44 52 40 56 36 56H28C24 56 20 52 20 48V24Z" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
    <ellipse cx="32" cy="24" rx="12" ry="4" fill="#78350f" stroke="#78350f" strokeWidth="2"/>
    <circle cx="26" cy="32" r="2" fill="#451a03" opacity="0.5"/>
    <circle cx="32" cy="36" r="2" fill="#451a03" opacity="0.5"/>
    <circle cx="38" cy="32" r="2" fill="#451a03" opacity="0.5"/>
    <circle cx="30" cy="44" r="2" fill="#451a03" opacity="0.5"/>
    <circle cx="36" cy="44" r="2" fill="#451a03" opacity="0.5"/>
  </svg>
);

export const WoodAsh = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="44" rx="18" ry="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="16" ry="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2"/>
    <ellipse cx="32" cy="36" rx="14" ry="5" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2"/>
    <circle cx="28" cy="38" r="1.5" fill="#9ca3af" opacity="0.5"/>
    <circle cx="36" cy="38" r="1.5" fill="#9ca3af" opacity="0.5"/>
    <circle cx="32" cy="42" r="1.5" fill="#9ca3af" opacity="0.5"/>
  </svg>
);

export const Compost = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="44" rx="20" ry="10" fill="#78350f" stroke="#451a03" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="18" ry="8" fill="#92400e" stroke="#451a03" strokeWidth="2"/>
    <ellipse cx="32" cy="36" rx="16" ry="7" fill="#a16207" stroke="#451a03" strokeWidth="2"/>
    <path d="M28 32L32 28L36 32" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="26" cy="38" r="2" fill="#451a03" opacity="0.4"/>
    <circle cx="38" cy="38" r="2" fill="#451a03" opacity="0.4"/>
    <circle cx="32" cy="42" r="2" fill="#451a03" opacity="0.4"/>
  </svg>
);

export const WormHumus = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="44" rx="18" ry="10" fill="#451a03" stroke="#1c1917" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="16" ry="8" fill="#78350f" stroke="#1c1917" strokeWidth="2"/>
    <path d="M24 36C24 36 28 32 32 32C36 32 40 36 40 36" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="28" cy="38" r="1.5" fill="#1c1917" opacity="0.5"/>
    <circle cx="36" cy="38" r="1.5" fill="#1c1917" opacity="0.5"/>
    <path d="M20 30C20 30 24 26 28 28C32 30 30 34 26 34" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const NettleInfusion = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V32" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 32L32 28L36 32" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M26 38L30 34L34 38" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M28 44L32 40L36 44" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="32" cy="24" rx="8" ry="10" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M28 20L32 24L36 20" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <circle cx="32" cy="24" r="3" fill="#4ade80" opacity="0.5"/>
  </svg>
);

export const RiceWater = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="40" rx="16" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="32" cy="38" rx="14" ry="10" fill="#fde68a" opacity="0.5"/>
    <ellipse cx="28" cy="36" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
    <ellipse cx="36" cy="36" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
    <ellipse cx="32" cy="42" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
  </svg>
);

export const ChamomileTea = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx={32 + Math.cos((angle * Math.PI) / 180) * 14}
        cy={32 + Math.sin((angle * Math.PI) / 180) * 14}
        rx="4"
        ry="6"
        fill="white"
        stroke="#d97706"
        strokeWidth="1"
        transform={`rotate(${angle} ${32 + Math.cos((angle * Math.PI) / 180) * 14} ${32 + Math.sin((angle * Math.PI) / 180) * 14})`}
      />
    ))}
  </svg>
);

export const OnionSkins = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="40" rx="14" ry="16" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="12" ry="14" fill="#fb923c" opacity="0.5"/>
    <path d="M28 36C28 36 30 34 32 34C34 34 36 36 36 36" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M28 44C28 44 30 42 32 42C34 42 36 44 36 44" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const VegetableScraps = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="44" rx="18" ry="10" fill="#22c55e" stroke="#16a34a" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="16" ry="8" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <circle cx="26" cy="38" r="3" fill="#ef4444" stroke="#dc2626" strokeWidth="1"/>
    <circle cx="38" cy="38" r="3" fill="#f97316" stroke="#ea580c" strokeWidth="1"/>
    <circle cx="32" cy="42" r="3" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1"/>
  </svg>
);

export const Manure = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="44" rx="18" ry="10" fill="#78350f" stroke="#451a03" strokeWidth="2"/>
    <ellipse cx="32" cy="40" rx="16" ry="8" fill="#92400e" stroke="#451a03" strokeWidth="2"/>
    <ellipse cx="32" cy="36" rx="14" ry="7" fill="#a16207" stroke="#451a03" strokeWidth="2"/>
    <circle cx="28" cy="38" r="2" fill="#451a03" opacity="0.4"/>
    <circle cx="36" cy="38" r="2" fill="#451a03" opacity="0.4"/>
    <circle cx="32" cy="42" r="2" fill="#451a03" opacity="0.4"/>
  </svg>
);

export const DilutedVinegar = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M24 20H40V48C40 52 36 56 32 56C28 56 24 52 24 48V20Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="32" cy="20" rx="8" ry="3" fill="#d97706" stroke="#d97706" strokeWidth="2"/>
    <path d="M28 32L32 36L36 32" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <path d="M28 40L32 44L36 40" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const DilutedMilk = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M24 20H40V48C40 52 36 56 32 56C28 56 24 52 24 48V20Z" fill="white" stroke="#d1d5db" strokeWidth="2"/>
    <ellipse cx="32" cy="20" rx="8" ry="3" fill="#d1d5db" stroke="#d1d5db" strokeWidth="2"/>
    <ellipse cx="32" cy="36" rx="6" ry="8" fill="#f3f4f6" opacity="0.5"/>
  </svg>
);

// ============ MAPA DE FERTILIZANTES ============

export const fertilizerIcons: Record<string, React.FC<IconProps>> = {
  'Té de plátano': BananaTea,
  'Cáscaras de huevo': Eggshells,
  'Posos de café': CoffeeGrounds,
  'Ceniza de madera': WoodAsh,
  'Compost': Compost,
  'Humus de lombriz': WormHumus,
  'Infusión de ortiga': NettleInfusion,
  'Agua de arroz': RiceWater,
  'Infusión de manzanilla': ChamomileTea,
  'Cáscaras de cebolla': OnionSkins,
  'Restos de verduras': VegetableScraps,
  'Estiércol compostado': Manure,
  'Vinagre diluido': DilutedVinegar,
  'Leche diluida': DilutedMilk,
};
