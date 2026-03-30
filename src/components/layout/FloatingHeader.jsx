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
  Store,
  User,
  Menu,
  X,
  Zap,
  Info,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWealth } from '../../context/WealthContext';

const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { wealth } = useWealth();
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

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
      <header className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 w-fit animate-fade-in transition-all duration-500 ${isScrolled ? 'top-4 scale-95' : 'top-8'}`}>
        
        {/* Isolated Logo Pill */}
        <Link to="/" className="w-14 h-14 bg-[#000] rounded-full border border-white/5 flex items-center justify-center group shadow-2xl hover:border-accent-primary/30 transition-all duration-500 overflow-hidden relative">
          <div className="absolute inset-0 bg-accent-glow opacity-0 group-hover:opacity-100 transition-opacity" />
          <Hexagon className="header-logo-icon w-6 h-6 text-accent-primary group-hover:rotate-90 transition-transform duration-700 relative z-10" />
        </Link>

        {/* Main Navigation Capsule */}
        <div className={`
          flex items-center gap-1.5 px-2 py-2 
          bg-[#000] border border-white/5 shadow-2xl rounded-full
          transition-all duration-500
        `}>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  header-nav-link group relative flex items-center gap-0 hover:gap-2 px-3.5 py-2.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-[0.15em] transition-all duration-500 ease-in-out overflow-hidden
                  ${isActive 
                    ? 'bg-accent-primary text-black px-5 gap-2' 
                    : 'text-text-secondary hover:bg-background-base hover:text-accent-primary hover:px-5'
                  }
                `}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span className={`
                  max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out
                  group-hover:max-w-[120px]
                  ${location.pathname === item.path ? 'max-w-[120px]' : ''}
                `}>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Vertical Divider */}
          <div className="hidden md:block w-[1px] h-6 bg-white/10 mx-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-3 pr-2">
            {/* Dual Balance Display */}
            <div className="hidden lg:flex items-center gap-2 mr-1">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#FAFF00]">
                  <span>{wealth.mindCredits.toLocaleString()}</span>
                  <span className="opacity-50">MC</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#888]">
                  <span>{wealth.hiveCoins.toLocaleString()}</span>
                  <span className="opacity-50 text-[8px]">HC</span>
                </div>
              </div>
            </div>


            <Link to="/marketplace" className="header-nav-link relative p-2.5 rounded-full hover:bg-background-base hover:text-accent-primary transition-all duration-300 group">
              <Store className="w-4 h-4" />
            </Link>

            <Link to="/cart" className="header-nav-link relative p-2.5 rounded-full hover:bg-background-base hover:text-accent-primary transition-all duration-300 group">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-accent-primary text-black text-[9px] font-black rounded-full flex items-center justify-center animate-bounce ring-2 ring-black">
                  {cartCount}
                </div>
              )}
            </Link>
            
            <Link to="/settings" className="header-nav-link w-10 h-10 rounded-full bg-surface-elevated border border-white/5 flex items-center justify-center hover:border-accent-primary transition-all overflow-hidden shrink-0">
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2.5 rounded-full text-text-primary hover:bg-background-base transition-all"
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
            {[...navItems, { name: 'Cart', path: '/cart', icon: ShoppingBag }].map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  header-nav-link flex flex-col items-center justify-center p-4 rounded-2xl border transition-all
                  ${isActive 
                    ? 'bg-accent-glow border-accent-primary/30 text-accent-primary' 
                    : 'bg-white/5 border-transparent text-text-secondary'
                  }
                `}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5 mb-2" />
                  {item.name === 'Cart' && cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-primary text-black text-[9px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                    </div>
                  )}
                </div>
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
