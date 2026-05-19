import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        window.location.href = '/verify';
    };

    const visitorLinks = [
        { path: '/verify', label: 'VERIFY', icon: '🔍' },
        { path: '/guide', label: 'GUIDE', icon: '📖' },
        { path: '/login', label: 'LOGIN', icon: '⎋' },
    ];

    const authLinks = [
        { path: '/dashboard', label: 'DASHBOARD', icon: '◫' },
        ...(role === 'admin' ? [{ path: '/upload', label: 'ISSUE', icon: '⛓' }] : []),
        { path: '/verify', label: 'VERIFY', icon: '🔍' },
        { path: '/guide', label: 'GUIDE', icon: '📖' },
    ];

    const links = isAuth ? authLinks : visitorLinks;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
            background: 'rgba(2, 4, 8, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 42, 133, 0.1)',
        }}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 no-underline group">
                    <div className="relative">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="transition-transform duration-300 group-hover:scale-110">
                            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" className="animate-pulse" />
                            <polygon points="16,6 24,11 24,21 16,26 8,21 8,11" fill="rgba(255, 42, 133, 0.1)" stroke="var(--accent-primary)" strokeWidth="0.5" />
                            <text x="16" y="18" textAnchor="middle" fill="var(--accent-primary)" fontSize="10" fontFamily="var(--font-display)" fontWeight="bold">C</text>
                        </svg>
                    </div>
                    <span className="text-lg font-bold tracking-[4px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(255, 42, 133, 0.3)' }}>
                        CREDORA
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map(({ path, label, icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className="relative px-5 py-2 no-underline text-sm tracking-[2px] transition-all duration-300"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: isActive(path) ? 'var(--accent-primary)' : 'var(--text-muted)',
                                textShadow: isActive(path) ? '0 0 10px rgba(255, 42, 133, 0.5)' : 'none',
                            }}
                            onMouseEnter={(e) => { if (!isActive(path)) e.target.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { if (!isActive(path)) e.target.style.color = 'var(--text-muted)'; }}
                        >
                            <span className="mr-2 opacity-60">{icon}</span>
                            {label}
                            {isActive(path) && (
                                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full" style={{ background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary), 0 0 16px rgba(255, 42, 133, 0.3)' }} />
                            )}
                        </Link>
                    ))}
                    {isAuth && (
                        <button
                            onClick={handleLogout}
                            className="relative px-5 py-2 no-underline text-sm tracking-[2px] transition-all duration-300"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: 'var(--danger)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <span className="mr-2 opacity-60">⏏</span> LOGOUT
                        </button>
                    )}
                </div>

                {/* Network Badge */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255, 42, 133, 0.05)', border: '1px solid rgba(255, 42, 133, 0.15)' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
                    <span className="text-xs tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>POLYGON AMOY</span>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden px-6 pb-4" style={{ background: 'rgba(2, 4, 8, 0.95)', borderTop: '1px solid rgba(255, 42, 133, 0.1)' }}>
                    {links.map(({ path, label, icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className="block py-3 no-underline transition-colors"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.75rem',
                                letterSpacing: '2px',
                                color: isActive(path) ? 'var(--accent-primary)' : 'var(--text-muted)',
                                borderBottom: '1px solid rgba(255, 42, 133, 0.05)',
                            }}
                            onClick={() => setMobileOpen(false)}
                        >
                            <span className="mr-3 opacity-60">{icon}</span>
                            {label}
                        </Link>
                    ))}
                    {isAuth && (
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left py-3 no-underline transition-colors"
                            style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '0.75rem',
                                letterSpacing: '2px',
                                color: 'var(--danger)',
                                borderBottom: '1px solid rgba(255, 42, 133, 0.05)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <span className="mr-3 opacity-60">⏏</span> LOGOUT
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
