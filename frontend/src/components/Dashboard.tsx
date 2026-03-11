import { useEffect, useState } from 'react'
import { fetchWithAuth } from '../api'

type DashboardProps = {
  email: string | null | undefined
  error: string
  onSignOut: () => void
}

function Dashboard({ email, error, onSignOut }: DashboardProps) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setFetchError('')
        const result = await fetchWithAuth('/proposals')
        setData(result)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load data'
        console.error('Dashboard: Error fetching proposals:', errorMsg)
        setFetchError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [email])

  return (
    <main className="auth-page">
      <section className="card">
        <h1>Dashboard</h1>
        <p>Welcome, {email}</p>
        <p className="subtle">You are authenticated with Supabase.</p>
        {error ? <p className="status error">{error}</p> : null}
        {fetchError ? <p className="status error">{fetchError}</p> : null}
        {loading ? (
          <p className="subtle">Loading data...</p>
        ) : (
          <pre style={{ textAlign: 'left', fontSize: '0.85rem', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <button className="button" onClick={onSignOut}>
          Sign out
        </button>
      </section>
    </main>
  )
}

export default Dashboard
