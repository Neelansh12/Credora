import React from 'react';

export default function GlitchText({ children, className = '', as: Tag = 'h1' }) {
    return (
        <Tag
            className={`relative inline-block ${className}`}
            style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--accent-primary)',
                textShadow: '0 0 10px rgba(255, 42, 133, 0.5), 0 0 40px rgba(255, 42, 133, 0.2)',
            }}
        >
            {children}

            {/* Glitch Layer 1 */}
            <span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: '#ff2d55',
                    animation: 'glitch 3s infinite linear',
                    opacity: 0.6,
                }}
                aria-hidden="true"
            >
                {children}
            </span>

            {/* Glitch Layer 2 */}
            <span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: '#00b4fc',
                    animation: 'glitch-2 3s infinite linear',
                    animationDelay: '0.1s',
                    opacity: 0.6,
                }}
                aria-hidden="true"
            >
                {children}
            </span>
        </Tag>
    );
}
