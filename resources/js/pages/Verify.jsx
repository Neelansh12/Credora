import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from '../components/GlitchText';
import HashDisplay from '../components/HashDisplay';
import StatusBadge from '../components/StatusBadge';

export default function Verify() {
    const [hash, setHash] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!hash.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch('/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken || '', 'Accept': 'application/json' },
                body: JSON.stringify({ hash: hash.trim() }),
                credentials: 'same-origin',
            });
            const json = await response.json();
            setResult(json);
        } catch {
            setError('System offline. Cannot reach blockchain nodes.');
        } finally {
            setLoading(false);
        }
    };

    const renderResult = () => {
        if (!result) return null;
        const status = result.result || result.status;
        const cert = result.certificate;

        if (status === 'not_found' || !cert) {
            return (
                <div style={{ marginTop: '40px', padding: '40px', borderRadius: '24px', background: 'rgba(255, 45, 85, 0.05)', border: '1px solid rgba(255, 45, 85, 0.3)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>∅</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--danger)', fontSize: '1.5rem', letterSpacing: '2px', marginBottom: '8px' }}>
                        INVALID SIGNATURE
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                        This hash does not exist on the Credora blockchain registry. It may be forged or manipulated.
                    </p>
                </div>
            );
        }

        return (
            <div style={{ marginTop: '40px', padding: '40px', borderRadius: '24px', background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.3)', backdropFilter: 'blur(10px)', animation: 'slideUp 0.5s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid rgba(0, 255, 136, 0.2)', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 255, 136, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px solid var(--success)' }}>
                            ✓
                        </div>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--success)', fontSize: '1.5rem', letterSpacing: '2px', margin: 0 }}>
                                AUTHENTIC RECORD
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, marginTop: '4px' }}>
                                Cryptographically verified on Polygon
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={status} size="lg" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                    <div>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Recipient</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{cert.student_name}</p>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Credential Title</span>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>{cert.certificate_name}</p>
                    </div>
                    {cert.issued_at && (
                        <div>
                            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Issue Date</span>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                                {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px' }}>
                    <HashDisplay hash={cert.certificate_hash} label="Document Signature" />
                    {cert.blockchain_tx && (
                        <div style={{ marginTop: '16px' }}>
                            <HashDisplay hash={cert.blockchain_tx} label="Blockchain Transaction" truncate />
                        </div>
                    )}
                </div>

                {cert.blockchain_tx && (
                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                        <a href={`https://amoy.polygonscan.com/tx/${cert.blockchain_tx}`} target="_blank" rel="noopener noreferrer"
                            style={{ flex: 1, padding: '16px', textAlign: 'center', background: 'var(--success)', color: 'black', fontWeight: 'bold', borderRadius: '12px', textDecoration: 'none', letterSpacing: '1px', transition: 'all 0.3s' }}>
                            VIEW ON BLOCKCHAIN EXPLORER
                        </a>
                        {cert.id && (
                            <Link to={`/certificate/${cert.id}`} style={{ flex: 1, padding: '16px', textAlign: 'center', border: '1px solid var(--success)', color: 'var(--success)', fontWeight: 'bold', borderRadius: '12px', textDecoration: 'none', letterSpacing: '1px', transition: 'all 0.3s' }}>
                                OPEN CERTIFICATE
                            </Link>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '40px 16px', position: 'relative', zIndex: 10, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '4px', marginBottom: '16px' }}>
                    GLOBAL <span style={{ color: 'var(--accent-secondary)' }}>SEARCH</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                    Query the immutable ledger. Enter a 64-character cryptographic hash to verify the authenticity of any credential worldwide.
                </p>
            </div>

            <form onSubmit={handleVerify} style={{ position: 'relative' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'rgba(10, 2, 20, 0.6)', 
                    borderRadius: '50px', 
                    padding: '10px 10px 10px 30px', 
                    border: '2px solid rgba(0, 229, 255, 0.3)', 
                    boxShadow: '0 20px 40px rgba(0, 229, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                }}>
                    <span style={{ fontSize: '1.5rem', color: 'var(--accent-secondary)', marginRight: '16px' }}>🔍</span>
                    <input
                        type="text"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        placeholder="Paste SHA-256 hash..."
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'white', 
                            flex: 1, 
                            fontSize: '1.2rem', 
                            outline: 'none',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '1px'
                        }}
                        maxLength={64}
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !hash.trim()}
                        style={{ 
                            background: 'var(--accent-secondary)', 
                            color: 'black', 
                            borderRadius: '40px', 
                            padding: '16px 40px', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            border: 'none',
                            cursor: loading || !hash.trim() ? 'not-allowed' : 'pointer',
                            opacity: loading || !hash.trim() ? 0.7 : 1,
                            transition: 'all 0.2s',
                            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
                        }}
                    >
                        {loading ? 'SEARCHING...' : 'VERIFY'}
                    </button>
                </div>
            </form>

            {error && (
                <div style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '20px', fontSize: '1.1rem' }}>
                    {error}
                </div>
            )}

            {renderResult()}
            
            {/* Ambient Background Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vh', background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.05) 0%, transparent 70%)', zIndex: -1, pointerEvents: 'none' }} />
        </div>
    );
}
