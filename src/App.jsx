import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SubmitJob from './pages/SubmitJob';
import JobsList from './pages/JobsList';
import JobDetails from './pages/JobDetails';
import Contributors from './pages/Contributors';
import Credits from './pages/Credits';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
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
            <Route path="/credits" element={<Credits />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/settings" element={<div className="p-8 text-center text-text-muted">Settings page coming soon.</div>} />
          </Route>
  
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
