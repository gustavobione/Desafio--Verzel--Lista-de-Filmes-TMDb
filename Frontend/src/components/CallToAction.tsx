// Arquivo: Frontend/src/components/CallToAction.tsx
// (Atualizado para aceitar um ícone)

import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import type { LucideIcon } from "lucide-react" // 1. Importa o tipo do ícone

interface CallToActionProps {
  icon: LucideIcon // 2. Adiciona a nova prop 'icon'
  title: string
  description: string
  buttonText: string
  linkTo: string
}

export function CallToAction({ 
  icon: Icon, // 3. Renomeia a prop para ser usada como um Componente
  title, 
  description, 
  buttonText, 
  linkTo 
}: CallToActionProps) {
  return (
    <div className="p-6 rounded-lg bg-muted text-center flex flex-col items-center">
      
      {/* 4. Renderiza o ícone */}
      <Icon className="h-10 w-10 text-primary mb-4" /> 
      
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md h-16"> {/* h-16 para alinhar a altura */}
        {description}
      </p>
      <Button asChild>
        <Link to={linkTo}>{buttonText}</Link>
      </Button>
    </div>
  )
}