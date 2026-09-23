import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

export function useConfetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const trigger = () => {
    const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb923c', '#f87171'];
    const newPieces: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
      rotation: Math.random() * 360,
      size: 4 + Math.random() * 6,
    }));
    setPieces(newPieces);
    setTimeout(() => setPieces([]), 2000);
  };

  return { pieces, trigger };
}

export function ConfettiOverlay({ pieces }: { pieces: ConfettiPiece[] }) {
  if (pieces.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: '20%',
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            borderRadius: piece.size > 7 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Floating hearts effect
export function FloatingHearts({ show }: { show: boolean }) {
  const [hearts, setHearts] = useState<number[]>([]);
  
  useEffect(() => {
    if (show) {
      setHearts([1, 2, 3]);
      const timer = setTimeout(() => setHearts([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (hearts.length === 0) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map(h => (
        <span
          key={h}
          className="absolute text-xl animate-heart"
          style={{
            left: `${30 + h * 15}%`,
            bottom: '50%',
            animationDelay: `${h * 0.2}s`,
          }}
        >
          💚
        </span>
      ))}
    </div>
  );
}
