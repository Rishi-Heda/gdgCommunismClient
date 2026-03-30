import React from 'react';
import { Search, Bell, User, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useWealth } from '../../context/WealthContext';

const Topbar = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const { wealth } = useWealth();

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-background-base/80 backdrop-blur-md border-b border-[#222] z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="text-text-muted font-mono text-sm hidden sm:inline">HiveMind</span>
        {pathnames.length > 0 && <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />}
        <span className="text-text-primary font-medium truncate capitalize">
          {pathnames[pathnames.length - 1] || 'Dashboard'}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search nodes, jobs..." 
            className="bg-surface-card border border-[#222] rounded-lg pl-10 pr-4 py-1.5 text-xs focus:border-accent-primary outline-none transition-colors w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:text-accent-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-status-yellow rounded-full ring-2 ring-background-base" />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-[#222]">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-text-primary">Research_Admin</div>
              <div className="text-[10px] font-mono text-text-muted">Balance: {wealth.hiveCoins.toLocaleString(undefined, { maximumFractionDigits: 2 })} HC</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-elevated border border-[#222] flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-text-muted" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
