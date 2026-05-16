import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CyberCard from '../components/CyberCard';
import GlitchText from '../components/GlitchText';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [scanPos, setScanPos] = useState(0);

    // Simple vertical scanner animation
    useEffect(() => {
        const interval = setInterval(() => {
            setScanPos(p => (p >= 100 ? 0 : p + 2));
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (formData.email && formData.password) {
                setIsLoading(false);
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = '/dashboard';
            } else {
                setError('AUTH_FAILED: INVALID CREDENTIALS');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto', padding: '0 16px', position: 'relative', zIndex: 10 }}>
            {/* Holographic Backdrop Rings */}
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '120px', borderRadius: '50%', border: '1px dashed rgba(255, 16, 122, 0.4)', animation: 'spin 8s linear infinite', zIndex: -1 }} />
            <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255, 16, 122, 0.1)', background: 'radial-gradient(circle, rgba(255, 16, 122, 0.1) 0%, transparent 70%)', zIndex: -1 }} />

            <div className="text-center mb-10">
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(20, 5, 35, 0.9)', border: '1px solid var(--accent-primary)', marginBottom: '20px', boxShadow: '0 0 20px rgba(255, 16, 122, 0.4)', color: 'var(--accent-primary)', fontSize: '1.5rem', textShadow: '0 0 10px var(--accent-primary)' }}>
                    ⎋
                </div>
                <GlitchText text="SYSTEM_AUTH" size="2.2rem" />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--success)', letterSpacing: '2px' }}>
                        SECURE ENCLAVE CONNECTED
                    </span>
                </div>
            </div>

            <div style={{ position: 'relative', marginTop: '20px' }}>
                {/* Decorative Corner Brackets (Outside the Card) */}
                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '30px', height: '30px', borderTop: '3px solid var(--accent-primary)', borderLeft: '3px solid var(--accent-primary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px', borderTop: '3px solid var(--accent-primary)', borderRight: '3px solid var(--accent-primary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '30px', height: '30px', borderBottom: '3px solid var(--accent-primary)', borderLeft: '3px solid var(--accent-primary)', zIndex: 20 }} />
                <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '30px', height: '30px', borderBottom: '3px solid var(--accent-primary)', borderRight: '3px solid var(--accent-primary)', zIndex: 20 }} />

                <CyberCard glowColor="var(--accent-primary)">
                    {/* Scanner line overlay */}
                    <div style={{ position: 'absolute', top: `${scanPos}%`, left: '0', right: '0', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(255, 16, 122, 0.5), transparent)', boxShadow: '0 0 10px var(--accent-primary)', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }} />

                    {error && (
                        <div className="mb-6 p-4 rounded text-xs" style={{ background: 'rgba(255, 42, 95, 0.1)', borderLeft: '3px solid var(--danger)', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ marginRight: '8px' }}>[!]</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10 pt-2 pb-2">
                        {/* Terminal styled inputs */}
                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid rgba(255, 16, 122, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '10px' }}>
                                <span>&gt; ID_TARGET (EMAIL)</span>
                                <span style={{ opacity: 0.5 }}>[REQ]</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(255, 16, 122, 0.3)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', padding: '16px' }}
                                placeholder="operator@credora.net"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid rgba(255, 16, 122, 0.4)' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', letterSpacing: '2px', marginBottom: '10px' }}>
                                <span>&gt; AUTH_HASH (PASSWORD)</span>
                                <span style={{ opacity: 0.5 }}>[HIDDEN]</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="cyber-input"
                                style={{ background: 'rgba(10, 2, 20, 0.8)', border: '1px solid rgba(255, 16, 122, 0.3)', fontFamily: 'var(--font-body)', fontSize: '1.1rem', letterSpacing: '4px', padding: '16px' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <button 
                                type="submit" 
                                className="cyber-btn w-full"
                                style={{ padding: '20px' }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--bg-void)', borderTopColor: 'transparent' }} />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>DECRYPTING...</span>
                                    </>
                                ) : (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.4rem' }}>⚡</span> INITIALIZE
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', borderTop: '1px dashed rgba(255, 16, 122, 0.2)', paddingTop: '20px' }}>
                        <span>UNAUTHORIZED_ENTITY?</span>{' '}
                        <Link to="/register" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', marginLeft: '8px' }}>
                            [REQUEST_ACCESS]
                        </Link>
                    </div>
                </CyberCard>
            </div>
        </div>
    );
}
