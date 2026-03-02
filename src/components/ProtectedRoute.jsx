import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, role, loading } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading ClassTrack...</p>
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && role !== 'admin') return <Navigate to="/dashboard" replace />

    return children
}
