import React, { useState, useRef, useCallback } from 'react';
import GlitchText from '../components/GlitchText';
import HashDisplay from '../components/HashDisplay';

export default function Upload() {
    const [formData, setFormData] = useState({
        student_name: '',
        student_email: '',
        certificate_name: '',
    });
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleDrag = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') { setFile(droppedFile); setError(null); }
            else { setError('Only PDF files are accepted.'); }
        }
    }, []);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); setError(null); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { setError('Please provide a certificate file.'); return; }

        setLoading(true); setError(null); setResult(null);
        const data = new FormData();
        data.append('student_name', formData.student_name);
        data.append('student_email', formData.student_email);
        data.append('certificate_name', formData.certificate_name);
        data.append('certificate_file', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch('/upload', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken || '', 'Accept': 'application/json' },
                body: data, credentials: 'same-origin',
            });
            const json = await response.json();
            if (response.ok && json.success) {
                setResult(json);
                setFormData({ student_name: '', student_email: '', certificate_name: '' });
                setFile(null);
            } else { setError(json.message || json.error || 'Failed to issue certificate.'); }
        } catch (err) { setError('Network error. Cannot reach the API.'); } 
        finally { setLoading(false); }
    };

    if (result) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 30px', boxShadow: '0 0 40px rgba(0,255,136,0.4)' }}>
                    ✓
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '16px' }}>ISSUANCE COMPLETE</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
                    The certificate has been permanently recorded on the blockchain.
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', textAlign: 'left' }}>
                    <HashDisplay hash={result.certificate_hash} label="Document Hash" />
                    <div style={{ marginTop: '24px' }}>
                        <HashDisplay hash={result.tx_hash} label="Transaction Hash" truncate />
                    </div>
                    
                    <div style={{ marginTop: '30px', display: 'flex', gap: '16px' }}>
                        <a href={`https://amoy.polygonscan.com/tx/${result.tx_hash}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '16px', textAlign: 'center', background: 'white', color: 'black', fontWeight: 'bold', borderRadius: '12px', textDecoration: 'none' }}>
                            VIEW TRANSACTION
                        </a>
                        <button onClick={() => setResult(null)} style={{ flex: 1, padding: '16px', textAlign: 'center', background: 'transparent', border: '1px solid white', color: 'white', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer' }}>
                            ISSUE ANOTHER
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '40px 16px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', margin: 0 }}>
                    WORKSPACE / <span style={{ color: 'var(--accent-purple)' }}>ISSUE</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '8px' }}>
                    Generate an immutable blockchain record for a new credential.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
                
                {/* Left Side - Drag & Drop */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0 }}>Document Upload</h3>
                        <span style={{ background: 'rgba(188, 19, 254, 0.1)', color: 'var(--accent-purple)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>PDF ONLY</span>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            minHeight: '300px',
                            background: dragActive ? 'rgba(188, 19, 254, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                            border: `2px dashed ${dragActive ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} />

                        {file ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'var(--accent-purple)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px', color: 'white' }}>
                                    📄
                                </div>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>{file.name}</p>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                                    +
                                </div>
                                <h4 style={{ fontSize: '1.2rem', margin: '0 0 8px 0' }}>Drag & Drop File</h4>
                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Or click to browse your computer</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', margin: 0 }}>Recipient Details</h3>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {error && (
                            <div style={{ background: 'rgba(255, 45, 85, 0.1)', color: 'var(--danger)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 45, 85, 0.2)' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Recipient Full Name *</label>
                            <input
                                type="text"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                placeholder="E.g. Sarah Connor"
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Recipient Email</label>
                            <input
                                type="email"
                                name="student_email"
                                value={formData.student_email}
                                onChange={handleChange}
                                placeholder="sarah@example.com"
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Credential Title *</label>
                            <input
                                type="text"
                                name="certificate_name"
                                value={formData.certificate_name}
                                onChange={handleChange}
                                placeholder="E.g. Advanced AI Certification"
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
                                required
                            />
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ 
                                    width: '100%', 
                                    background: 'var(--accent-purple)', 
                                    color: 'white', 
                                    padding: '20px', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'all 0.3s'
                                }}
                            >
                                {loading ? 'PROCESSING...' : 'MINT CREDENTIAL'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
