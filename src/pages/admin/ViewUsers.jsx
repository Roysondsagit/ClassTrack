import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Sidebar from '../../components/Sidebar'

export default function ViewUsers() {
    const [users, setUsers] = useState([])
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) { setUsers(data); setFiltered(data) }
            setLoading(false)
        }
        load()
    }, [])

    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(users.filter(u =>
            (u.full_name || '').toLowerCase().includes(q) ||
            (u.role || '').toLowerCase().includes(q)
        ))
    }, [search, users])

    if (loading) return (
        <div className="app-layout">
            <Sidebar />
            <main className="page-content flex-center"><div className="spinner"></div></main>
        </div>
    )

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="page-content animate-slide-up">
                <div className="page-header">
                    <h1>All <span>Users</span> 👥</h1>
                    <p>Manage registered users and roles</p>
                </div>

                <div className="table-wrapper">
                    <div className="table-header">
                        <h3>Users ({filtered.length})</h3>
                        <div className="search-input">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name or role..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👤</div>
                            <p>No users found{search ? ` for "${search}"` : ''}.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(u => {
                                    const initials = (u.full_name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                                    return (
                                        <tr key={u.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: u.role === 'admin'
                                                            ? 'linear-gradient(135deg, var(--yellow), #ffaa00)'
                                                            : 'var(--bg-card2)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, color: u.role === 'admin' ? '#000' : 'var(--text-muted)',
                                                        fontSize: '0.75rem', flexShrink: 0,
                                                        border: '1px solid var(--border)'
                                                    }}>
                                                        {initials}
                                                    </div>
                                                    <span>{u.full_name || <span className="text-muted">No name</span>}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge badge-${u.role || 'user'}`}>
                                                    {u.role === 'admin' ? '⚡ Admin' : '🎓 Student'}
                                                </span>
                                            </td>
                                            <td className="text-muted text-sm">
                                                {new Date(u.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    )
}
