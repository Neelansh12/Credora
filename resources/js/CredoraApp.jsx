import '../css/app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import Upload from './pages/Upload';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import CertificateDetail from './pages/CertificateDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Guide from './pages/Guide';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Guest Route Component (redirects to dashboard if logged in)
const GuestRoute = ({ children }) => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function CredoraApp() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            <div className="perspective-grid" />
            <Navbar />
            <main className="relative z-10" style={{ paddingTop: '100px', paddingBottom: '64px' }}>
                <Routes>
                    <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/verify"} replace />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/certificate/:id" element={<CertificateDetail />} />
                </Routes>
            </main>
        </div>
    );
}

// Mount only once
const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <CredoraApp />
    </BrowserRouter>
);
