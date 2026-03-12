import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'
import AuthForm from './components/AuthForm'
import Dashboard from './components/Dashboard'
import Profile, { type UserProfile } from './components/Profile'
import { fetchWithAuth } from './api'
import './App.css'

const emptyProfile: UserProfile = {
  full_name: '',
  headline: '',
  years_experience: '',
  primary_role: '',
  skills: [],
  bio: '',
}

function App() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState<'dashboard' | 'profile'>('dashboard')
  const [profile, setProfile] = useState<UserProfile>(emptyProfile)

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
      setActiveView('dashboard')
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
    setActiveView('dashboard')
    setProfile(emptyProfile)
  }

  const handleSaveProfile = async (nextProfile: UserProfile) => {
    setProfile(nextProfile)

    if (!session?.user?.id) {
      return
    }

    try{
      console.log('Saving profile to backend:', nextProfile)
      await fetchWithAuth(`/update_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nextProfile),
      })

      const storageKey = `profile_${session.user.id}`
      window.localStorage.setItem(storageKey, JSON.stringify(nextProfile))
    } catch (err) {
      console.error('Failed to save profile:', err instanceof Error ? err.message : err)
    }
  }

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }

    const storageKey = `profile_${session.user.id}`
    const persisted = window.localStorage.getItem(storageKey)

    if (!persisted) {
      setProfile(emptyProfile)
      return
    }

    try {
      const parsed = JSON.parse(persisted) as UserProfile
      setProfile({ ...emptyProfile, ...parsed })
    } catch {
      setProfile(emptyProfile)
    }
  }, [session?.user?.id])

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
    if (activeView === 'profile') {
      return (
        <Profile
          email={session.user.email}
          profile={profile}
          onSaveProfile={handleSaveProfile}
          onGoToDashboard={() => setActiveView('dashboard')}
          onSignOut={handleSignOut}
        />
      )
    }

    return (
      <Dashboard
        email={session.user.email}
        error={error}
        onSignOut={handleSignOut}
        onOpenProfile={() => setActiveView('profile')}
      />
    )
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
