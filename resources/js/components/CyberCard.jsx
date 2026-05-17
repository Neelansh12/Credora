import React from 'react';

export default function CyberCard({ children, className = '', glowColor = 'var(--accent-primary)' }) {
    return (
        <div
            className={`glass-card relative overflow-hidden ${className}`}
        >
            {/* Top border glow line */}
            <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                    background: `linear-gradient(90deg, transparent, ${glowColor}40, transparent)`,
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
