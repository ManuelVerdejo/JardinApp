import React from 'react';

type IconProps = { size?: number; className?: string };

// ============ PLANTAS ============
export const Seedling = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 52V32" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32 32C32 32 22 28 22 20C22 14 27 10 32 10C37 10 42 14 42 20C42 28 32 32 32 32Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 40C28 40 20 38 20 32C20 28 24 26 28 28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="#86efac"/>
    <path d="M32 40C36 40 44 38 44 32C44 28 40 26 36 28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="#86efac"/>
    <ellipse cx="32" cy="54" rx="8" ry="3" fill="#92400e" opacity="0.3"/>
  </svg>
);

export const Herb = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 28C28 24 20 22 18 16C16 10 22 6 28 8C32 9 32 14 32 14" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 28C36 24 44 22 46 16C48 10 42 6 36 8C32 9 32 14 32 14" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 38C28 36 22 36 20 32C18 28 22 26 26 28C30 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 38C36 36 42 36 44 32C46 28 42 26 38 28C34 30 32 34 32 34" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
  </svg>
);

export const Chili = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M28 12C28 12 24 10 22 12C20 14 22 16 24 16" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M26 16C26 16 20 24 22 36C24 48 32 54 36 52C40 50 42 40 40 30C38 20 32 16 26 16Z" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
    <path d="M28 20C28 20 26 28 28 36" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
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

export const Onion = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8V18" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M30 10C30 10 28 6 32 4C36 6 34 10 34 10" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5"/>
    <ellipse cx="32" cy="38" rx="16" ry="20" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2"/>
    <path d="M22 30C22 30 26 28 32 28C38 28 42 30 42 30" stroke="#86efac" strokeWidth="1.5" opacity="0.5"/>
    <path d="M20 38C20 38 26 36 32 36C38 36 44 38 44 38" stroke="#86efac" strokeWidth="1.5" opacity="0.5"/>
    <path d="M22 46C22 46 26 44 32 44C38 44 42 46 42 46" stroke="#86efac" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const Leaf = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M12 52C12 52 12 20 32 12C52 4 52 32 52 32C52 32 52 52 32 52C20 52 12 52 12 52Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M12 52C20 44 32 36 52 32" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 44C28 40 32 38 36 36" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 48C24 46 28 44 32 42" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Wheat = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V20" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="18" rx="4" ry="6" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5"/>
    <ellipse cx="26" cy="24" rx="4" ry="5" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(-20 26 24)"/>
    <ellipse cx="38" cy="24" rx="4" ry="5" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(20 38 24)"/>
    <ellipse cx="24" cy="32" rx="4" ry="5" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(-25 24 32)"/>
    <ellipse cx="40" cy="32" rx="4" ry="5" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(25 40 32)"/>
    <ellipse cx="26" cy="40" rx="3" ry="4" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(-20 26 40)"/>
    <ellipse cx="38" cy="40" rx="3" ry="4" fill="#fbbf24" stroke="#a16207" strokeWidth="1.5" transform="rotate(20 38 40)"/>
  </svg>
);

export const Tree = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="28" y="40" width="8" height="16" rx="2" fill="#92400e" stroke="#78350f" strokeWidth="1.5"/>
    <circle cx="32" cy="28" r="18" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <circle cx="24" cy="24" r="8" fill="#86efac" opacity="0.6"/>
    <circle cx="38" cy="22" r="6" fill="#86efac" opacity="0.4"/>
    <circle cx="32" cy="34" r="5" fill="#86efac" opacity="0.5"/>
  </svg>
);

export const Lavender = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V24" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="32" cy="10" rx="3" ry="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="32" cy="17" rx="3.5" ry="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="32" cy="24" rx="4" ry="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="28" cy="14" rx="2.5" ry="3.5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="36" cy="14" rx="2.5" ry="3.5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="27" cy="21" rx="2.5" ry="3.5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1"/>
    <ellipse cx="37" cy="21" rx="2.5" ry="3.5" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1"/>
  </svg>
);

// ============ ACCIONES ============
export const WaterDrop = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8C32 8 16 28 16 40C16 48 23 56 32 56C41 56 48 48 48 40C48 28 32 8 32 8Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2.5"/>
    <path d="M24 40C24 36 28 32 32 32" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="26" cy="44" r="2" fill="#bfdbfe" opacity="0.8"/>
  </svg>
);

export const WaterDrops = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M22 16C22 16 14 28 14 34C14 38 18 42 22 42C26 42 30 38 30 34C30 28 22 16 22 16Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M42 22C42 22 36 32 36 36C36 40 39 44 42 44C45 44 48 40 48 36C48 32 42 22 42 22Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M30 38C30 38 26 44 26 48C26 50 28 52 30 52C32 52 34 50 34 48C34 44 30 38 30 38Z" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
  </svg>
);

export const Ruler = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="8" y="24" width="48" height="16" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <line x1="16" y1="24" x2="16" y2="32" stroke="#d97706" strokeWidth="1.5"/>
    <line x1="24" y1="24" x2="24" y2="36" stroke="#d97706" strokeWidth="2"/>
    <line x1="32" y1="24" x2="32" y2="32" stroke="#d97706" strokeWidth="1.5"/>
    <line x1="40" y1="24" x2="40" y2="36" stroke="#d97706" strokeWidth="2"/>
    <line x1="48" y1="24" x2="48" y2="32" stroke="#d97706" strokeWidth="1.5"/>
  </svg>
);

export const Bug = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="36" rx="12" ry="16" fill="#fb923c" stroke="#ea580c" strokeWidth="2"/>
    <circle cx="32" cy="22" r="8" fill="#fdba74" stroke="#ea580c" strokeWidth="2"/>
    <circle cx="29" cy="20" r="2" fill="#1f2937"/>
    <circle cx="35" cy="20" r="2" fill="#1f2937"/>
    <path d="M20 30L14 26" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 30L50 26" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 38L12 38" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 38L52 38" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 46L14 50" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 46L50 50" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 14L26 8" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 14L38 8" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Scissors = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="18" cy="46" r="8" stroke="#7c3aed" strokeWidth="2.5" fill="#e9d5ff"/>
    <circle cx="46" cy="46" r="8" stroke="#7c3aed" strokeWidth="2.5" fill="#e9d5ff"/>
    <line x1="24" y1="40" x2="48" y2="12" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="40" x2="16" y2="12" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const Sun = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
    <line x1="32" y1="8" x2="32" y2="14" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="32" y1="50" x2="32" y2="56" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="8" y1="32" x2="14" y2="32" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="50" y1="32" x2="56" y2="32" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="15" y1="15" x2="19" y2="19" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="45" y1="45" x2="49" y2="49" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="49" y1="15" x2="45" y2="19" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
    <line x1="19" y1="45" x2="15" y2="49" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ============ UI ============
export const Rainbow = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M8 48C8 28 18 12 32 12C46 12 56 28 56 48" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 48C12 30 21 16 32 16C43 16 52 30 52 48" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
    <path d="M16 48C16 32 23 20 32 20C41 20 48 32 48 48" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 48C20 34 25 24 32 24C39 24 44 34 44 48" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 48C24 36 28 28 32 28C36 28 40 36 40 48" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
    <path d="M28 48C28 38 30 32 32 32C34 32 36 38 36 48" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const Sparkles = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8L35 24L48 20L38 30L48 40L35 36L32 52L29 36L16 40L26 30L16 20L29 24Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
    <circle cx="50" cy="14" r="3" fill="#fbbf24"/>
    <circle cx="14" cy="48" r="2.5" fill="#fbbf24"/>
    <circle cx="52" cy="44" r="2" fill="#fbbf24"/>
  </svg>
);

export const Star = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8L38 24L56 26L42 38L46 56L32 46L18 56L22 38L8 26L26 24Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
  </svg>
);

export const Heart = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 52C32 52 8 38 8 22C8 14 14 8 22 8C27 8 31 11 32 14C33 11 37 8 42 8C50 8 56 14 56 22C56 38 32 52 32 52Z" fill="#f472b6" stroke="#ec4899" strokeWidth="2"/>
    <path d="M20 20C20 20 18 26 22 30" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const HeartGreen = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 52C32 52 8 38 8 22C8 14 14 8 22 8C27 8 31 11 32 14C33 11 37 8 42 8C50 8 56 14 56 22C56 38 32 52 32 52Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M20 20C20 20 18 26 22 30" stroke="#86efac" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Fire = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8C32 8 20 20 20 36C20 44 25 52 32 52C39 52 44 44 44 36C44 28 38 24 36 20C36 24 34 28 32 28C30 28 28 24 28 20C28 24 32 8 32 8Z" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
    <path d="M32 24C32 24 26 32 26 40C26 44 29 48 32 48C35 48 38 44 38 40C38 34 34 30 32 24Z" fill="#fbbf24"/>
    <path d="M32 34C32 34 29 38 29 42C29 44 30 46 32 46C34 46 35 44 35 42C35 38 32 34 32 34Z" fill="#fef3c7"/>
  </svg>
);

export const Chart = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="8" y="8" width="48" height="48" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
    <rect x="14" y="32" width="8" height="18" rx="2" fill="#818cf8"/>
    <rect x="26" y="22" width="8" height="28" rx="2" fill="#6366f1"/>
    <rect x="38" y="28" width="8" height="22" rx="2" fill="#a78bfa"/>
    <circle cx="18" cy="28" r="2" fill="#4f46e5"/>
    <circle cx="30" cy="18" r="2" fill="#4f46e5"/>
    <circle cx="42" cy="24" r="2" fill="#4f46e5"/>
    <path d="M18 28L30 18L42 24" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Save = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="10" y="10" width="44" height="44" rx="6" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="18" y="10" width="28" height="16" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
    <rect x="18" y="36" width="28" height="18" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
    <rect x="34" y="12" width="6" height="12" rx="1" fill="#93c5fd"/>
  </svg>
);

export const Home = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M8 30L32 10L56 30V54C56 55.1 55.1 56 54 56H10C8.9 56 8 55.1 8 54V30Z" fill="#86efac" stroke="#16a34a" strokeWidth="2.5"/>
    <rect x="24" y="38" width="16" height="18" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <circle cx="36" cy="47" r="1.5" fill="#d97706"/>
  </svg>
);

export const Pencil = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M44 8L56 20L22 54L8 56L10 42L44 8Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <path d="M44 8L56 20L50 26L38 14L44 8Z" fill="#f97316" stroke="#d97706" strokeWidth="2"/>
    <path d="M10 42L22 54L8 56L10 42Z" fill="#fecaca" stroke="#d97706" strokeWidth="1.5"/>
    <line x1="14" y1="46" x2="18" y2="50" stroke="#d97706" strokeWidth="1"/>
  </svg>
);

export const Note = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="10" y="8" width="44" height="48" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <line x1="18" y1="20" x2="46" y2="20" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="28" x2="46" y2="28" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="36" x2="38" y2="36" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="44" x2="32" y2="44" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Package = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M8 20L32 8L56 20V44L32 56L8 44V20Z" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
    <path d="M8 20L32 32L56 20" stroke="#16a34a" strokeWidth="2"/>
    <path d="M32 32V56" stroke="#16a34a" strokeWidth="2"/>
    <path d="M20 14L44 26" stroke="#16a34a" strokeWidth="1.5" opacity="0.5"/>
  </svg>
);

export const Download = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="10" y="12" width="44" height="40" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
    <path d="M32 20V40" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 34L32 42L40 34" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Refresh = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M48 20C44 14 38 10 32 10C20 10 10 20 10 32C10 44 20 54 32 54C42 54 50 48 54 40" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
    <path d="M48 10V20H38" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============ CARAS ============
export const FaceHappy = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="24" cy="28" r="3" fill="#1f2937"/>
    <circle cx="40" cy="28" r="3" fill="#1f2937"/>
    <path d="M22 38C22 38 26 44 32 44C38 44 42 38 42 38" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="18" cy="36" r="3" fill="#fca5a5" opacity="0.5"/>
    <circle cx="46" cy="36" r="3" fill="#fca5a5" opacity="0.5"/>
  </svg>
);

export const FaceThirsty = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="24" cy="28" r="3" fill="#1f2937"/>
    <circle cx="40" cy="28" r="3" fill="#1f2937"/>
    <path d="M24 40C24 40 28 42 32 42C36 42 40 40 40 40" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M44 20C44 20 46 24 44 26" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="44" cy="28" r="2" fill="#60a5fa"/>
  </svg>
);

export const FaceSad = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M20 26C20 26 22 24 26 26" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M38 26C38 26 40 24 44 26" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="24" cy="30" r="2.5" fill="#1f2937"/>
    <circle cx="40" cy="30" r="2.5" fill="#1f2937"/>
    <path d="M24 42C24 42 28 38 32 38C36 38 40 42 40 42" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 36L18 40" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="42" r="2" fill="#60a5fa"/>
  </svg>
);

// ============ COMIDA / FERTILIZANTES ============
export const Banana = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M16 48C16 48 12 36 18 24C24 12 40 8 48 12C48 12 44 16 40 18C36 20 28 24 24 32C20 40 20 48 16 48Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <path d="M48 12C48 12 50 10 52 12" stroke="#92400e" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Coffee = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M14 24H42V46C42 50 38 54 34 54H22C18 54 14 50 14 46V24Z" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
    <path d="M42 28H48C50 28 52 30 52 32V36C52 38 50 40 48 40H42" stroke="#78350f" strokeWidth="2"/>
    <path d="M22 16C22 16 24 12 28 12C32 12 30 16 30 16" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M30 14C30 14 32 10 36 10C40 10 38 14 38 14" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const Rice = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M12 32C12 32 12 48 32 48C52 48 52 32 52 32" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="32" cy="32" rx="20" ry="8" fill="white" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="24" cy="30" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
    <ellipse cx="32" cy="28" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
    <ellipse cx="40" cy="30" rx="3" ry="2" fill="white" stroke="#d97706" strokeWidth="1"/>
  </svg>
);

export const Egg = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <ellipse cx="32" cy="36" rx="16" ry="20" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="32" cy="32" rx="12" ry="16" fill="#fffbeb" opacity="0.5"/>
  </svg>
);

export const Worm = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M12 40C12 40 20 28 28 32C36 36 32 44 40 44C48 44 52 36 52 36" stroke="#a16207" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <circle cx="52" cy="36" r="4" fill="#a16207"/>
    <circle cx="51" cy="35" r="1" fill="white"/>
    <circle cx="53" cy="35" r="1" fill="white"/>
  </svg>
);

export const TestTube = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M24 12H40V48C40 52 36 56 32 56C28 56 24 52 24 48V12Z" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <rect x="22" y="8" width="20" height="6" rx="2" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M24 36H40V48C40 52 36 56 32 56C28 56 24 52 24 48V36Z" fill="#60a5fa" opacity="0.5"/>
    <circle cx="30" cy="44" r="2" fill="white" opacity="0.6"/>
    <circle cx="34" cy="48" r="1.5" fill="white" opacity="0.6"/>
  </svg>
);

// ============ VARIOS ============
export const Calendar = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="8" y="12" width="48" height="44" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
    <rect x="8" y="12" width="48" height="12" rx="6" fill="#818cf8" stroke="#6366f1" strokeWidth="2"/>
    <line x1="20" y1="8" x2="20" y2="16" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
    <line x1="44" y1="8" x2="44" y2="16" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
    <rect x="16" y="32" width="8" height="6" rx="1" fill="#6366f1"/>
    <rect x="28" y="32" width="8" height="6" rx="1" fill="#6366f1" opacity="0.5"/>
    <rect x="40" y="32" width="8" height="6" rx="1" fill="#6366f1" opacity="0.3"/>
    <rect x="16" y="42" width="8" height="6" rx="1" fill="#6366f1" opacity="0.3"/>
    <rect x="28" y="42" width="8" height="6" rx="1" fill="#6366f1" opacity="0.3"/>
  </svg>
);

export const Check = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <path d="M20 32L28 40L44 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Alert = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 8L4 56H60L32 8Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="32" y1="24" x2="32" y2="40" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="48" r="2.5" fill="#92400e"/>
  </svg>
);

export const Search = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="28" cy="28" r="16" stroke="#6366f1" strokeWidth="3" fill="#e0e7ff"/>
    <line x1="40" y1="40" x2="54" y2="54" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export const Flower = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="24" r="8" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5"/>
    <circle cx="24" cy="32" r="8" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5"/>
    <circle cx="40" cy="32" r="8" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5"/>
    <circle cx="28" cy="40" r="8" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5"/>
    <circle cx="36" cy="40" r="8" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
    <path d="M32 48V58" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const Carrot = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56L24 20C24 16 28 12 32 12C36 12 40 16 40 20L32 56Z" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
    <path d="M28 16C28 16 24 8 20 8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 14C32 14 32 6 32 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 16C36 16 40 8 44 8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="28" y1="28" x2="36" y2="28" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
    <line x1="29" y1="36" x2="35" y2="36" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
    <line x1="30" y1="44" x2="34" y2="44" stroke="#ea580c" strokeWidth="1" opacity="0.5"/>
  </svg>
);

export const Muscle = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M12 40C12 40 16 28 24 24C32 20 36 24 40 20C44 16 48 12 52 16C56 20 52 28 48 32C44 36 40 36 36 40C32 44 28 48 20 48C12 48 12 40 12 40Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
  </svg>
);

export const Party = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M12 52L24 16L40 40L12 52Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2"/>
    <circle cx="36" cy="12" r="3" fill="#f472b6"/>
    <circle cx="48" cy="20" r="2" fill="#fbbf24"/>
    <circle cx="52" cy="32" r="2.5" fill="#4ade80"/>
    <circle cx="44" cy="8" r="2" fill="#60a5fa"/>
    <path d="M20 20L24 16L28 20" stroke="#7c3aed" strokeWidth="1.5"/>
    <ellipse cx="20" cy="48" rx="6" ry="4" fill="#fde68a" stroke="#d97706" strokeWidth="1"/>
  </svg>
);

export const WiltedFlower = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 56V32" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 32C32 32 24 28 22 22C20 16 26 12 30 16C32 18 32 22 32 22" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1.5"/>
    <path d="M32 32C32 32 40 28 42 22C44 16 38 12 34 16C32 18 32 22 32 22" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1.5"/>
    <path d="M32 40C28 42 24 40 24 36" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Mushroom = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M8 32C8 20 18 10 32 10C46 10 56 20 56 32H8Z" fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="2"/>
    <rect x="24" y="32" width="16" height="20" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
    <circle cx="20" cy="22" r="3" fill="#d4d4d8"/>
    <circle cx="36" cy="18" r="4" fill="#d4d4d8"/>
    <circle cx="46" cy="26" r="2.5" fill="#d4d4d8"/>
  </svg>
);

export const Pill = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="12" y="24" width="40" height="16" rx="8" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" transform="rotate(-30 32 32)"/>
    <rect x="32" y="24" width="20" height="16" rx="8" fill="white" stroke="#ef4444" strokeWidth="2" transform="rotate(-30 32 32)"/>
  </svg>
);

export const Clipboard = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="12" y="12" width="40" height="48" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
    <rect x="22" y="8" width="20" height="8" rx="3" fill="#818cf8" stroke="#6366f1" strokeWidth="2"/>
    <line x1="20" y1="28" x2="44" y2="28" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="36" x2="44" y2="36" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="44" x2="36" y2="44" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Number = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <rect x="8" y="8" width="48" height="48" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
    <text x="32" y="42" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#6366f1" fontFamily="Nunito, sans-serif">#</text>
  </svg>
);

export const Think = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
    <circle cx="24" cy="28" r="2.5" fill="#1f2937"/>
    <circle cx="40" cy="28" r="2.5" fill="#1f2937"/>
    <path d="M24 40C24 40 28 38 32 38C36 38 40 40 40 40" stroke="#1f2937" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="48" cy="16" r="3" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
    <circle cx="52" cy="10" r="2" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
    <circle cx="54" cy="6" r="1.5" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
  </svg>
);

export const Warning = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fecaca" stroke="#ef4444" strokeWidth="2"/>
    <line x1="32" y1="18" x2="32" y2="36" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="32" cy="44" r="3" fill="#ef4444"/>
  </svg>
);

export const SOS = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
    <text x="32" y="40" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="Nunito, sans-serif">SOS</text>
  </svg>
);

export const LeafFallen = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M16 48C16 48 20 24 40 16C52 12 52 28 48 36C44 44 28 52 16 48Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <path d="M16 48C24 40 36 32 48 36" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Tear = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M32 12C32 12 20 28 20 40C20 48 25 54 32 54C39 54 44 48 44 40C44 28 32 12 32 12Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M26 40C26 36 30 32 32 32" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

// ============ ICONOS ADICIONALES ============
export const ChartUp = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <path d="M8 56L24 36L36 44L56 16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 16H56V24" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FaceCry = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="24" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
    <path d="M20 26C20 26 22 24 26 26" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M38 26C38 26 40 24 44 26" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="24" cy="30" r="2.5" fill="#1f2937"/>
    <circle cx="40" cy="30" r="2.5" fill="#1f2937"/>
    <path d="M24 42C24 42 28 38 32 38C36 38 40 42 40 42" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 34L18 40" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
    <path d="M44 34L46 40" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CircleBrown = ({ size = 24, className = '' }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
    <circle cx="32" cy="32" r="20" fill="#92400e" stroke="#78350f" strokeWidth="2"/>
  </svg>
);

// ============ MAPA DE EMOJIS A COMPONENTES ============
export const iconMap: Record<string, React.FC<IconProps>> = {
  '🌱': Seedling,
  '🌿': Herb,
  '🌶️': Chili,
  '🫑': Pepper,
  '🧅': Onion,
  '🍃': Leaf,
  '🌾': Wheat,
  '🌳': Tree,
  '💜': Lavender,
  '💧': WaterDrop,
  '💧💧': WaterDrops,
  '💧💧💧': WaterDrops,
  '📏': Ruler,
  '🐛': Bug,
  '✂️': Scissors,
  '☀️': Sun,
  '🌈': Rainbow,
  '✨': Sparkles,
  '🌟': Star,
  '💚': HeartGreen,
  '💦': WaterDrops,
  '🔥': Fire,
  '📊': Chart,
  '💾': Save,
  '🏠': Home,
  '✏️': Pencil,
  '📝': Note,
  '📦': Package,
  '📥': Download,
  '🔄': Refresh,
  '😊': FaceHappy,
  '😅': FaceThirsty,
  '🥺': FaceSad,
  '🍌': Banana,
  '☕': Coffee,
  '🍚': Rice,
  '🥚': Egg,
  '🪱': Worm,
  '🧪': TestTube,
  '📅': Calendar,
  '✅': Check,
  '⚠️': Alert,
  '🔍': Search,
  '🌸': Flower,
  '🥕': Carrot,
  '💪': Muscle,
  '🎉': Party,
  '🥀': WiltedFlower,
  '🍄': Mushroom,
  '💊': Pill,
  '📋': Clipboard,
  '🔢': Number,
  '🤔': Think,
  '🍂': LeafFallen,
  '🆘': SOS,
  '❤️': Heart,
  '📈': ChartUp,
  '😢': FaceCry,
  '🟤': CircleBrown,
};
