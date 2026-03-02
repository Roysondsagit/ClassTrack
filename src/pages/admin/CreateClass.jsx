import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'

export default function CreateClass() {
    const { user } = useAuth()
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        setShowConfirm(true)
    }

    const handleCreate = async () => {
        setLoading(true)
        setError('')
        setShowConfirm(false)

        const { error } = await supabase.from('classes').insert({
            name: name.trim(),
            created_by: user.id,
        })

        if (error) setError(error.message)
        else {
            setSuccess(`Class "${name}" created successfully! 🎉`)
            setName('')
        }
        setLoading(false)
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="page-content animate-slide-up">
                <div className="page-header">
                    <h1>Create <span>Class</span> ➕</h1>
                    <p>Add a new class to the system</p>
                </div>

                <div style={{ maxWidth: 480 }}>
                    {success && <div className="alert alert-success">✅ {success}</div>}
                    {error && <div className="alert alert-error">⚠️ {error}</div>}

                    <div className="card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Class Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Mathematics — Grade 10"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                                {loading ? 'Creating...' : '➕ Create Class'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Confirm modal */}
                {showConfirm && (
                    <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Confirm Class Creation</h3>
                                <button className="modal-close" onClick={() => setShowConfirm(false)}>✕</button>
                            </div>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                                Are you sure you want to create the class <strong className="text-yellow">"{name}"</strong>?
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-primary" onClick={handleCreate}>✅ Yes, Create</button>
                                <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
