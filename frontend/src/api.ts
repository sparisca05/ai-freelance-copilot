import { supabase } from '../supabaseClient'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token

  if (!token) {
    throw new Error('No auth token available')
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const text = await response.text()
    console.error('API error response:', { status: response.status, body: text })
    try {
      const error = JSON.parse(text)
      throw new Error(error.detail || `API error: ${response.status}`)
    } catch {
      throw new Error(`API error: ${response.status} - ${text}`)
    }
  }

  return response.json()
}
