import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FloatingHeader from './FloatingHeader';
import { useLocation, Link } from 'react-router-dom';
import { Plus, Globe, CreditCard } from 'lucide-react';

const AppLayout = () => {
  const location = useLocation();
  const isInverted = location.pathname === '/marketplace';

  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div
      className="min-h-screen bg-background-base text-text-primary overflow-x-hidden animate-fade-in selection:bg-accent-primary selection:text-background-base font-sans transition-colors duration-700"
      data-theme={isInverted ? 'inverted' : 'default'}
    >
      <div className="relative min-h-screen bg-background-base text-text-primary overflow-x-hidden selection:bg-accent-primary selection:text-background-base font-sans">
        {/* BACKGROUND NOISE & HEADER */}
        <div className="noise" />
        <FloatingHeader />

        {/* CONTENT AREA WITH FADE-IN */}
        <div className="min-h-screen flex flex-col animate-fade-in">
          <main className="flex-1 pt-48 pb-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        {/* GLOBAL SIDE NAVIGATION (DASHBOARD ONLY) - Outside animated container for true fixed positioning */}
        {isDashboard && (
          <nav className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] group/nav">
            <div className="flex flex-col gap-3 p-2 bg-black/60 backdrop-blur-xl border-y border-l border-[#222] rounded-l-2xl group-hover/nav:border-accent-primary/50 group-hover/nav:bg-black/90 transition-all duration-500 shadow-2xl w-[72px] group-hover/nav:w-[260px] overflow-hidden">
              <Link
                to="/submit"
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-accent-primary transition-all duration-200 group/item whitespace-nowrap overflow-hidden"
              >
                <div className="min-w-[24px] flex justify-center">
                  <Plus className="w-5 h-5 text-text-secondary group-hover/item:text-black transition-colors" />
                </div>
                <span className="text-[11px] font-mono font-bold text-text-primary opacity-0 group-hover/nav:opacity-100 group-hover/item:text-black transition-all duration-300 transform translate-x-2 group-hover/nav:translate-x-0">
                  SUBMIT A NEW JOB
                </span>
              </Link>

              <Link
                to="/network"
                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-accent-primary transition-all duration-200 group/item whitespace-nowrap overflow-hidden"
              >
                <div className="min-w-[24px] flex justify-center">
                  <Globe className="w-5 h-5 text-text-secondary group-hover/item:text-black transition-colors" />
                </div>
                <span className="text-[11px] font-mono font-bold text-text-primary opacity-0 group-hover/nav:opacity-100 group-hover/item:text-black transition-all duration-300 transform translate-x-2 group-hover/nav:translate-x-0">
                  BROWSE NETWORK
                </span>
              </Link>

              <Link
                to="/credits"
                className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-accent-primary transition-all duration-200 group/item whitespace-nowrap overflow-hidden"
              >
                <div className="min-w-[24px] flex justify-center">
                  <CreditCard className="w-5 h-5 text-text-secondary group-hover/item:text-black transition-colors" />
                </div>
                <span className="text-[11px] font-mono font-bold text-text-primary opacity-0 group-hover/nav:opacity-100 group-hover/item:text-black transition-all duration-300 transform translate-x-2 group-hover/nav:translate-x-0">
                  VIEW CREDIT HISTORY
                </span>
              </Link>
            </div>
          </nav>
        )}
      </div>
      );
};

      export default AppLayout;
