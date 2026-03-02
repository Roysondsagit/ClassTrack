import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

export default function Dashboard() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 })
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        const load = async () => {
            const { data: p } = await supabase
                .from('profiles').select('full_name, role').eq('id', user.id).single()
            setProfile(p)

            const { data: att } = await supabase
                .from('attendance').select('*, classes(name)')
                .eq('user_id', user.id).order('date', { ascending: false })

            if (att) {
                const total = att.length
                const present = att.filter(a => a.status === 'present').length
                const absent = att.filter(a => a.status === 'absent').length
                setStats({ total, present, absent })
                setRecent(att.slice(0, 8))
            }
            setLoading(false)
        }
        load()
    }, [user])

    const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
    const pctColor = percentage >= 75 ? 'var(--success)' : percentage >= 50 ? 'var(--yellow)' : 'var(--danger)'

    if (loading) return (
        <Layout>
            <div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
        </Layout>
    )

    return (
        <Layout>
            <div className="animate-slide-up">
                <div className="page-header">
                    <h1>Welcome back, <span>{profile?.full_name || 'Student'}</span> 👋</h1>
                    <p>Here&apos;s your attendance overview</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value" style={{ color: pctColor }}>{percentage}%</div>
                        <div className="stat-label">Attendance Rate</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{stats.present}</div>
                        <div className="stat-label">Days Present</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">❌</div>
                        <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.absent}</div>
                        <div className="stat-label">Days Absent</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Classes</div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                        <span className="card-title">Attendance Progress</span>
                        <span className="font-bold" style={{ color: pctColor }}>{percentage}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${pctColor}, ${pctColor}bb)` }} />
                    </div>
                    <p className="text-sm text-muted mt-1">
                        {percentage >= 75 ? '✅ Great attendance! Keep it up.'
                            : percentage >= 50 ? '⚠️ Below 75%. Try to attend more classes.'
                                : '🚨 Critical! Your attendance is very low.'}
                    </p>
                </div>

                <div className="table-wrapper">
                    <div className="table-header"><h3>Recent Attendance</h3></div>
                    {recent.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon">📋</div><p>No attendance records yet.</p></div>
                    ) : (
                        <table>
                            <thead><tr><th>Date</th><th>Class</th><th>Status</th></tr></thead>
                            <tbody>
                                {recent.map(r => (
                                    <tr key={r.id}>
                                        <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td>{r.classes?.name || '—'}</td>
                                        <td><span className={`badge badge-${r.status}`}>{r.status === 'present' ? '✅ Present' : '❌ Absent'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    )
}
