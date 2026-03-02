import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

export default function Profile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            if (data) { setProfile(data); setFullName(data.full_name || '') }
            setLoading(false)
        }
        load()
    }, [user])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id)

        if (error) setError(error.message)
        else setSuccess('Profile updated successfully!')
        setSaving(false)
    }

    if (loading) return (
        <div className="app-layout">
            <Sidebar />
            <main className="page-content flex-center"><div className="spinner"></div></main>
        </div>
    )

    const initials = fullName ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="page-content animate-slide-up">
                <div className="page-header">
                    <h1>Your <span>Profile</span> 👤</h1>
                    <p>Manage your account details</p>
                </div>

                <div style={{ maxWidth: 480 }}>
                    {/* Avatar */}
                    <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--yellow), #ffaa00)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 800, color: '#000',
                            margin: '0 auto 1rem', boxShadow: 'var(--shadow-yellow)'
                        }}>
                            {initials}
                        </div>
                        <h3>{fullName || 'Student'}</h3>
                        <p className="text-muted text-sm">{user?.email}</p>
                        <span className={`badge badge-${profile?.role || 'user'}`} style={{ marginTop: '0.5rem' }}>
                            {profile?.role === 'admin' ? '⚡ Admin' : '🎓 Student'}
                        </span>
                    </div>

                    {/* Edit form */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.25rem' }}>Edit Details</h3>

                        {success && <div className="alert alert-success">✅ {success}</div>}
                        {error && <div className="alert alert-error">⚠️ {error}</div>}

                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={user?.email || ''}
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={profile?.role || 'user'}
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed', textTransform: 'capitalize' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
