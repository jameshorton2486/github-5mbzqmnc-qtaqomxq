import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { VideographerDashboard } from './pages/VideographerDashboard';
import { ScopistDashboard } from './pages/ScopistDashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ScheduleDeposition } from './pages/ScheduleDeposition';
import { AttorneyLanding } from './pages/landing/AttorneyLanding';
import { CourtReporterLanding } from './pages/landing/CourtReporterLanding';
import { VideographerLanding } from './pages/landing/VideographerLanding';
import { ScopistLanding } from './pages/landing/ScopistLanding';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navigation />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videographer" element={<VideographerDashboard />} />
            <Route path="/scopist" element={<ScopistDashboard />} />
            <Route path="/schedule" element={<ScheduleDeposition />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/for-attorneys" element={<AttorneyLanding />} />
            <Route path="/for-court-reporters" element={<CourtReporterLanding />} />
            <Route path="/for-videographers" element={<VideographerLanding />} />
            <Route path="/for-scopists" element={<ScopistLanding />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;