import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load page components
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const VideographerDashboard = lazy(() => import('./pages/VideographerDashboard').then(m => ({ default: m.VideographerDashboard })));
const ScopistDashboard = lazy(() => import('./pages/ScopistDashboard').then(m => ({ default: m.ScopistDashboard })));
const History = lazy(() => import('./pages/History').then(m => ({ default: m.History })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ScheduleDeposition = lazy(() => import('./pages/ScheduleDeposition').then(m => ({ default: m.ScheduleDeposition })));

// Lazy load landing pages
const AttorneyLanding = lazy(() => import('./pages/landing/AttorneyLanding').then(m => ({ default: m.AttorneyLanding })));
const CourtReporterLanding = lazy(() => import('./pages/landing/CourtReporterLanding').then(m => ({ default: m.CourtReporterLanding })));
const VideographerLanding = lazy(() => import('./pages/landing/VideographerLanding').then(m => ({ default: m.VideographerLanding })));
const ScopistLanding = lazy(() => import('./pages/landing/ScopistLanding').then(m => ({ default: m.ScopistLanding })));

// Loading component
const PageLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navigation />
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;