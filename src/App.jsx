import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SubmitJob from './pages/SubmitJob';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import Contributors from './pages/Contributors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App Shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit" element={<SubmitJob />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/contributors" element={<Contributors />} />
          <Route path="/credits" element={<div className="p-8 text-center text-text-muted">Credits page coming soon.</div>} />
          <Route path="/settings" element={<div className="p-8 text-center text-text-muted">Settings page coming soon.</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
