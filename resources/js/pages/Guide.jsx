import React from 'react';

export default function Guide() {
    const modules = [
        {
            title: "DASHBOARD (COMMAND CENTER)",
            path: "/dashboard",
            icon: "◫",
            color: "var(--accent-secondary)", // Cyan
            desc: "The central nervous system of Credora. Monitor all issued certificates, track recent blockchain transactions, and view system analytics at a glance."
        },
        {
            title: "ISSUE MODULE (ANCHOR)",
            path: "/upload",
            icon: "⛓",
            color: "var(--accent-purple)", // Purple
            desc: "The workspace for minting new credentials. Upload a PDF, enter recipient details, and permanently anchor a tamper-proof SHA-256 fingerprint onto the Polygon Amoy ledger."
        },
        {
            title: "VERIFY MODULE (DEEP SCAN)",
            path: "/verify",
            icon: "🔍",
            color: "var(--success)", // Green
            desc: "A globally accessible search engine. Anyone can paste a 64-character cryptographic hash to instantly query the blockchain and verify if a credential is authentic or forged."
        },
        {
            title: "AUTHENTICATION (IDENTITY)",
            path: "/login",
            icon: "⎋",
            color: "var(--accent-primary)", // Pink
            desc: "Secure operator terminals for gaining access to the issuing capabilities of the platform. Utilizes Laravel Sanctum for robust session management."
        }
    ];

    return (
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px', fontSize: '2rem' }}>
                    📖
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 'bold', color: 'white', letterSpacing: '4px', margin: 0 }}>
                    OPERATOR <span style={{ color: 'var(--accent-secondary)' }}>MANUAL</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '16px', maxWidth: '600px', margin: '16px auto 0', lineHeight: 1.6 }}>
                    Comprehensive documentation of all available Credora subsystems and their operational protocols.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                {modules.map((mod, idx) => (
                    <div key={idx} style={{ 
                        background: 'rgba(10, 2, 20, 0.6)', 
                        border: `1px solid ${mod.color}33`, 
                        borderRadius: '24px', 
                        padding: '30px', 
                        position: 'relative', 
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                        boxShadow: `0 10px 30px ${mod.color}11`
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: mod.color }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${mod.color}22`, color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: `1px solid ${mod.color}55` }}>
                                {mod.icon}
                            </div>
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '1px', margin: 0, color: 'white' }}>
                                    {mod.title}
                                </h3>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: mod.color, marginTop: '4px', letterSpacing: '2px' }}>
                                    [ ROUTE: {mod.path} ]
                                </p>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                            {mod.desc}
                        </p>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: '60px', textAlign: 'center', padding: '30px', background: 'rgba(255, 42, 133, 0.05)', border: '1px dashed rgba(255, 42, 133, 0.3)', borderRadius: '16px' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-primary)', fontSize: '1.2rem', marginBottom: '10px' }}>SYSTEM ARCHITECTURE</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                    Credora operates on a React frontend powered by Vite, interfaced with a Laravel PHP backend. Cryptographic hashes are permanently stored on the Polygon Amoy Testnet via Smart Contracts to ensure zero-knowledge proof verification without compromising raw document data.
                </p>
            </div>
        </div>
    );
}
