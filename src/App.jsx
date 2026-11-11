import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/index.css';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Global Toast Dispatcher
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <Navbar onOpenCreateModal={() => setCreateModalOpen(true)} />

            {/* Main Application Routes */}
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <DashboardPage 
                      onShowToast={showToast}
                      createModalOpen={createModalOpen}
                      onCloseCreateModal={() => setCreateModalOpen(false)}
                    />
                  } 
                />
                <Route path="/login" element={<LoginPage onShowToast={showToast} />} />
                <Route path="/register" element={<RegisterPage onShowToast={showToast} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer onShowToast={showToast} />

            {/* Global Animated Toasts */}
            <Toast toasts={toasts} onDismiss={dismissToast} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
