import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cpu, 
  Layers, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Download,
  XCircle,
  Terminal,
  Activity,
  History,
  Info,
  MoreVertical
} from 'lucide-react';
import { mockJobs } from '../data/mock';
import ScrambleText from '../components/common/ScrambleText';

const JobDetails = () => {
  const { id } = useParams();
  const job = mockJobs.find(j => j.id === id) || mockJobs[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING': return 'text-status-green border-status-green bg-status-green/5';
      case 'PENDING': return 'text-status-yellow border-status-yellow bg-status-yellow/5';
      case 'FAILED': return 'text-status-red border-status-red bg-status-red/5';
      default: return 'text-text-muted border-[#222] bg-[#111]';
    }
  };

  const logLines = [
    { time: '14:30:02', text: 'Initializing compute kernel...', type: 'info' },
    { time: '14:30:05', text: 'Resource allocation successful: node-77a2', type: 'success' },
    { time: '14:30:08', text: 'Downloading data shards 1-42...', type: 'info' },
    { time: '14:31:12', text: 'TensorFlow 2.15 initialized. GPU: RTX 4090 detected.', type: 'info' },
    { time: '14:32:00', text: 'Epoch 1/50 started. Loss: 2.14, Acc: 0.12', type: 'log' },
    { time: '14:35:14', text: 'Checkpoint saved: /mnt/storage/checkpoints/ep1.h5', type: 'success' },
    { time: '14:38:22', text: 'Epoch 2/50 started. Loss: 1.85, Acc: 0.28', type: 'log' },
    { time: '14:42:05', text: 'Epoch 3/50 started. Loss: 1.52, Acc: 0.41', type: 'log' },
    { time: '14:45:10', text: 'Syncing gradients across 4 thread pools...', type: 'info' },
    { time: '14:48:33', text: 'Epoch 4/50 started. Loss: 1.21, Acc: 0.52', type: 'log' },
    { time: '14:52:12', text: 'Validation loss: 1.18. Improvement detected.', type: 'info' },
    { time: '14:55:00', text: 'Epoch 5/50 started. Loss: 0.98, Acc: 0.64', type: 'log' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-4">
          <Link to="/jobs" className="flex items-center gap-2 text-text-muted hover:text-accent-primary transition-colors text-xs font-mono uppercase tracking-widest">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">
              <ScrambleText text={job.name} />
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-mono text-[#555] uppercase tracking-widest">
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#555]" /> ID: <ScrambleText text={job.id} /></span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#555]" /> Submitter: @<ScrambleText text={job.submitter} /></span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#555]" /> Started: <ScrambleText text={job.started} /></span>
            <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-[#555]" /> Assigned Node: <span className="text-accent-primary underline decoration-accent-primary/30 cursor-pointer"><ScrambleText text={job.node} /></span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-card border border-status-red/30 text-status-red px-4 py-2 rounded-xl text-sm font-semibold hover:bg-status-red/10 transition-all">
            <XCircle className="w-4 h-4" /> Cancel Job
          </button>
          <button className="flex items-center gap-2 bg-accent-primary text-black px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 disabled:opacity-30 disabled:grayscale transition-all" disabled={job.status !== 'COMPLETED'}>
            <Download className="w-4 h-4" /> Results
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Detailed Info & Logs */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-card border border-[#222] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-5 h-5 text-accent-primary" />
                <h3 className="text-sm font-bold uppercase font-mono tracking-widest">Job Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#222]">
                  <span className="text-xs text-text-muted">Job Type</span>
                  <span className="text-sm font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#222]">
                  <span className="text-xs text-text-muted">Total Runtime</span>
                  <span className="text-sm font-medium">{job.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#222]">
                  <span className="text-xs text-text-muted">Credits Consumed</span>
                  <span className="text-sm font-mono text-accent-primary">
                    <ScrambleText text="412.50" /> HC
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mt-4">
                  {job.description}
                </p>
              </div>
            </div>

            <div className="bg-surface-card border border-[#222] rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-status-green" />
                  <h3 className="text-sm font-bold uppercase font-mono tracking-widest">Resource Usage</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-status-green/10 border border-status-green/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
                  <span className="text-[10px] font-mono text-status-green uppercase">Live · 4s ago</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-surface-elevated rounded-xl border border-[#222] group hover:border-accent-primary transition-all">
                    <div className="text-2xl font-mono font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      <ScrambleText text={job.cpu.toString()} />%
                    </div>
                    <div className="text-[8px] font-mono text-[#555] uppercase tracking-widest mt-1">CPU Load</div>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-xl border border-[#222] group hover:border-[#39FF6A] transition-all">
                    <div className="text-2xl font-mono font-bold text-text-primary group-hover:text-status-green transition-colors">
                      <ScrambleText text={job.gpu.toString()} />%
                    </div>
                    <div className="text-[8px] font-mono text-[#555] uppercase tracking-widest mt-1">GPU Compute</div>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-xl border border-[#222] group hover:border-status-yellow transition-all">
                    <div className="text-2xl font-mono font-bold text-text-primary group-hover:text-status-yellow transition-colors">
                      <ScrambleText text={job.ram.toString()} />%
                    </div>
                    <div className="text-[8px] font-mono text-[#555] uppercase tracking-widest mt-1">Memory</div>
                  </div>
                </div>
                
                <div className="bg-[#0c0c0c] border border-[#222] rounded-xl p-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#555] uppercase mb-4 tracking-tighter">
                    <span>Performance Matrix</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-accent-primary" /> Active</span>
                  </div>
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 32, 85, 45, 92, 70, 48, 62, 75, 55, 88].map((h, i) => (
                      <div key={i} className="flex-1 bg-surface-elevated rounded-t-sm relative group">
                        <div className="absolute bottom-0 w-full bg-accent-primary transition-all duration-700" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#000] border border-[#222] rounded-2xl p-6 font-mono text-sm relative group overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#222]/50 pb-4">
              <div className="flex items-center gap-3 text-text-muted">
                <Terminal className="w-5 h-5" />
                <span className="text-[10px] uppercase font-mono tracking-[0.2em]">Console Output</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-3 h-3 rounded bg-accent-primary group-active:scale-95 transition-all" />
                  <span className="text-[10px] text-text-muted uppercase tracking-tighter">Auto-scroll</span>
                </div>
                <MoreVertical className="w-4 h-4 text-text-muted cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {logLines.map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-text-muted/30 shrink-0 select-none">{log.time}</span>
                  <span className={
                    log.type === 'success' ? 'text-status-green' : 
                    log.type === 'log' ? 'text-text-primary/70' : 'text-text-muted'
                  }>
                    <span className="text-text-muted/20 shrink-0 select-none mr-2">root@hivemind:~$</span>
                    {log.text}
                  </span>
                </div>
              ))}
              <div className="h-4 border-l-2 border-accent-primary ml-[100px] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Column - Status & Timeline */}
        <div className="space-y-6">
          <div className="bg-surface-card border border-[#222] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <History className="w-5 h-5 text-[#555]" />
              <h3 className="text-sm font-bold uppercase font-mono tracking-widest">Job Lifecycle</h3>
            </div>
            
            <div className="space-y-0">
              {[
                { name: 'Job Created', date: 'Mar 20, 14:30', completed: true },
                { name: 'Validation Pass', date: 'Mar 20, 14:30', completed: true },
                { name: 'Compute Allocated', date: 'Mar 20, 14:31', completed: true },
                { name: 'Executing Workload', date: 'In Progress', current: true },
                { name: 'Verification Phase', date: '-', pending: true },
                { name: 'Final Distribution', date: '-', pending: true }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < 5 && <div className={`absolute left-2.5 top-5 w-[1px] h-full ${step.completed ? 'bg-status-green' : 'bg-[#222]'}`} />}
                  <div className={`shrink-0 w-5 h-5 rounded-full z-10 flex items-center justify-center ${
                    step.completed ? 'bg-status-green' : 
                    step.current ? 'bg-accent-primary animate-pulse' : 'bg-[#111] border border-[#222]'
                  }`}>
                    {step.completed && <ShieldCheck className="w-3 h-3 text-black" />}
                    {step.current && <Activity className="w-3 h-3 text-black" />}
                  </div>
                  <div className="pb-8">
                    <div className={`text-xs font-bold leading-none mb-1 ${step.pending ? 'text-text-muted' : 'text-text-primary'}`}>{step.name}</div>
                    <div className="text-[10px] font-mono text-[#555] uppercase tracking-tighter">{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-card border border-[#222] rounded-2xl p-6">
             <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555] mb-6">Assigned Node Spec</div>
             <div className="bg-background-base border border-[#222] rounded-xl p-4 group hover:border-accent-primary transition-all">
               <div className="flex justify-between items-center mb-4">
                 <span className="font-mono text-accent-primary text-xs tracking-widest">
                   <ScrambleText text="node-77a2" />
                 </span>
                 <div className="w-2 h-2 rounded-full bg-status-green" />
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-[#555]">GPU</span>
                   <span className="text-text-secondary">RTX 4090 v2</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-[#555]">VRAM</span>
                   <span className="text-text-secondary">24GB DDR6X</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-mono">
                   <span className="text-[#555]">Uptime</span>
                   <span className="text-text-secondary">99.9%</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-mono pt-3 border-t border-[#222]">
                   <span className="text-[#555]">Region</span>
                   <span className="text-text-secondary">North America (US-WEST)</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-accent-primary text-black rounded-2xl p-6 shadow-[0_0_40px_rgba(250,255,0,0.08)]">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest mb-4 opacity-70">Credit Allocation</h4>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Estimated Expenditure</span>
              <span className="text-sm font-mono font-bold">$12.45 p/h</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium">Session Total</span>
              <span className="text-xl font-mono font-bold">
                <ScrambleText text="412.50" /> HC
              </span>
            </div>
            <div className="pt-4 border-t border-black/10 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold uppercase opacity-60">Balance Remaining</span>
              <span className="text-xs font-mono font-bold">
                <ScrambleText text="2,438.00" /> HC
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
