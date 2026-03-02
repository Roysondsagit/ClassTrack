import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Layout from '../../components/Layout'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, classes: 0, attendance: 0, todayPresent: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const today = new Date().toISOString().split('T')[0]
            const [u, c, a, t] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('classes').select('id', { count: 'exact', head: true }),
                supabase.from('attendance').select('id', { count: 'exact', head: true }),
                supabase.from('attendance').select('id', { count: 'exact', head: true }).eq('date', today).eq('status', 'present'),
            ])
            setStats({ users: u.count || 0, classes: c.count || 0, attendance: a.count || 0, todayPresent: t.count || 0 })
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return <Layout><div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div></Layout>

    return (
        <Layout>
            <div className="animate-slide-up">
                <div className="page-header">
                    <h1>Admin <span>Overview</span> ⚡</h1>
                    <p>System-wide statistics and quick access</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-value">{stats.users}</div><div className="stat-label">Total Users</div></div>
                    <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{stats.classes}</div><div className="stat-label">Classes Created</div></div>
                    <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{stats.attendance}</div><div className="stat-label">Total Records</div></div>
                    <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value" style={{ color: 'var(--success)' }}>{stats.todayPresent}</div><div className="stat-label">Present Today</div></div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <a href="/admin/create-class" className="btn btn-primary">➕ Create Class</a>
                        <a href="/admin/mark-attendance" className="btn btn-outline">✅ Mark Attendance</a>
                        <a href="/admin/users" className="btn btn-ghost">👥 View Users</a>
                        <a href="/admin/reports" className="btn btn-ghost">📊 Reports</a>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
