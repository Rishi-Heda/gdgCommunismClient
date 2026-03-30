import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlayCircle, 
  PlusSquare, 
  Users, 
  Wallet, 
  Settings,
  Hexagon
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: PlayCircle },
    { name: 'Submit Job', path: '/submit', icon: PlusSquare },
    { name: 'Contributors', path: '/contributors', icon: Users },
    { name: 'My Credits', path: '/credits', icon: Wallet },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background-base border-r border-[#222] z-40 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <Hexagon className="w-8 h-8 text-accent-primary" />
        <span className="text-xl font-mono font-bold tracking-tight">HiveMind</span>
      </div>
      
      <nav className="flex-1 mt-4 px-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555] px-4 mb-4">
          Navigation
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all group
                  ${isActive 
                    ? 'text-accent-primary border-l-2 border-accent-primary bg-accent-glow' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-[#111]'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-[#222]">
        <div className="bg-surface-card rounded-xl p-4 border border-[#222]">
          <div className="text-[10px] font-mono uppercase text-[#555] mb-1">Status</div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
            <span className="text-xs font-mono">Network Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
