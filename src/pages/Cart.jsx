import React from 'react';
import { useCart } from '../context/CartContext';
import { mockWealth } from '../data/mock';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Minus, 
  Plus, 
  Wallet,
  Coins,
  TrendingDown,
  ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const totalCost = getCartTotal();
  const newBalance = mockWealth.hiveCoins - totalCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="w-24 h-24 bg-surface-card border border-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Hive is Empty</h2>
        <p className="text-text-secondary mb-8 font-mono text-xs uppercase tracking-widest">No assets selected for acquisition</p>
        <Link 
          to="/marketplace" 
          className="bg-accent-primary text-black px-8 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-all"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => navigate('/marketplace')}
          className="p-2 rounded-full bg-surface-card border border-white/5 hover:border-accent-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acquisition Queue</h1>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mt-1">Review your selected assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-surface-card border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-white/10 transition-all"
            >
              <div className="w-24 h-24 rounded-2xl bg-black border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <item.icon className="w-8 h-8 text-accent-primary" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-1">{item.company}</div>
                <h3 className="text-lg font-bold group-hover:text-accent-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-1">{item.desc}</p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3">
                <div className="font-mono font-bold text-accent-primary">{item.cost}</div>
                <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-xl px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:text-accent-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:text-accent-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-text-muted hover:text-status-red hover:bg-status-red/10 rounded-full transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Wealth & Balance Impact Section */}
        <div className="space-y-6">
          <div className="bg-surface-card border border-accent-primary/20 rounded-[40px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-3xl -mr-16 -mt-16" />
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-accent-primary" /> Balance Impact
            </h2>

            <div className="space-y-6 relative z-10">
              {/* Current Balances */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Hive Coins</div>
                  <div className="text-lg font-bold">{mockWealth.hiveCoins.toLocaleString()}</div>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Mind Credits</div>
                  <div className="text-lg font-bold">{mockWealth.mindCredits.toLocaleString()}</div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary font-mono uppercase text-[10px]">Total Acquisition Cost</span>
                  <span className="font-bold text-status-red">-{totalCost.toLocaleString()} HC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary font-mono uppercase text-[10px]">Projected Balance</span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-accent-primary">{newBalance.toLocaleString()} HC</div>
                    {newBalance < 0 && (
                      <div className="text-[10px] text-status-red font-mono uppercase mt-1">Insufficient Funds</div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                disabled={newBalance < 0}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  newBalance < 0 
                    ? 'bg-text-muted text-black cursor-not-allowed' 
                    : 'bg-accent-primary text-black hover:shadow-[0_0_30px_rgba(250,255,0,0.2)]'
                }`}
              >
                Initialize Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-accent-primary/5 border border-dashed border-accent-primary/20 rounded-3xl p-6">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent-primary mb-3 flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" /> Energy Efficiency Note
            </h4>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Acquiring high-priority compute assets may temporarily increase your node's thermal output. Ensure adequate cooling is maintained during initialization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
