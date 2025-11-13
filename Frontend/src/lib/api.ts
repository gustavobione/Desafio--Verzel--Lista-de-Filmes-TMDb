import { auth } from './firebase' 

const baseURL = 'http://127.0.0.1:8000/api' 

async function getAuthHeaders() {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')


  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    headers.append('Authorization', `Bearer ${token}`)
  }
  return headers
}

/**
 * Lida com a resposta do 'fetch' e trata erros.
 * (O 'fetch' não dá erro em 401 ou 500, nós temos que forçar)
 */
async function handleResponse(response: Response) {
  // Se a resposta NÃO for OK (ex: 401, 404, 500)
  if (!response.ok) {
    let errorData
    try {
      // Tenta pegar o JSON do erro (ex: {"detail": "Não autorizado"})
      errorData = await response.json()
    } catch (e) {
      // Se o corpo não for JSON, usa o status
      errorData = { detail: response.statusText }
    }
    // Lança um erro que o '.catch()' do nosso app pode pegar
    throw new Error(errorData.detail || 'Ocorreu um erro na API')
  }

  // Se a resposta for 204 (No Content), como em um DELETE,
  // não há JSON para ler, então retornamos null.
  if (response.status === 204) {
    return null
  }

  // Se tudo deu certo (200, 201), retorna o JSON
  return response.json()
}

export const api = {
  get: async (url: string, params?: Record<string, string>) => {
    const headers = await getAuthHeaders()
    let fullUrl = `${baseURL}${url}`

    // Adiciona os parâmetros de busca (ex: ?query=Matrix)
    if (params) {
      const query = new URLSearchParams(params).toString()
      fullUrl = `${fullUrl}?${query}`
    }

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: headers,
    })
    return handleResponse(response)
  },

  post: async (url: string, body: any) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },


  delete: async (url: string) => {
    const headers = await getAuthHeaders()
    const response = await fetch(`${baseURL}${url}`, {
      method: 'DELETE',
      headers: headers,
    })
    return handleResponse(response)
  },
}