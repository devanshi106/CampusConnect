import { useEffect, useState } from 'react'
import './App.css'
import campusConnectLogo from './assets/campusconnect-logo.png'

const Arrow = () => <span aria-hidden="true">→</span>
const Logo = () => <img className="logo-mark" src={campusConnectLogo} alt="" />
const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

const roles = [
  { id: 'student', label: 'Student', detail: 'Discover events, find your people, and make campus yours.', icon: '✦' },
  { id: 'organiser', label: 'Club / organiser', detail: 'Create memorable events and grow your community.', icon: '◒' },
  { id: 'admin', label: 'Administrator', detail: 'Oversee campus activity and keep things running smoothly.', icon: '◈' },
]

const demoAdmins = [
  { label: 'Admin 1', email: 'admin1@campusconnect.demo', password: 'admin123' },
  { label: 'Admin 2', email: 'admin2@campusconnect.demo', password: 'admin456' },
  { label: 'Admin 3', email: 'admin3@campusconnect.demo', password: 'admin789' },
]

function LoginPage({ admin = false, onBack, onRegister }) {
  const availableRoles = admin ? roles.filter((item) => item.id === 'admin') : roles.filter((item) => item.id !== 'admin')
  const [role, setRole] = useState(admin ? 'admin' : 'student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const selectedRole = roles.find((item) => item.id === role)

  const submitLogin = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    const formData = new FormData(event.currentTarget)
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.detail || data.message || 'Unable to sign in. Please try again.')
      if (data.role !== selectedRole.id.toUpperCase()) {
        await fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' })
        throw new Error(`This account does not have access to the ${selectedRole.label} dashboard.`)
      }
      localStorage.setItem('campusconnect-user', JSON.stringify(data))
      setSuccess(`Signed in as ${data.email}. Your ${selectedRole.label} dashboard is ready to connect.`)
    } catch (requestError) {
      if (requestError.name === 'TypeError' || requestError.message?.toLowerCase().includes('failed to fetch')) {
        setError('Cannot connect to backend server (http://localhost:8080). Please ensure Spring Boot is running.')
      } else {
        setError(requestError.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <header className="login-header"><button className="brand brand-button" onClick={onBack}><Logo /><span>CampusConnect</span></button><button className="back-link" onClick={onBack}>← Back to home</button></header>
      <section className="login-layout">
        <div className="login-intro"><p className="eyebrow"><i /> WELCOME BACK</p><h1>Your campus<br /><em>starts here.</em></h1><p>Sign in to pick up where you left off—your events, communities, and opportunities are waiting.</p><div className="login-decoration"><span>✦</span><span>✦</span><div /></div></div>
        <div className="login-panel">
          <div className="login-panel-heading"><p className="eyebrow"><i /> {admin ? 'ADMINISTRATION' : 'SIGN IN'}</p><h2>{admin ? 'Admin portal' : 'Choose your space'}</h2><p>{admin ? 'Use your approved administrator account to continue.' : 'Select the dashboard that fits you best.'}</p></div>
          {admin ? <div className="admin-notice"><span>◈</span><div><strong>Campus administrator</strong><small>Restricted access for approved staff only.</small></div></div> : <div className="role-list">{availableRoles.map((item) => <button key={item.id} className={`role-card ${role === item.id ? 'selected' : ''}`} onClick={() => setRole(item.id)}><span className="role-icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><span className="role-check">{role === item.id ? '✓' : '→'}</span></button>)}</div>}
          <form className="login-form" onSubmit={submitLogin}>
            <label>Email address<input name="email" type="email" placeholder="you@college.edu" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label>Password<a href="#forgot">Forgot password?</a><input name="password" type="password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
            {error && <p className="auth-message auth-error">{error}</p>}
            {success && <p className="auth-message auth-success">{success}</p>}
            <button className="button button-primary login-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : <>Continue as {selectedRole.label} <Arrow /></>}</button>
          </form>
          {!admin ? (
            <p className="login-footer">New to CampusConnect? <button type="button" className="text-button" onClick={onRegister}>Create an account</button></p>
          ) : (
            <div className="demo-credentials-box">
              <p className="demo-credentials-title">Demo Administrator Credentials</p>
              <div className="demo-credentials-list">
                {demoAdmins.map((item) => (
                  <button
                    key={item.email}
                    type="button"
                    className="demo-credential-btn"
                    onClick={() => {
                      setEmail(item.email)
                      setPassword(item.password)
                    }}
                    title="Click to autofill this admin account"
                  >
                    <span className="demo-badge">{item.label}</span>
                    <span className="demo-email">{item.email}</span>
                    <span className="demo-pass">PW: <code>{item.password}</code></span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function RegisterPage({ onBack, onLogin }) {
  const allowedRoles = roles.filter((item) => item.id !== 'admin')
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const selectedRole = allowedRoles.find((item) => item.id === role) ?? allowedRoles[0]

  const submitRegister = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role: role.toUpperCase(),
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Unable to create account. Please try again.')
      }
      setSuccess(`Account successfully created for ${data.email} as ${selectedRole.label}! You can now sign in.`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <header className="login-header">
        <button className="brand brand-button" onClick={onBack}><Logo /><span>CampusConnect</span></button>
        <button className="back-link" onClick={onBack}>← Back to home</button>
      </header>
      <section className="login-layout">
        <div className="login-intro">
          <p className="eyebrow"><i /> JOIN CAMPUSCONNECT</p>
          <h1>Start your<br /><em>journey here.</em></h1>
          <p>Create your profile to join clubs, explore upcoming events, or lead community experiences on campus.</p>
          <div className="login-decoration"><span>✦</span><span>✦</span><div /></div>
        </div>
        <div className="login-panel">
          <div className="login-panel-heading">
            <p className="eyebrow"><i /> CREATE ACCOUNT</p>
            <h2>Choose your role</h2>
            <p>Register as a student attendee or an event organiser.</p>
          </div>
          <div className="role-list">
            {allowedRoles.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`role-card ${role === item.id ? 'selected' : ''}`}
                onClick={() => setRole(item.id)}
              >
                <span className="role-icon">{item.icon}</span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                <span className="role-check">{role === item.id ? '✓' : '→'}</span>
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={submitRegister}>
            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@college.edu"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </label>
            <span className="field-hint">Must contain at least 8 characters</span>
            <label>
              Confirm password
              <input
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="auth-message auth-error">{error}</p>}
            {success && (
              <div className="auth-message auth-success">
                <p>{success}</p>
                <div className="auth-actions">
                  <button type="button" className="button button-primary" onClick={onLogin}>
                    Sign in now <Arrow />
                  </button>
                </div>
              </div>
            )}

            {!success && (
              <button className="button button-primary login-submit" type="submit" disabled={submitting}>
                {submitting ? 'Creating account…' : <>Register as {selectedRole.label} <Arrow /></>}
              </button>
            )}
          </form>

          <p className="login-footer">
            Already have an account? <button type="button" className="text-button" onClick={onLogin}>Sign in</button>
          </p>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(window.location.pathname)
  const navigate = (path) => { window.history.pushState({}, '', path); setRoute(path) }

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', updateRoute)
    return () => window.removeEventListener('popstate', updateRoute)
  }, [])

  if (route === '/login') return <LoginPage onBack={() => navigate('/')} onRegister={() => navigate('/register')} />
  if (route === '/register') return <RegisterPage onBack={() => navigate('/')} onLogin={() => navigate('/login')} />
  if (route === '/admin') return <LoginPage admin onBack={() => navigate('/')} />

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="CampusConnect home"><Logo /><span>CampusConnect</span></a>
        <div className="nav-links"><a href="#events">Explore events</a><a href="#community">Community</a><a href="#about">About</a></div>
        <button className="nav-cta nav-button" onClick={() => navigate('/login')}>Sign in <Arrow /></button>
      </nav>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><i /> CAMPUSCONNECT</p>
          <h1>Same campus.<br /><em>More opportunities.</em></h1>
          <p className="hero-text">A place to discover events, find your people, and make the most of every day on campus.</p>
          <div className="hero-actions" id="join">
            <a className="button button-primary" href="#events">Explore events <Arrow /></a>
            <button className="button button-secondary" onClick={() => navigate('/login')}>Sign in</button>
            <button className="button button-secondary" onClick={() => navigate('/register')}>Create account</button>
          </div>
          <div className="member-note"><div className="avatars" aria-hidden="true"><b>AS</b><b>MK</b><b>RJ</b><b>+2k</b></div><span>Join <strong>2,000+ students</strong> already connecting on campus</span></div>
        </div>
        <div className="hero-visual" aria-label="Illustration of students connecting on campus">
          <div className="sun" /><div className="shape shape-one" /><div className="shape shape-two" />
          <div className="event-card featured-card"><p className="card-label">HAPPENING THIS WEEK</p><h3>Open Mic<br />at The Quad</h3><div className="card-meta"><span>Fri, 6:00 PM</span><span>124 going</span></div></div>
          <div className="student student-left"><span className="head" /><span className="body" /></div><div className="student student-right"><span className="head" /><span className="body" /></div>
          <div className="connection one" /><div className="connection two" /><div className="spark spark-one">✦</div><div className="spark spark-two">✳</div><div className="mini-card"><span>●</span> New connection</div>
        </div>
      </section>
      <section className="stats" aria-label="CampusConnect impact"><div><strong>120+</strong><span>campus events<br />every month</span></div><div><strong>36</strong><span>clubs & societies<br />to discover</span></div><div><strong>2k+</strong><span>students building<br />their circle</span></div></section>
      <section className="events-section" id="events">
        <div className="section-heading"><div><p className="eyebrow"><i /> FIND YOUR NEXT THING</p><h2>Something good is<br /><em>always happening.</em></h2></div><a className="text-link" href="#all-events">View all events <Arrow /></a></div>
        <div className="event-grid"><article className="event event-orange"><span className="date">OCT<br /><b>04</b></span><p>CREATIVE CLUB</p><h3>Design Jam:<br />Make it matter</h3><span className="event-arrow">↗</span></article><article className="event event-lime"><span className="date">OCT<br /><b>09</b></span><p>ATHLETICS</p><h3>Sunset<br />5K Run</h3><span className="event-arrow">↗</span></article><article className="event event-purple"><span className="date">OCT<br /><b>12</b></span><p>TECH SOCIETY</p><h3>Build Night:<br />Ideas to impact</h3><span className="event-arrow">↗</span></article></div>
      </section>
      <section className="community" id="community"><div className="community-art"><div className="ring ring-a" /><div className="ring ring-b" /><span>✦</span><span>✦</span></div><div><p className="eyebrow"><i /> BUILT FOR BELONGING</p><h2>Your people are<br /><em>out there.</em></h2><p>Whether you are looking for a project partner, a new club, or just someone who gets your weirdly specific interests—start here.</p><button className="button button-primary" onClick={() => navigate('/login')}>Find your circle <Arrow /></button></div></section>
      <footer id="about"><a className="brand" href="#top"><Logo /><span>CampusConnect</span></a><p>Made for the moments between classes.</p><button className="footer-admin" onClick={() => navigate('/admin')}>Administrator sign in</button><span>© 2026 CampusConnect</span></footer>
    </main>
  )
}
export default App
