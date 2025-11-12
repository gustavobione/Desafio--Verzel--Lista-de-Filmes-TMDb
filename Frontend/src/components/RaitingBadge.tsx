// Arquivo: Frontend/src/components/RatingBadge.tsx
// (Atualizado com o "preenchimento de borda" cônico)

import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number // A nota (ex: 79)
  className?: string // Para permitir classes customizadas
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  
  // 1. Lógica de Cor (a mesma do RatingCircle)
  const color = rating >= 70 ? '#22c55e' : // Verde (green-500)
                rating >= 40 ? '#eab308' : // Amarelo (yellow-500)
                               '#ef4444';  // Vermelho (red-500)
  
  // 2. Cor de fundo "vazia" (o que não foi preenchido)
  const emptyColor = '#404040'; // zinc-700

  // 3. A MÁGICA: O Gradiente CÔNICO (O "Anel")
  // Exatamente a mesma lógica do RatingCircle.
  const gradientStyle = {
    background: `conic-gradient(${color} ${rating}%, ${emptyColor} 0)`,
  };

  return (
    <div 
      // 4. O "Anel" (O 'div' externo com o gradiente)
      // Ele é um retângulo 'rounded-md' com um 'padding' (p-0.5).
      // O padding é o que se torna a "borda" visível.
      className={cn(
        "rounded-lg p-0.5", 
        className
      )}
      style={gradientStyle}
    >
      {/* 5. O "Buraco" (O 'div' interno que cobre o centro) */}
      {/* Ele tem um fundo sólido (bg-zinc-800) e é ligeiramente
          menos arredondado ('rounded') para preencher o espaço. */}
      <div className="bg-zinc-800 rounded-[10px] px-2 py-0.5 flex items-baseline justify-center">
        
        {/* 6. O Texto (agora sobre o fundo escuro) */}
        <span className="text-white font-bold text-lg">{rating}</span>
        <span className="text-white text-xs">%</span>
      </div>
    </div>
  )
}