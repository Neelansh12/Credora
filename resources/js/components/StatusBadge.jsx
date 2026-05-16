import React from 'react';

const statusConfig = {
    valid: {
        label: 'VALID',
        color: 'var(--success)',
        bgColor: 'rgba(0, 255, 136, 0.1)',
        borderColor: 'rgba(0, 255, 136, 0.3)',
        animation: 'neonPulseGreen 3s ease-in-out infinite',
        icon: '✓',
    },
    pending: {
        label: 'PENDING',
        color: 'var(--warning)',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        animation: 'neonPulseAmber 3s ease-in-out infinite',
        icon: '⏳',
    },
    revoked: {
        label: 'REVOKED',
        color: 'var(--danger)',
        bgColor: 'rgba(255, 45, 85, 0.1)',
        borderColor: 'rgba(255, 45, 85, 0.3)',
        animation: 'neonPulseRed 2s ease-in-out infinite',
        icon: '✕',
    },
    suspicious: {
        label: 'SUSPICIOUS',
        color: '#ff8c00',
        bgColor: 'rgba(255, 140, 0, 0.1)',
        borderColor: 'rgba(255, 140, 0, 0.3)',
        animation: 'neonPulseAmber 2s ease-in-out infinite',
        icon: '⚠',
    },
    anchored: {
        label: 'ANCHORED',
        color: 'var(--accent-primary)',
        bgColor: 'rgba(255, 42, 133, 0.1)',
        borderColor: 'rgba(255, 42, 133, 0.3)',
        animation: 'neonPulse 3s ease-in-out infinite',
        icon: '⛓',
    },
    not_found: {
        label: 'NOT FOUND',
        color: 'var(--danger)',
        bgColor: 'rgba(255, 45, 85, 0.1)',
        borderColor: 'rgba(255, 45, 85, 0.3)',
        animation: 'neonPulseRed 2s ease-in-out infinite',
        icon: '✕',
    },
};

export default function StatusBadge({ status, size = 'sm' }) {
    const config = statusConfig[status] || statusConfig.pending;
    const sizeClasses = size === 'lg' ? 'px-5 py-2 text-sm' : 'px-3 py-1 text-xs';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wider ${sizeClasses}`}
            style={{
                fontFamily: 'var(--font-display)',
                background: config.bgColor,
                color: config.color,
                border: `1px solid ${config.borderColor}`,
                animation: config.animation,
                fontSize: size === 'lg' ? '0.75rem' : '0.6rem',
                letterSpacing: '1.5px',
            }}
        >
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
}
