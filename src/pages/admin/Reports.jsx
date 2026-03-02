import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Layout from '../../components/Layout'

export default function Reports() {
    const [classes, setClasses] = useState([])
    const [records, setRecords] = useState([])
    const [filterClass, setFilterClass] = useState('')
    const [filterDate, setFilterDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetched, setFetched] = useState(false)

    useEffect(() => {
        supabase.from('classes').select('*').order('name').then(({ data }) => { if (data) setClasses(data) })
    }, [])

    const loadReports = async () => {
        setLoading(true)
        let query = supabase.from('attendance').select('*, profiles(full_name), classes(name)').order('date', { ascending: false })
        if (filterClass) query = query.eq('class_id', filterClass)
        if (filterDate) query = query.eq('date', filterDate)
        const { data } = await query
        if (data) setRecords(data)
        setFetched(true); setLoading(false)
    }

    const total = records.length
    const present = records.filter(r => r.status === 'present').length
    const absent = records.filter(r => r.status === 'absent').length
    const pct = total > 0 ? Math.round((present / total) * 100) : 0

    return (
        <Layout>
            <div className="animate-slide-up">
                <div className="page-header">
                    <h1>Attendance <span>Reports</span> 📊</h1>
                    <p>Filter and analyze attendance data</p>
                </div>

                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Filter by Class</label>
                            <select className="form-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                                <option value="">All Classes</option>
                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Filter by Date</label>
                            <input type="date" className="form-input" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-primary" onClick={loadReports} disabled={loading}>{loading ? 'Loading...' : '🔍 Generate Report'}</button>
                        <button className="btn btn-ghost" onClick={() => { setFilterClass(''); setFilterDate(''); setRecords([]); setFetched(false) }}>🔄 Clear</button>
                    </div>
                </div>

                {fetched && (
                    <>
                        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                            <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-value">{total}</div><div className="stat-label">Total Records</div></div>
                            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value" style={{ color: 'var(--success)' }}>{present}</div><div className="stat-label">Present</div></div>
                            <div className="stat-card"><div className="stat-icon">❌</div><div className="stat-value" style={{ color: 'var(--danger)' }}>{absent}</div><div className="stat-label">Absent</div></div>
                            <div className="stat-card"><div className="stat-icon">📊</div><div className="stat-value" style={{ color: pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--yellow)' : 'var(--danger)' }}>{pct}%</div><div className="stat-label">Rate</div></div>
                        </div>

                        <div className="table-wrapper">
                            <div className="table-header"><h3>Records ({total})</h3></div>
                            {records.length === 0
                                ? <div className="empty-state"><div className="empty-icon">📭</div><p>No records for selected filters.</p></div>
                                : (
                                    <table>
                                        <thead><tr><th>Date</th><th>Student</th><th>Class</th><th>Status</th></tr></thead>
                                        <tbody>
                                            {records.map(r => (
                                                <tr key={r.id}>
                                                    <td className="text-sm">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td>{r.profiles?.full_name || '—'}</td>
                                                    <td>{r.classes?.name || '—'}</td>
                                                    <td><span className={`badge badge-${r.status}`}>{r.status === 'present' ? '✅ Present' : '❌ Absent'}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}
