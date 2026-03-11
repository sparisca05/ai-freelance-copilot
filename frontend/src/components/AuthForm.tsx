type AuthMode = 'login' | 'register'

type AuthFormProps = {
  mode: AuthMode
  email: string
  password: string
  message: string
  error: string
  isSubmitting: boolean
  onModeChange: (mode: AuthMode) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function AuthForm({
  mode,
  email,
  password,
  message,
  error,
  isSubmitting,
  onModeChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthFormProps) {
  return (
    <main className="auth-page">
      <section className="card">
        <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
        <p className="subtle">
          {mode === 'login'
            ? 'Sign in to open your dashboard.'
            : 'Create your account with Supabase auth.'}
        </p>

        <form onSubmit={onSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />

          {message ? <p className="status success">{message}</p> : null}
          {error ? <p className="status error">{error}</p> : null}

          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          {mode === 'login' ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            type="button"
            className="link-button"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Create one' : 'Login'}
          </button>
        </p>
      </section>
    </main>
  )
}

export default AuthForm
