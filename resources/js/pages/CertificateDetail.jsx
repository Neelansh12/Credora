import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import StatusBadge from '../components/StatusBadge';

export default function CertificateDetail() {
    const { id } = useParams();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revoking, setRevoking] = useState(false);
    
    // Check if user is admin based on local storage
    const isAdmin = localStorage.getItem('role') === 'admin';

    useEffect(() => { fetchCertificate(); }, [id]);

    const fetchCertificate = async () => {
        try {
            const res = await fetch(`/api/certificate/${id}`, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
            if (res.ok) {
                const data = await res.json();
                setCert(data.certificate || data);
            } else {
                setError('Certificate not found.');
            }
        } catch {
            setError('Network error. Is the Laravel server running?');
        } finally { setLoading(false); }
    };

    const handleRevoke = async () => {
        setRevoking(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const res = await fetch('/api/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken || '', 'Accept': 'application/json' },
                body: JSON.stringify({ hash: cert.certificate_hash }),
                credentials: 'same-origin',
            });
            if (res.ok) {
                setCert({ ...cert, status: 'revoked' });
                setShowRevokeModal(false);
            }
        } catch { /* noop */ }
        finally { setRevoking(false); }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--accent-secondary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error || !cert) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--danger)', fontSize: '2rem' }}>{error || 'Certificate not found'}</h2>
                <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', textDecoration: 'none', borderRadius: '8px', fontFamily: 'var(--font-display)' }}>
                    RETURN TO DASHBOARD
                </Link>
            </div>
        );
    }

    const verifyUrl = `${window.location.origin}/verify?hash=${cert.certificate_hash}`;

    return (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 16px', position: 'relative', zIndex: 10 }}>
            {/* Header Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '2px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                    ← BACK TO DASHBOARD
                </Link>
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
                <span style={{ color: 'var(--accent-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '2px' }}>
                    CERTIFICATE #{cert.id}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                {/* Left Column - Main Details */}
                <div style={{ gridColumn: '1 / lg:span 2', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Title & Badges */}
                    <div style={{ background: 'rgba(10, 2, 20, 0.7)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px' }}>
                            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', margin: 0, color: 'white', letterSpacing: '2px', lineHeight: 1.1 }}>
                                CREDENTIAL <span style={{ color: 'var(--accent-secondary)' }}>RECORD</span>
                            </h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                <StatusBadge status={cert.status} size="lg" />
                                {cert.blockchain_status && (
                                    <StatusBadge status={cert.blockchain_status} size="lg" />
                                )}
                            </div>
                        </div>

                        {/* Data Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Recipient Name
                                </span>
                                <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', margin: 0 }}>
                                    {cert.student_name}
                                </p>
                            </div>
                            
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    Credential Title
                                </span>
                                <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', margin: 0 }}>
                                    {cert.certificate_name}
                                </p>
                            </div>

                            {cert.student_email && (
                                <div>
                                    <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Recipient Email
                                    </span>
                                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                                        {cert.student_email}
                                    </p>
                                </div>
                            )}

                            {cert.issued_at && (
                                <div>
                                    <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                                        Issuance Date
                                    </span>
                                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                                        {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cryptographic Data */}
                    <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ width: '8px', height: '8px', background: 'var(--accent-purple)', borderRadius: '50%' }} />
                            CRYPTOGRAPHIC PROOFS
                        </h3>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '12px' }}>
                                DOCUMENT SIGNATURE (SHA-256)
                            </span>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', overflowWrap: 'break-word', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                {cert.certificate_hash}
                            </div>
                        </div>

                        {cert.blockchain_tx && (
                            <div>
                                <span style={{ display: 'block', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px', marginBottom: '12px' }}>
                                    BLOCKCHAIN TRANSACTION HASH
                                </span>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', overflowWrap: 'break-word', wordBreak: 'break-all', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                    {cert.blockchain_tx}
                                </div>
                                
                                <a href={`https://amoy.polygonscan.com/tx/${cert.blockchain_tx}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', color: 'white', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '1px', background: 'rgba(188, 19, 254, 0.2)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(188, 19, 254, 0.4)', transition: 'all 0.3s' }}>
                                    VIEW ON POLYGON EXPLORER ↗
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Actions & QR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', gridColumn: 'lg:span 1' }}>
                    
                    {/* QR Code */}
                    <div style={{ background: 'rgba(10, 2, 20, 0.7)', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '24px', padding: '40px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-secondary)', fontSize: '1rem', letterSpacing: '3px', margin: '0 0 30px 0' }}>VERIFICATION QR</h4>
                        <div style={{ display: 'inline-block', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,229,255,0.2)' }}>
                            <QRCodeSVG value={verifyUrl} size={180} bgColor="#ffffff" fgColor="#000000" level="H" />
                        </div>
                        <p style={{ marginTop: '24px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Scan from any device to instantly verify authenticity.</p>
                    </div>

                    {/* Actions Panel */}
                    <div style={{ background: 'rgba(10, 2, 20, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(20px)' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: '1rem', letterSpacing: '3px', margin: '0 0 30px 0' }}>AVAILABLE ACTIONS</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cert.file_path && (
                                <a href={`/storage/${cert.file_path}`} download style={{ display: 'block', width: '100%', padding: '16px', background: 'white', color: 'black', textAlign: 'center', textDecoration: 'none', borderRadius: '12px', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '1px', transition: 'transform 0.2s' }}>
                                    📄 DOWNLOAD PDF
                                </a>
                            )}
                            
                            <Link to={`/verify?hash=${cert.certificate_hash}`} style={{ display: 'block', width: '100%', padding: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '12px', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '1px', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                                🔍 VERIFY ON-CHAIN
                            </Link>

                            {isAdmin && cert.status !== 'revoked' && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0', paddingTop: '32px' }}>
                                    <button onClick={() => setShowRevokeModal(true)} style={{ display: 'block', width: '100%', padding: '16px', background: 'rgba(255, 45, 85, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', textAlign: 'center', borderRadius: '12px', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        ⚠️ REVOKE CERTIFICATE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Revoke Modal */}
            {showRevokeModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: 'rgba(10,2,20,1)', border: '1px solid var(--danger)', borderRadius: '24px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 0 50px rgba(255,45,85,0.3)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'pulse 2s infinite' }}>⚠️</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'white', marginBottom: '16px' }}>REVOKE CREDENTIAL?</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.5 }}>
                            This action is permanent and will permanently invalidate this certificate on the blockchain. Are you absolutely sure?
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => setShowRevokeModal(false)} style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '12px', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer' }}>
                                CANCEL
                            </button>
                            <button onClick={handleRevoke} disabled={revoking} style={{ flex: 1, padding: '16px', background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '12px', fontFamily: 'var(--font-display)', fontWeight: 'bold', letterSpacing: '1px', cursor: revoking ? 'not-allowed' : 'pointer', opacity: revoking ? 0.7 : 1 }}>
                                {revoking ? 'PROCESSING...' : 'CONFIRM REVOKE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
