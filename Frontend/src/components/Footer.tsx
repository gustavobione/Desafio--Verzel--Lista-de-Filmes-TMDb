import { Github } from 'lucide-react';
const GITHUB_URL = "https://github.com/gustavobione/Desafio--Verzel--Lista-de-Filmes-TMDb" 
const CREATOR_URL = "https://github.com/gustavobione"
const VERZEL_URL = "https://www.verzel.com.br/pt/"

export function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="container max-w-full flex flex-col items-center justify-between gap-4 py-8 md:flex-row px-[5%] md:px-[10%]">
        
        {/* Texto de Contexto */}
        <div className="text-sm text-muted-foreground text-center md:text-left">
          <p>
            Criado por{" "}
            <a
              href={CREATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Gustavo Bione
            </a>
            .
          </p>
          <p>
            Projeto de teste técnico (Full-Stack Jr.) desenvolvido para a{" "}
            <a
              href={VERZEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              <strong>Verzel</strong>
            </a>
            .
          </p>
        </div>
        
        {/* Links de Ação */}
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <Github className="h-4 w-4" />
            Ver o Código
          </a>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Dados da API (TMDb)
          </a>
        </div>

      </div>
    </footer>
  )
}