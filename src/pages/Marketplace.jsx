import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Gift,
  Coins,
  Plus,
  Minus
} from 'lucide-react';
import ScrollingTape from '../components/marketplace/ScrollingTape';
import { mockWealth } from '../data/mock';
import { useCart } from '../context/CartContext';

const Marketplace = () => {
  const [activeCategory, setActiveCategory] = useState('All Assets');
  const [exchangeAmount, setExchangeAmount] = useState(1000);
  const [balances, setBalances] = useState({
    hiveCoins: mockWealth.hiveCoins,
    mindCredits: mockWealth.mindCredits,
  });
  const [exchangeNotice, setExchangeNotice] = useState(null);
  const { cartItems, addToCart, updateQuantity } = useCart();

  const exchangeRate = mockWealth.exchangeRate;
  const normalizedExchangeAmount = Number.isFinite(exchangeAmount) ? exchangeAmount : 0;
  const mcReceive = normalizedExchangeAmount > 0 ? normalizedExchangeAmount / exchangeRate : 0;

  const handleExchange = () => {
    const amount = Number(exchangeAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setExchangeNotice({
        type: 'error',
        text: 'ENTER A VALID HIVE COIN AMOUNT TO EXCHANGE.',
      });
      return;
    }

    if (amount > balances.hiveCoins) {
      setExchangeNotice({
        type: 'error',
        text: 'INSUFFICIENT HIVE COINS FOR THIS EXCHANGE.',
      });
      return;
    }

    const received = amount / exchangeRate;

    setBalances((prev) => ({
      hiveCoins: Number((prev.hiveCoins - amount).toFixed(2)),
      mindCredits: Number((prev.mindCredits + received).toFixed(2)),
    }));

    setExchangeNotice({
      type: 'success',
      text: `EXCHANGE COMPLETE: ${amount.toLocaleString()} HC → ${received.toLocaleString(undefined, { maximumFractionDigits: 2 })} MC`,
    });
  };

  const allItems = [
    {
      id: 'p1',
      category: 'Compute',
      company: 'NVIDIA',
      title: 'H100 Priority Access',
      desc: 'Get 24h guaranteed priority on H100 clusters.',
      cost: '25,000 HC',
      icon: Cpu,
      color: 'bg-black'
    },
    {
      id: 'p2',
      category: 'Datasets',
      company: 'DataForge',
      title: 'Medical Corpus v2',
      desc: 'Exclusive access to verified healthcare datasets.',
      cost: '15,000 HC',
      icon: Database,
      color: 'bg-black'
    },
    {
      id: 'p3',
      category: 'Partner Rewards',
      company: 'CoreSecure',
      title: 'Advanced Encryption',
      desc: 'Hardware-level encryption for your compute jobs.',
      cost: '8,000 HC',
      icon: ShieldCheck,
      color: 'bg-black'
    },
    {
      id: 'm1',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Neon Signature Cap',
      desc: 'Exclusive HiveMind embroidered dark cap.',
      cost: '1,500 HC',
      image: '/merch/cap.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm2',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Matrix T-Shirt',
      desc: 'Premium cotton tee with our signature pattern.',
      cost: '2,500 HC',
      image: '/merch/tshirt.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm3',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Root Access Hoodie',
      desc: 'Heavyweight hoodie for late-night coding sessions.',
      cost: '4,000 HC',
      image: '/merch/hoodie.jpeg',
      color: 'bg-surface-card'
    },
    {
      id: 'm4',
      category: 'Merch',
      company: 'HiveMind',
      title: 'Quantum Coffee Cup',
      desc: 'Ceramic mug to keep your focus sharp.',
      cost: '800 HC',
      image: '/merch/coffee cup.jpeg',
      color: 'bg-surface-card'
    }
  ];

  const categories = ['All Assets', 'Compute', 'Datasets', 'Neural Weights', 'Partner Rewards', 'Merch'];

  const filteredItems = activeCategory === 'All Assets' 
    ? allItems 
    : allItems.filter(item => item.category === activeCategory);


  return (
    <div className="animate-fade-in pb-20">
      {/* Header Section with Scrolling Tape */}
      <div className="relative -mt-12 mb-24">
        <ScrollingTape text="THE HIVE MARKET" speed={40} tilt={-2} />

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-8 mt-16 text-center">
          <p className="text-text-secondary font-black max-w-none text-lg uppercase tracking-wider leading-relaxed whitespace-nowrap">
            Exchange your earned Hive Coins for Mind Credits or exclusive partner assets and hardware access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Exchange Center */}
        <div className="lg:col-span-2 p-10 rounded-[40px] bg-black inverted-dark-container shadow-2xl relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 blur-[80px] -mr-32 -mt-32" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 text-[#FAFF00]">
              <ArrowRightLeft className="w-6 h-6" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Currency Exchange</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-4 text-[#FAFF00]/70">You Give (Hive Coins)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={exchangeAmount}
                      onChange={(e) => {
                        const nextAmount = Number(e.target.value);
                        setExchangeAmount(Number.isFinite(nextAmount) ? nextAmount : 0);
                        if (exchangeNotice) {
                          setExchangeNotice(null);
                        }
                      }}
                      className="w-full bg-[#FAFF00]/10 border-2 border-[#FAFF00]/20 rounded-3xl px-8 py-6 text-4xl font-black focus:outline-none focus:border-[#FAFF00] transition-all text-[#FAFF00] placeholder:text-[#FAFF00]/30"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end">
                      <span className="text-xs font-mono font-bold text-[#FAFF00]">HC</span>
                      <span className="text-[10px] text-white/50 underline cursor-pointer hover:text-white transition-colors" onClick={() => {
                        setExchangeAmount(balances.hiveCoins);
                        if (exchangeNotice) {
                          setExchangeNotice(null);
                        }
                      }}>MAX</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent-primary text-black flex items-center justify-center rotate-90 md:rotate-0">
                    <ArrowRightLeft className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] mb-4 text-[#FAFF00]/70">You Receive (Mind Credits)</label>
                  <div className="bg-accent-primary/5 border-2 border-dashed border-accent-primary/20 rounded-3xl px-8 py-6 flex justify-between items-center">
                    <span className="text-4xl font-black text-white">{mcReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">MC</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent-primary/5 rounded-[32px] p-8 border border-accent-primary/10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                    <Zap className="w-4 h-4 text-accent-primary" /> Exchange Info
                  </h3>
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-accent-primary/10 pb-2">
                      <span className="text-white/60 font-mono">RATE</span>
                      <span className="text-white font-bold">{exchangeRate} HC : 1 MC</span>
                    </div>
                    <div className="flex justify-between border-b border-accent-primary/10 pb-2">
                      <span className="text-white/60 font-mono">FEE</span>
                      <span className="text-status-green font-bold">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 font-mono">PROCESSING</span>
                      <span className="text-white font-bold">INSTANT</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleExchange}
                  className="w-full bg-black text-[#FAFF00] border-2 border-[#FAFF00] py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#FAFF00] hover:text-black active:scale-95 transition-all mt-8"
                >
                  Confirm Exchange
                </button>

                {exchangeNotice && (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-[0.08em] whitespace-nowrap text-center flex items-center justify-center ${
                      exchangeNotice.type === 'success'
                        ? 'border-status-green/30 bg-status-green/10 text-status-green'
                        : 'border-status-red/30 bg-status-red/10 text-status-red'
                    }`}
                  >
                    {exchangeNotice.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wealth Summary Pill */}
        <div className="p-8 rounded-[40px] bg-surface-card border border-black/10 flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Coins className="w-5 h-5" /> Your Wealth
            </h2>
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-black inverted-dark-container border border-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#FAFF00]/70 mb-1">Hive Coins (HC)</div>
                <div className="text-3xl font-black tracking-tighter text-white">{balances.hiveCoins.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-black/10">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-1">Mind Credits (MC)</div>
                <div className="text-3xl font-black tracking-tighter">{balances.mindCredits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-black/5 rounded-3xl p-6 border border-dashed border-black/20 flex flex-col items-center justify-center text-center">
            <Gift className="w-8 h-8 mb-3 text-black/30" />
            <p className="text-xs font-mono uppercase tracking-widest text-black/40">New Partner Rewards Coming Soon</p>
          </div>
        </div>

      </div>

      {/* Partner Section */}
      <div className="mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 px-4">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            {activeCategory === 'All Assets' ? 'Asset Catalog' : activeCategory}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 p-1 bg-surface-card border border-black/10 rounded-2xl hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-[#FAFF00]' : 'hover:bg-black/5 text-text-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeCategory === 'Neural Weights' && filteredItems.length === 0 ? (
            <div className="md:col-span-3 bg-surface-card border-2 border-dashed border-black/20 rounded-[40px] p-10 text-center">
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">Neural Weights Coming Soon</h3>
              <p className="text-text-secondary text-sm max-w-2xl mx-auto">
                Placeholder slot reserved for upcoming model weight drops and licensed checkpoint bundles.
              </p>
            </div>
          ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white border-2 border-black/5 rounded-[40px] p-8 hover:border-black transition-all cursor-pointer group h-full flex flex-col">
              {item.image && (
                <div className="w-full h-48 rounded-[24px] overflow-hidden bg-black/5 flex items-center justify-center mb-6">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className={`flex items-start ${!item.image ? 'justify-between' : 'justify-end'} mb-6`}>
                {!item.image && (
                  <div className={`p-4 rounded-3xl bg-black text-white`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                )}
                <div className="text-[10px] whitespace-nowrap font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black/10">
                  {item.company}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:italic transition-all">{item.title}</h3>
              <p className="text-text-secondary text-sm mb-8 flex-1">{item.desc}</p>

              <div className="flex items-center justify-between pt-6 border-t border-black/5">
                <div className="font-mono text-sm font-black italic">{item.cost}</div>
                
                <div className="relative h-10 flex items-center justify-end">
                  {(() => {
                    const quantity = cartItems.find(ci => ci.id === item.id)?.quantity || 0;
                    return (
                      <div className="group/qty relative flex items-center bg-black rounded-full h-10 border border-[#FAFF00]/20 transition-all duration-500 overflow-hidden w-10 hover:w-32 cursor-default shadow-lg">
                        {/* Primary Button - Centered in circle state */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="absolute left-0 w-10 h-10 flex items-center justify-center text-[#FAFF00] hover:scale-110 transition-all z-10"
                        >
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Plus className={`w-5 h-5 transition-all duration-300 ${quantity > 0 ? 'opacity-0 group-hover/qty:opacity-100' : 'opacity-100'}`} />
                            {quantity > 0 && (
                              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-black group-hover/qty:opacity-0 transition-all duration-300">
                                {quantity}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Secondary Controls - Symmetrical Gaps */}
                        <div className="flex items-center justify-between w-full pl-10 pr-3 opacity-0 group-hover/qty:opacity-100 transition-all duration-500 pointer-events-none group-hover/qty:pointer-events-auto">
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-[#FAFF00] font-mono text-xs font-black">
                              {quantity}
                            </span>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (quantity > 0) {
                                updateQuantity(item.id, quantity - 1);
                              }
                            }}
                            className="text-[#FAFF00] hover:scale-125 shrink-0 w-8 h-10 flex items-center justify-center transition-transform"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))) }
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
