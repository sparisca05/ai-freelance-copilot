import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      if (sessionError) {
        setError(sessionError.message)
      }

      setSession(data.session)
      setIsLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      setError('')
      setMessage('')
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    if (mode === 'register') {
      const { error: signUpError } = await supabase.auth.signUp({ email, password })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setMessage('Account created. Check your email to confirm your account.')
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(signInError.message)
      }
    }

    setIsSubmitting(false)
  }

  const handleSignOut = async () => {
    setError('')
    setMessage('')

    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
      return
    }

    setEmail('')
    setPassword('')
    setMode('login')
  }

  if (isLoading) {
    return (
      <main className="auth-page">
        <section className="card">
          <h1>Loading...</h1>
          <p>Checking your current session.</p>
        </section>
      </main>
    )
  }

  if (session) {
    return <Dashboard email={session.user.email} error={error} onSignOut={handleSignOut} />
  }

  return (
    <AuthForm
      mode={mode}
      email={email}
      password={password}
      message={message}
      error={error}
      isSubmitting={isSubmitting}
      onModeChange={(nextMode) => {
        setMode(nextMode)
        setError('')
        setMessage('')
      }}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleAuth}
    />
  )
}

export default App
