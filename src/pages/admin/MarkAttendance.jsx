import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'

export default function MarkAttendance() {
    const { user } = useAuth()
    const [classes, setClasses] = useState([])
    const [users, setUsers] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [attendance, setAttendance] = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([
            supabase.from('classes').select('*').order('name'),
            supabase.from('profiles').select('id, full_name, role').eq('role', 'user'),
        ]).then(([classRes, userRes]) => {
            if (classRes.data) setClasses(classRes.data)
            if (userRes.data) setUsers(userRes.data)
        })
    }, [])

    const toggleAttendance = (userId, status) => setAttendance(prev => ({ ...prev, [userId]: status }))

    const handleSubmit = async () => {
        if (!selectedClass) { setError('Please select a class.'); return }
        if (Object.keys(attendance).length === 0) { setError('Mark at least one student.'); return }
        setLoading(true); setError('')
        const records = Object.entries(attendance).map(([userId, status]) => ({
            user_id: userId, class_id: selectedClass, date, status, marked_by: user.id
        }))
        const { error } = await supabase.from('attendance').upsert(records, { onConflict: 'user_id,class_id,date' })
        if (error) setError(error.message)
        else { setSuccess(`✅ Attendance saved for ${records.length} student(s) on ${date}!`); setAttendance({}) }
        setLoading(false)
    }

    return (
        <Layout>
            <div className="animate-slide-up">
                <div className="page-header">
                    <h1>Mark <span>Attendance</span> ✅</h1>
                    <p>Record attendance for a class on a specific date</p>
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="grid-2">
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Select Class</label>
                            <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                <option value="">— Choose a class —</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Date</label>
                            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="table-wrapper">
                    <div className="table-header">
                        <h3>Students ({users.length})</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => { const all = {}; users.forEach(u => { all[u.id] = 'present' }); setAttendance(all) }}>✅ All Present</button>
                            <button className="btn btn-sm btn-ghost" onClick={() => setAttendance({})}>🔄 Clear</button>
                        </div>
                    </div>

                    {users.length === 0
                        ? <div className="empty-state"><div className="empty-icon">👤</div><p>No students registered yet.</p></div>
                        : users.map(u => (
                            <div className="attendance-row" key={u.id}>
                                <div style={{ fontWeight: 600 }}>{u.full_name || 'Unknown Student'}</div>
                                <div className="attendance-btns">
                                    <button className={`att-btn present ${attendance[u.id] === 'present' ? 'active' : ''}`} onClick={() => toggleAttendance(u.id, 'present')}>✅ Present</button>
                                    <button className={`att-btn absent ${attendance[u.id] === 'absent' ? 'active' : ''}`} onClick={() => toggleAttendance(u.id, 'absent')}>❌ Absent</button>
                                </div>
                            </div>
                        ))
                    }

                    {users.length > 0 && (
                        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Saving...' : '💾 Save Attendance'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}
