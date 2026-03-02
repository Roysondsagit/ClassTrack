import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="app-layout">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="page-wrapper">
                {/* Mobile top bar */}
                <header className="mobile-topbar">
                    <button
                        className="hamburger"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <span /><span /><span />
                    </button>
                    <div className="mobile-logo">
                        <span>Class</span>Track
                    </div>
                    <div style={{ width: 40 }} />
                </header>

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    )
}
