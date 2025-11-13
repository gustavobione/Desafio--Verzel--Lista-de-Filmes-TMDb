import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import type { LucideIcon } from "lucide-react" 

interface CallToActionProps {
  icon: LucideIcon 
  title: string
  description: string
  buttonText: string
  linkTo: string
}

export function CallToAction({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  linkTo 
}: CallToActionProps) {
  return (
    <div className="p-6 rounded-lg bg-muted text-center flex flex-col items-center">
      
      <Icon className="h-10 w-10 text-primary mb-4" /> 
      
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md h-16">
        {description}
      </p>
      <Button asChild>
        <Link to={linkTo}>{buttonText}</Link>
      </Button>
    </div>
  )
}