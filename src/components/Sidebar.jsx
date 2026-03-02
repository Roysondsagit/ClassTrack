import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const THEME_KEY = 'classtrack-theme'

export default function Sidebar({ open, onClose }) {
    const { user, role, signOut } = useAuth()
    const navigate = useNavigate()
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(THEME_KEY, theme)
    }, [theme])

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    // Close sidebar on nav click (mobile)
    const handleNavClick = () => {
        if (onClose) onClose()
    }

    const initials = user?.email?.charAt(0).toUpperCase() || '?'
    const displayEmail = user?.email || ''

    return (
        <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
            {/* Close button — mobile only */}
            <button className="sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>

            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">🎓</div>
                <div className="logo-text">
                    Class<span>Track</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Menu</div>
                <NavLink to="/dashboard" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span> Dashboard
                </NavLink>
                <NavLink to="/classes" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📚</span> My Classes
                </NavLink>
                <NavLink to="/profile" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">👤</span> Profile
                </NavLink>

                {role === 'admin' && (
                    <>
                        <div className="nav-section-label" style={{ marginTop: '0.5rem' }}>Admin</div>
                        <NavLink to="/admin" end onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">⚡</span> Overview
                        </NavLink>
                        <NavLink to="/admin/create-class" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">➕</span> Create Class
                        </NavLink>
                        <NavLink to="/admin/mark-attendance" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">✅</span> Mark Attendance
                        </NavLink>
                        <NavLink to="/admin/users" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">👥</span> All Users
                        </NavLink>
                        <NavLink to="/admin/reports" onClick={handleNavClick} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <span className="nav-icon">📊</span> Reports
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">{initials}</div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{displayEmail}</div>
                        <div className="sidebar-user-role">{role || 'user'}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={handleSignOut} title="Sign out">
                        🚪
                    </button>
                </div>
            </div>
        </aside>
    )
}
