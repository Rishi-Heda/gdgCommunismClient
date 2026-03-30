import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  CheckCircle2, 
  Terminal, 
  Loader2, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState('processing'); // processing, confirming, complete
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  const total = getCartTotal();

  const checkoutLogs = React.useMemo(() => [
    "Initializing secure transaction channel...",
    "Verifying Hive identity signature...",
    "Querying decentralized ledger for HC balance...",
    "Deducting " + total.toLocaleString() + " HC from node-local-01...",
    "Transferring compute assets to high-priority pool...",
    "Synchronizing neural weights across regional clusters...",
    "Finalizing resource allocation...",
    "Transaction confirmed in block #77a2...",
    "ACQUISITION SUCCESSFUL"
  ], [total]);

  useEffect(() => {
    if (step === 'processing') {
      let currentLog = 0;
      const interval = setInterval(() => {
        if (currentLog < checkoutLogs.length) {
          setLogs(prev => [...prev, checkoutLogs[currentLog]]);
          currentLog++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStep('complete'), 1000);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [step, checkoutLogs]);

  const handleFinish = () => {
    clearCart();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in py-12">
      <div className="max-w-2xl w-full">
        {step === 'processing' && (
          <div className="bg-surface-card border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[80px] -mr-32 -mt-32" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary text-black flex items-center justify-center animate-pulse">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Processing Transaction</h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-1">Acquisition ID: HIVE-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl p-6 font-mono text-xs leading-relaxed h-64 overflow-y-auto custom-scrollbar shadow-inner">
              {logs.map((log, index) => (
                <div key={index} className="mb-2 flex gap-3">
                  <span className="text-accent-primary opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className={index === logs.length - 1 ? "text-accent-primary animate-pulse" : "text-text-secondary"}>
                    {log}
                  </span>
                </div>
              ))}
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>

            <div className="mt-10 flex items-center gap-4 text-text-muted italic text-xs justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />
              SECURE DECENTRALIZED PROTOCOL ACTIVE
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="bg-surface-card border border-status-green/20 rounded-[40px] p-8 md:p-12 text-center animate-scale-in shadow-[0_0_50px_rgba(57,255,106,0.05)]">
            <div className="w-24 h-24 bg-status-green/10 border border-status-green/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-status-green" />
            </div>
            
            <h1 className="text-3xl font-bold mb-3 tracking-tight">Acquisition Confirmed</h1>
            <p className="text-text-secondary mb-10 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Assets have been allocated to your profile.<br />
              Deduction of <span className="text-accent-primary font-bold">{total.toLocaleString()} HC</span> processed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
              <div className="p-5 rounded-3xl bg-black border border-white/5 flex items-center gap-4 group hover:border-accent-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-white/5 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Target Node</div>
                  <div className="text-sm font-bold">node-local-01</div>
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-black border border-white/5 flex items-center gap-4 group hover:border-accent-primary/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-white/5 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Protocol</div>
                  <div className="text-sm font-bold">Proof of Wealth</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleFinish}
                className="flex-1 bg-accent-primary text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
              >
                Return to Command Center
              </button>
              <button 
                onClick={() => navigate('/marketplace')}
                className="flex-1 border-2 border-white/5 hover:border-white/20 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all text-text-secondary flex items-center justify-center gap-2"
              >
                Continue Browsing <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-6">
               <button className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 hover:text-accent-primary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Download Receipt
               </button>
               <button className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 hover:text-accent-primary transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> View Transaction on Chain
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
