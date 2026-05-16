import React, { useState } from 'react';

export default function HashDisplay({ hash, label = 'SHA-256 Hash', truncate = false }) {
    const [copied, setCopied] = useState(false);

    const displayHash = truncate && hash
        ? `${hash.substring(0, 16)}...${hash.substring(hash.length - 8)}`
        : hash;

    const copyToClipboard = async () => {
        if (!hash) return;
        try {
            await navigator.clipboard.writeText(hash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const el = document.createElement('textarea');
            el.value = hash;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!hash) return null;

    return (
        <div>
            {label && (
                <span className="block mb-2 text-xs tracking-wider uppercase" style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-muted)',
                    fontSize: '0.6rem',
                    letterSpacing: '2px',
                }}>
                    {label}
                </span>
            )}
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 group"
                style={{
                    background: 'rgba(255, 42, 133, 0.03)',
                    border: '1px solid rgba(255, 42, 133, 0.1)',
                }}
                onClick={copyToClipboard}
                title="Click to copy"
            >
                <code
                    className="flex-1 break-all text-sm"
                    style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--accent-primary)',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                    }}
                >
                    {displayHash}
                </code>
                <button
                    className="flex-shrink-0 p-1.5 rounded transition-all duration-200"
                    style={{
                        background: copied ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 42, 133, 0.05)',
                        border: `1px solid ${copied ? 'var(--success)' : 'rgba(255, 42, 133, 0.15)'}`,
                        color: copied ? 'var(--success)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard();
                    }}
                >
                    {copied ? '✓' : '⎘'}
                </button>
            </div>
        </div>
    );
}
