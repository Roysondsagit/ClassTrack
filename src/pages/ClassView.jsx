import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export default function ClassView() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.from('classes').select('*, profiles(full_name)')
            .order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setClasses(data); setLoading(false) })
    }, [])

    if (loading) return <Layout><div className="flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div></Layout>

    return (
        <Layout>
            <div className="animate-slide-up">
                <div className="page-header">
                    <h1>My <span>Classes</span> 📚</h1>
                    <p>All available classes in the system</p>
                </div>

                {classes.length === 0 ? (
                    <div className="card"><div className="empty-state"><div className="empty-icon">📭</div><p>No classes yet. Ask your admin to create classes.</p></div></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1rem' }}>
                        {classes.map((cls, i) => (
                            <div className="stat-card" key={cls.id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="stat-icon">📖</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem' }}>{cls.name}</div>
                                <div className="text-sm text-muted">Created by {cls.profiles?.full_name || 'Admin'}</div>
                                <div className="text-sm text-muted mt-1">
                                    {new Date(cls.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
