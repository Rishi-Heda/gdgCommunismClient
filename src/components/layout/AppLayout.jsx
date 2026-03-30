import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FloatingHeader from './FloatingHeader';

const AppLayout = () => {
  const location = useLocation();
  const isInverted = location.pathname === '/marketplace';

  return (
    <div 
      className="min-h-screen bg-background-base text-text-primary overflow-x-hidden animate-fade-in selection:bg-accent-primary selection:text-background-base font-sans transition-colors duration-700"
      data-theme={isInverted ? 'inverted' : 'default'}
    >
      <div className="noise" />
      <FloatingHeader />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-48 pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
