// Arquivo: Frontend/src/components/RatingCircle.tsx

import { cn } from "@/lib/utils"

export function RatingCircle({ rating }: { rating: number }) {
  // 1. Define a cor do ANEL baseado na nota
  const color = rating >= 70 ? '#22c55e' : // Verde (green-500)
                rating >= 40 ? '#eab308' : // Amarelo (yellow-500)
                               '#ef4444';  // Vermelho (red-500)
  
  // 2. Define a cor "vazia" do anel
  const emptyColor = '#404040'; // zinc-700 (Fundo do anel)

  // 3. Cria o estilo do gradiente cônico
  const gradientStyle = {
    background: `conic-gradient(${color} ${rating}%, ${emptyColor} 0)`,
  };

  return (
    <div 
      // O Círculo Externo (O Anel)
      className={cn(
        "absolute bottom-2 left-2 z-10 h-10 w-10 rounded-full",
        "flex items-center justify-center p-0.5"
      )}
      style={gradientStyle}
    >
      {/* O Círculo Interno (O "Buraco" do donut) */}
      <div className="h-full w-full rounded-full bg-zinc-800 flex items-center justify-center">
        
        {/* O Texto */}
        <span className="text-white font-bold text-sm">{rating}</span>
        <span className="text-white text-[8px]">%</span>
      </div>
    </div>
  )
}