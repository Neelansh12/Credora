import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CyberCard from '../components/CyberCard';
import GlitchText from '../components/GlitchText';

export default function Register({ setUser}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [scanPos, setScanPos] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setScanPos(p => (p >= 100 ? 0 : p + 2)), 30);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.password_confirmation) {
        setError('CHECKSUM_MISMATCH: KEYS DO NOT MATCH');
        setIsLoading(false);
        return;
    }

    try {
        await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' });

        const xsrfToken = decodeURIComponent(
            document.cookie.split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] || ''
        );

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': xsrfToken,
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // New users always get 'user' role — set state and redirect to verify
            if (setUser) setUser({ role: data.role, name: data.name, email: data.email });
            window.location.href = '/verify';   // users go to verify, not dashboard
        } else {
            const msg = data.errors
                ? Object.values(data.errors).flat().join(' | ')
                : (data.message || 'REGISTRATION FAILED');
            setError('REG_FAILED: ' + msg);
        }
    } catch (err) {
        setError('NETWORK_ERROR: UNABLE TO REACH REGISTRATION SERVER');
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 10 }}>
            {/* Holographic Backdrop */}
            <div style={{ position: 'absolute', top: '-30px', left: '50%', width: '100px', height: '100px', borderRadius: '10px', border: '1px solid rgba(0, 229, 255, 0.3)', transform: 'translateX(-50%) rotate(45deg)', zIndex: -1, animation: 'neonPulseGreen 4s infinite' }} />

            <div className="text-center mb-10">
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '8px', background: 'rgba(20, 5, 35, 0.9)', border: '1px solid var(--accent-secondary)', marginBottom: '20px', boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)', color: 'var(--accent-secondary)', fontSize: '1.5rem', textShadow: '0 0 10px var(--accent-secondary)', transform: 'rotate(45deg)' }}>
                    <span style={{ transform: 'rotate(-45deg)' }}>⬡</span>
                </div>
                <GlitchText text="NEW_ENTITY_SYNC" size="1.8rem" />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-secondary)', boxShadow: '0 0 8px var(--accent-secondary)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-secondary)', letterSpacing: '2px' }}>
                        INITIALIZING PROTOCOL
                    </span>
                </div>
            </div>

            <div style={{ position: 'relative', marginTop: '20px' }}>
                {/* Decorative Corner Brackets (Outside Card) */}
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '30px', height: '30px', borderTop: '3px solid var(--accent-secondary)', borderLeft: '3px solid var(--accent-secondary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px', borderTop: '3px solid var(--accent-secondary)', borderRight: '3px solid var(--accent-secondary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '30px', height: '30px', borderBottom: '3px solid var(--accent-secondary)', borderLeft: '3px solid var(--accent-secondary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '30px', height: '30px', borderBottom: '3px solid var(--accent-secondary)', borderRight: '3px solid var(--accent-secondary)', zIndex: 20 }} />

                <CyberCard glowColor="var(--accent-secondary)" style={{ border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                    {/* Scanner line overlay */}
                    <div style={{ position: 'absolute', top: `${scanPos}%`, left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent)', boxShadow: '0 0 10px var(--accent-secondary)', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }} />

                    {error && (
                        <div className="mb-6 p-4 rounded text-xs" style={{ background: 'rgba(255, 42, 95, 0.1)', borderLeft: '3px solid var(--danger)', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ marginRight: '8px' }}>[!]</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 relative z-10 pt-1 pb-1">
                        {/* Terminal styled inputs */}
                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                                <span>&gt; ENTITY_ALIAS</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.3)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: '8px 12px' }}
                                placeholder="Corp / John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                                <span>&gt; COMMS_LINK</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.3)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: '8px 12px' }}
                                placeholder="operator@credora.net"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                                <span>&gt; GEN_AUTH_KEY</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.3)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: '8px 12px', letterSpacing: '2px' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid rgba(0, 229, 255, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                                <span>&gt; VERIFY_HASH</span>
                            </label>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(0, 229, 255, 0.3)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', padding: '8px 12px', letterSpacing: '2px' }}
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '4px' }}>
                            <button 
                                type="submit" 
                                className="cyber-btn w-full"
                                style={{ 
                                    padding: '16px',
                                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(188, 19, 254, 0.15))',
                                    borderColor: 'var(--accent-secondary)',
                                    color: 'var(--accent-secondary)'
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--bg-void)', borderTopColor: 'transparent' }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>SYNCING...</span>
                                    </>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>⬡</span> ESTABLISH RECORD
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', borderTop: '1px dashed rgba(0, 229, 255, 0.2)', paddingTop: '20px' }}>
                        <span>EXISTING_ENTITY?</span>{' '}
                        <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', marginLeft: '8px' }}>
                            [LOGIN]
                        </Link>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
