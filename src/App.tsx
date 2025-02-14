import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { VideographerDashboard } from './pages/VideographerDashboard';
import { ScopistDashboard } from './pages/ScopistDashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Determine dashboard type based on user role (simplified example)
  const userRole = user?.user_metadata?.role || 'default';
  const DashboardComponent = 
    userRole === 'videographer' ? VideographerDashboard :
    userRole === 'scopist' ? ScopistDashboard :
    Dashboard;

  return (
    <div className="min-h-screen bg-gray-900">
      {user && <Navigation />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <Routes>
          <Route path="/" element={
            user ? <DashboardComponent /> : <Navigate to="/login" replace />
          } />
          <Route path="/home" element={
            user ? <Home /> : <Navigate to="/login" replace />
          } />
          <Route path="/history" element={
            user ? <History /> : <Navigate to="/login" replace />
          } />
          <Route path="/settings" element={
            user ? <Settings /> : <Navigate to="/login" replace />
          } />
          <Route path="/login" element={
            !user ? <Login /> : <Navigate to="/" replace />
          } />
          <Route path="/register" element={
            !user ? <Register /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;