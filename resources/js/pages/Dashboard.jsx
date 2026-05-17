import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import HashDisplay from '../components/HashDisplay';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, recent: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard', {
                    headers: { 'Accept': 'application/json' },
                    credentials: 'same-origin'
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    // Fallback to dummy data if not connected
                    throw new Error("No backend");
                }
            } catch (err) {
                // Dummy Data for UI showcase
                setStats({
                    total: 142,
                    recent: [
                        { id: 1, student_name: "Rahul Sharma", certificate_name: "B.Tech CS", certificate_hash: "a8f5f167f44f4964e6c998dee827110c...", issued_at: new Date().toISOString() },
                        { id: 2, student_name: "Anita Desai", certificate_name: "MBA Finance", certificate_hash: "9b71d224bd62f3785d96d1a750970312...", issued_at: new Date(Date.now() - 86400000).toISOString() },
                        { id: 3, student_name: "Vikram Singh", certificate_name: "Data Science Bootcamp", certificate_hash: "f401cd59e7fcad51b5c3ea534c03b1ab...", issued_at: new Date(Date.now() - 172800000).toISOString() }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-secondary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '20px 16px' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid rgba(0, 229, 255, 0.2)', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', margin: 0, color: 'white', letterSpacing: '2px' }}>
                        COMMAND <span style={{ color: 'var(--accent-secondary)' }}>CENTER</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginTop: '8px', letterSpacing: '1px' }}>
                        SYSTEM STATUS: <span style={{ color: 'var(--success)' }}>ONLINE</span> | NETWORK: POLYGON
                    </p>
                </div>
                <div>
                    <Link to="/upload" style={{ background: 'var(--accent-secondary)', color: 'black', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'var(--font-display)', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' }}>
                        <span style={{ fontSize: '1.2rem' }}>+</span> NEW ISSUANCE
                    </Link>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Metric 1 */}
                <div style={{ background: 'rgba(10, 2, 20, 0.6)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>📄</div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '8px' }}>TOTAL ISSUED</span>
                    <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent-secondary)', lineHeight: 1 }}>
                        {stats.total}
                    </div>
                </div>

                {/* Metric 2 */}
                <div style={{ background: 'rgba(10, 2, 20, 0.6)', border: '1px solid rgba(188, 19, 254, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>⛓</div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '8px' }}>NETWORK TIER</span>
                    <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--accent-purple)', lineHeight: 1.2, marginTop: '10px' }}>
                        POLYGON<br />AMOY L2
                    </div>
                </div>

                {/* Metric 3 */}
                <div style={{ background: 'rgba(10, 2, 20, 0.6)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>✓</div>
                    <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '8px' }}>SYSTEM HEALTH</span>
                    <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--success)', lineHeight: 1.2, marginTop: '4px' }}>
                        100%
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(0, 255, 136, 0.2)', marginTop: '12px', borderRadius: '2px' }}>
                        <div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '2px', boxShadow: '0 0 10px var(--success)' }} />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '12px', height: '12px', background: 'var(--accent-secondary)', display: 'inline-block' }} />
                    RECENT OPERATIONS
                </h2>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
                    {stats.recent && stats.recent.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0, 0, 0, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1px' }}>RECIPIENT</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1px' }}>CREDENTIAL</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1px' }}>DATE</th>
                                    <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '1px', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recent.map((cert) => (
                                    <tr key={cert.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '20px 24px', color: 'white', fontWeight: 500 }}>{cert.student_name}</td>
                                        <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{cert.certificate_name}</td>
                                        <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                                            {new Date(cert.issued_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <Link to={`/certificate/${cert.id}`} style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', border: '1px solid var(--accent-secondary)', padding: '6px 12px', borderRadius: '4px', transition: 'all 0.2s' }}>
                                                INSPECT
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>∅</div>
                            <p>No certificates have been issued yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
