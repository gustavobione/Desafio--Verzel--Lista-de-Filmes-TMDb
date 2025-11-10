// Arquivo: Frontend/src/components/CallToAction.tsx

import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"

interface CallToActionProps {
  title: string
  description: string
  buttonText: string
  linkTo: string
}

export function CallToAction({ title, description, buttonText, linkTo }: CallToActionProps) {
  return (
    <div className="p-6 rounded-lg bg-muted text-center flex flex-col items-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-md">
        {description}
      </p>
      <Button asChild>
        <Link to={linkTo}>{buttonText}</Link>
      </Button>
    </div>
  )
}