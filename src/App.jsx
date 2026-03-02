import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ClassView from './pages/ClassView'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import CreateClass from './pages/admin/CreateClass'
import MarkAttendance from './pages/admin/MarkAttendance'
import ViewUsers from './pages/admin/ViewUsers'
import Reports from './pages/admin/Reports'

function AppRoutes() {
    const { user, role, loading } = useAuth()

    if (loading) return null

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" replace />} />

            {/* User routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><ClassView /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/create-class" element={<ProtectedRoute adminOnly><CreateClass /></ProtectedRoute>} />
            <Route path="/admin/mark-attendance" element={<ProtectedRoute adminOnly><MarkAttendance /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><ViewUsers /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}
