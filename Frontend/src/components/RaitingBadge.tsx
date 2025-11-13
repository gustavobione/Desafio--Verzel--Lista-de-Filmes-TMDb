import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  className?: string
}

export function RatingBadge({ rating, className }: RatingBadgeProps) {
  
  const color = rating >= 70 ? '#22c55e' : // Verde (green-500)
                rating >= 40 ? '#eab308' : // Amarelo (yellow-500)
                               '#ef4444';  // Vermelho (red-500)
  
  const emptyColor = '#404040'; // zinc-700

  const gradientStyle = {
    background: `conic-gradient(${color} ${rating}%, ${emptyColor} 0)`,
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-0.5", 
        className
      )}
      style={gradientStyle}
    >
      <div className="bg-zinc-800 rounded-[10px] px-2 py-0.5 flex items-baseline justify-center">
        
        <span className="text-white font-bold text-lg">{rating}</span>
        <span className="text-white text-xs">%</span>
      </div>
    </div>
  )
}