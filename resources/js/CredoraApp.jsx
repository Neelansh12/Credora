import '../css/app.css';
import React, { useState, useEffect } from 'react';
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

const AdminRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin' && user.role !== 'issuer') return <Navigate to="/verify" replace />;
    return children;
};

const ProtectedRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    const [user, setUser] = useState(undefined); // undefined = not checked yet
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        fetch('/api/me', {
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        })
            .then(r => r.json())
            .then(data => setUser(data.authenticated ? data : null))
            .catch(() => setUser(null))
            .finally(() => setAuthLoading(false));
    }, []);

    if (authLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#000' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #ff2a85', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <ParticleBackground />
            <Navbar user={user} setUser={setUser} />
            <div style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', zIndex: 2 }}>
                <Routes>
                    {/* Public */}
                    <Route path="/login"    element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register setUser={setUser} />} />
                    <Route path="/verify"   element={<Verify />} />
                    <Route path="/guide"    element={<Guide />} />

                    {/* Admin / Issuer only */}
                    <Route path="/upload" element={
                        <AdminRoute user={user}>
                            <Upload />
                        </AdminRoute>
                    } />

                    {/* Any logged-in user */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} />
                        </ProtectedRoute>
                    } />
                    <Route path="/certificate/:id" element={
                        <ProtectedRoute user={user}>
                            <CertificateDetail user={user} />
                        </ProtectedRoute>
                    } />

                    <Route path="/"   element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
                    <Route path="*"   element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);