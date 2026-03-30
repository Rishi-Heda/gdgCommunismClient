import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlayCircle, 
  PlusSquare, 
  Users, 
  Wallet, 
  Settings,
  Hexagon,
  Search,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';

const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: PlayCircle },
    { name: 'Submit', path: '/submit', icon: PlusSquare },
    { name: 'Network', path: '/contributors', icon: Users },
    { name: 'Credits', path: '/credits', icon: Wallet },
  ];

  return (
    <>
      <header 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl
          ${isScrolled ? 'top-4' : 'top-6'}
        `}
      >
        <div className={`
          relative flex items-center justify-between px-6 py-2.5 
          bg-surface-card/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-full
          transition-all duration-500
          ${isScrolled ? 'py-2 px-5 bg-surface-card/90 border-[#FAFF00]/10 shadow-[#FAFF00]/5' : ''}
        `}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Hexagon className="w-7 h-7 text-accent-primary group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-lg font-mono font-black tracking-tighter hidden sm:inline text-text-primary">HID<span className="text-accent-primary">MIND</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  relative flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-all
                  ${isActive 
                    ? 'text-accent-primary' 
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-primary rounded-full shadow-[0_0_10px_#FAFF00]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-text-muted hover:text-accent-primary transition-colors hidden sm:block">
              <Search className="w-4 h-4" />
            </button>
            <button className="relative p-2 text-text-muted hover:text-accent-primary transition-colors">
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-primary rounded-full ring-2 ring-surface-card" />
            </button>
            
            <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />
            
            <Link to="/settings" className="flex items-center gap-3 pl-1 sm:pl-2">
              <div className="text-right hidden lg:block">
                <div className="text-[10px] font-bold text-text-primary leading-none mb-0.5">ADMIN_01</div>
                <div className="text-[9px] font-mono text-accent-primary">2,850.5 HC</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-elevated border border-white/5 flex items-center justify-center hover:border-accent-primary/50 transition-colors">
                <User className="w-4 h-4 text-text-muted" />
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-4 w-full md:hidden 
          bg-surface-card/95 backdrop-blur-2xl border border-white/5 rounded-3xl p-4 shadow-2xl
          transition-all duration-500 origin-top
          ${isMobileMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
        `}>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center p-4 rounded-2xl border transition-all
                  ${isActive 
                    ? 'bg-accent-glow border-accent-primary/30 text-accent-primary' 
                    : 'bg-white/5 border-transparent text-text-secondary'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mb-2" />
                <span className="text-[10px] font-mono uppercase tracking-widest">{item.name}</span>
              </NavLink>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 p-3 text-[10px] font-mono text-text-muted uppercase">
              <Settings className="w-3.5 h-3.5" /> Settings & Configuration
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default FloatingHeader;
