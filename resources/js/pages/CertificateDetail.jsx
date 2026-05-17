import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import GlitchText from '../components/GlitchText';
import CyberCard from '../components/CyberCard';
import HashDisplay from '../components/HashDisplay';
import StatusBadge from '../components/StatusBadge';

export default function CertificateDetail() {
    const { id } = useParams();
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [revoking, setRevoking] = useState(false);
    const isAdmin = true; // For demo; wire to auth later

    useEffect(() => { fetchCertificate(); }, [id]);

    const fetchCertificate = async () => {
        try {
            const res = await fetch(`/api/certificate/${id}`, { headers:{ 'Accept':'application/json' }, credentials:'same-origin' });
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
                method:'POST',
                headers:{ 'Content-Type':'application/json', 'X-CSRF-TOKEN': csrfToken||'', 'Accept':'application/json' },
                body: JSON.stringify({ hash: cert.certificate_hash }),
                credentials:'same-origin',
            });
            if (res.ok) {
                setCert({ ...cert, status:'revoked' });
                setShowRevokeModal(false);
            }
        } catch { /* noop */ }
        finally { setRevoking(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor:'var(--accent-primary)', borderTopColor:'transparent' }} />
                    <p className="text-sm" style={{ fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>Loading certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !cert) {
        return (
            <div className="max-w-2xl mx-auto px-6 text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily:'var(--font-display)', color:'var(--danger)' }}>{error || 'Certificate not found'}</h2>
                <Link to="/dashboard" className="cyber-btn no-underline inline-flex mt-4" style={{ fontSize:'0.7rem' }}>← BACK TO DASHBOARD</Link>
            </div>
        );
    }

    const verifyUrl = `${window.location.origin}/verify?hash=${cert.certificate_hash}`;

    return (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.5 }} className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/dashboard" className="text-sm no-underline" style={{ color:'var(--text-muted)', fontFamily:'var(--font-display)', letterSpacing:'1px', fontSize:'0.7rem' }}>← DASHBOARD</Link>
                <span style={{ color:'var(--text-dim)' }}>/</span>
                <span className="text-sm" style={{ color:'var(--accent-primary)', fontFamily:'var(--font-display)', letterSpacing:'1px', fontSize:'0.7rem' }}>CERTIFICATE #{cert.id}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2">
                    <CyberCard noPerspective>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <GlitchText as="h2" className="text-xl md:text-2xl font-bold mb-2">CERTIFICATE #{cert.id}</GlitchText>
                                <StatusBadge status={cert.status} size="lg" />
                                {cert.blockchain_status && (
                                    <span className="ml-2"><StatusBadge status={cert.blockchain_status} /></span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <span className="block text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily:'var(--font-display)', color:'var(--text-muted)', fontSize:'0.6rem', letterSpacing:'2px' }}>Student Name</span>
                                    <p className="text-lg font-medium">{cert.student_name}</p>
                                </div>
                                <div>
                                    <span className="block text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily:'var(--font-display)', color:'var(--text-muted)', fontSize:'0.6rem', letterSpacing:'2px' }}>Certificate Title</span>
                                    <p className="text-lg font-medium">{cert.certificate_name}</p>
                                </div>
                            </div>

                            {cert.student_email && (
                                <div>
                                    <span className="block text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily:'var(--font-display)', color:'var(--text-muted)', fontSize:'0.6rem', letterSpacing:'2px' }}>Student Email</span>
                                    <p className="text-sm" style={{ fontFamily:'var(--font-mono)' }}>{cert.student_email}</p>
                                </div>
                            )}

                            {cert.issued_at && (
                                <div>
                                    <span className="block text-xs tracking-wider uppercase mb-1.5" style={{ fontFamily:'var(--font-display)', color:'var(--text-muted)', fontSize:'0.6rem', letterSpacing:'2px' }}>Issued At</span>
                                    <p className="text-sm" style={{ fontFamily:'var(--font-mono)' }}>
                                        {new Date(cert.issued_at).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4" style={{ borderTop:'1px solid rgba(255, 42, 133,0.1)' }}>
                                <HashDisplay hash={cert.certificate_hash} label="SHA-256 Fingerprint" />
                            </div>

                            {cert.blockchain_tx && (
                                <div>
                                    <HashDisplay hash={cert.blockchain_tx} label="Blockchain Transaction" truncate />
                                    <a href={`https://amoy.polygonscan.com/tx/${cert.blockchain_tx}`} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg text-xs no-underline transition-all duration-300"
                                        style={{ fontFamily:'var(--font-display)', background:'rgba(255, 42, 133,0.05)', border:'1px solid rgba(255, 42, 133,0.2)', color:'var(--accent-primary)', letterSpacing:'1px' }}>
                                        VIEW ON POLYGONSCAN ↗
                                    </a>
                                </div>
                            )}

                            {cert.contract_address && (
                                <div>
                                    <HashDisplay hash={cert.contract_address} label="Contract Address" truncate />
                                </div>
                            )}
                        </div>
                    </CyberCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* QR Code */}
                    <CyberCard className="text-center" noPerspective>
                        <h4 className="text-xs font-bold mb-4 tracking-wider" style={{ fontFamily:'var(--font-display)', color:'var(--accent-primary)', fontSize:'0.65rem', letterSpacing:'2px' }}>VERIFICATION QR</h4>
                        <div className="inline-block p-4 rounded-lg" style={{ background:'white' }}>
                            <QRCodeSVG value={verifyUrl} size={160} bgColor="#ffffff" fgColor="#020408" level="H" />
                        </div>
                        <p className="text-xs mt-3" style={{ fontFamily:'var(--font-mono)', color:'var(--text-dim)', fontSize:'0.65rem' }}>Scan to verify</p>
                    </CyberCard>

                    {/* Actions */}
                    <CyberCard noPerspective>
                        <h4 className="text-xs font-bold mb-4 tracking-wider" style={{ fontFamily:'var(--font-display)', color:'var(--accent-primary)', fontSize:'0.65rem', letterSpacing:'2px' }}>ACTIONS</h4>
                        <div className="space-y-3">
                            {cert.file_path && (
                                <a href={`/storage/${cert.file_path}`} download className="cyber-btn w-full no-underline text-center" style={{ padding:'10px 16px', fontSize:'0.65rem' }}>
                                    📄 DOWNLOAD PDF
                                </a>
                            )}
                            <Link to={`/verify?hash=${cert.certificate_hash}`} className="cyber-btn w-full no-underline text-center block" style={{ padding:'10px 16px', fontSize:'0.65rem' }}>
                                ◈ VERIFY ON-CHAIN
                            </Link>
                            {isAdmin && cert.status !== 'revoked' && (
                                <button onClick={() => setShowRevokeModal(true)} className="cyber-btn cyber-btn-danger w-full" style={{ padding:'10px 16px', fontSize:'0.65rem' }}>
                                    ✕ REVOKE CERTIFICATE
                                </button>
                            )}
                        </div>
                    </CyberCard>
                </div>
            </div>

            {/* Revoke Modal */}
            {showRevokeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background:'rgba(2,4,8,0.9)' }}>
                    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="w-full max-w-md">
                        <CyberCard glowColor="var(--danger)" noPerspective>
                            <div className="text-center">
                                <div className="text-4xl mb-3">⚠️</div>
                                <h3 className="text-lg font-bold mb-2" style={{ fontFamily:'var(--font-display)', color:'var(--danger)' }}>REVOKE CERTIFICATE</h3>
                                <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>This action is irreversible on the blockchain. Are you sure?</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowRevokeModal(false)} className="cyber-btn flex-1" style={{ padding:'10px', fontSize:'0.65rem' }}>CANCEL</button>
                                    <button onClick={handleRevoke} disabled={revoking} className="cyber-btn cyber-btn-danger flex-1" style={{ padding:'10px', fontSize:'0.65rem' }}>
                                        {revoking ? 'REVOKING...' : 'CONFIRM REVOKE'}
                                    </button>
                                </div>
                            </div>
                        </CyberCard>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
