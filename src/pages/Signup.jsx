import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
    const navigate = useNavigate()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [awaitingConfirm, setAwaitingConfirm] = useState(false)
    const [confirmedEmail, setConfirmedEmail] = useState('')

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            setLoading(false)
            return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: fullName,
                role: 'user',
            })

            if (!data.session) {
                // Email confirmation required
                setConfirmedEmail(email)
                setAwaitingConfirm(true)
                setLoading(false)
            } else {
                // Email confirmation disabled — go straight to dashboard
                navigate('/dashboard')
            }
        }
    }

    // ── Email confirmation waiting screen ──
    if (awaitingConfirm) {
        return (
            <div className="auth-page">
                <div className="auth-box" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📧</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Check your email</h2>
                    <p className="text-muted" style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        We sent a confirmation link to<br />
                        <strong className="text-yellow">{confirmedEmail}</strong>
                    </p>
                    <p className="text-sm text-muted" style={{ marginBottom: '1.5rem' }}>
                        Click the link in the email to activate your account, then sign in.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-full btn-lg">
                        → Go to Sign In
                    </Link>
                    <div className="auth-footer" style={{ marginTop: '1rem' }}>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={async () => {
                                await supabase.auth.resend({ type: 'signup', email: confirmedEmail })
                                alert('Confirmation email resent!')
                            }}
                        >
                            Resend confirmation email
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-box">
                <div className="auth-logo">
                    <div className="logo-badge">🎓</div>
                    <h1>Class<span>Track</span></h1>
                    <p>Create your account</p>
                </div>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        id="signup-btn"
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : '🚀 Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}
