import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrambleText from '../components/common/ScrambleText';
import { useWealth } from '../context/WealthContext';
import {
  Users,
  Settings,
  ArrowUpRight,
  LayoutGrid,
  Clock,
  Globe,
  ChevronRight,
  Database,
  Cpu,
  Monitor
} from 'lucide-react';

const SegmentedProgress = ({ percent, color = "#FAFF00" }) => {
  const blocks = 8;
  const activeBlocks = Math.round((percent / 100) * blocks);
  return (
    <div className="flex gap-1.5 h-3 w-16">
      {[...Array(blocks)].map((_, i) => (
        <div
          key={i}
          className={`h-full w-1 rounded-[2px] transition-all duration-700 ${i < activeBlocks ? 'shadow-[0_0_10px_rgba(250,255,0,0.3)]' : 'opacity-10'}`}
          style={{ backgroundColor: i < activeBlocks ? color : 'rgba(255,255,255,0.2)' }}
        />
      ))}
    </div>
  );
};

const NodeGauge = ({ label, value, specs, color = "#FAFF00" }) => {
  const segments = 12;
  const activeSegments = Math.round((value / 100) * segments);
  
  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-48 h-32 flex items-center justify-center pt-8 overflow-hidden">
        <svg className="w-40 h-40 transform translate-y-4">
          {[...Array(segments)].map((_, i) => {
            const startAngle = -90 + (i * 180 / segments);
            const midAngle = startAngle + (180 / segments / 2);
            return (
              <rect
                key={i}
                x="76"
                y="10"
                width="8"
                height="24"
                rx="4"
                fill={i < activeSegments ? color : "rgba(255,255,255,0.05)"}
                className="transition-all duration-700 ease-out origin-[80px_80px]"
                style={{ 
                  transform: `rotate(${midAngle}deg)`,
                  filter: i < activeSegments ? `drop-shadow(0 0 8px ${color}44)` : 'none'
                }}
              />
            );
          })}
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-14">
          <div className="text-3xl font-black font-mono tracking-tighter text-white">
            <ScrambleText text={`${value}%`} />
          </div>
          <div className="text-[10px] font-mono font-bold text-accent-primary uppercase tracking-[0.2em] mb-1">
            <ScrambleText text={label} />
          </div>
        </div>
      </div>
      <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest mt-2 group-hover:opacity-100 transition-opacity">
        {specs}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isContributing, setIsContributing] = useState(false);
  const [time, setTime] = useState(new Date());
  const { wealth } = useWealth();
  const scrollRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [localNodeId, setLocalNodeId] = useState(null);
  const [localNodeData, setLocalNodeData] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/status');
        if (res.ok) {
          const status = await res.json();
          setLocalNodeId(status.node_id);
          setIsContributing(status.app_mode === 'donate_compute');
        }
      } catch (error) {
        console.error('Error fetching system status:', error);
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, nodesRes, activityRes] = await Promise.all([
          fetch('http://localhost:8001/api/jobs'),
          fetch('http://localhost:8001/api/nodes'),
          fetch('http://localhost:8001/api/activity')
        ]);

        if (jobsRes.ok) setJobs(await jobsRes.json());
        
        let allNodes = [];
        if (nodesRes.ok) {
          const nodesData = await nodesRes.json();
          allNodes = nodesData.nodes || nodesData || [];
          setNodes(allNodes);
        }
        
        if (activityRes.ok) setActivity(await activityRes.json());

        // Update local node data from the network list
        if (localNodeId) {
          const me = allNodes.find(n => n.id === localNodeId);
          if (me) {
            setLocalNodeData(me);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [localNodeId]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Active Contributors', value: nodes.length.toString(), trend: '+2 today', icon: Users },
    { label: 'Jobs Running', value: jobs.filter(j => j.status === 'RUNNING').length.toString(), trend: '+5 today', icon: Settings },
    { label: 'Credits Balance', value: wealth?.mindCredits?.toLocaleString() || "0", trend: '+142.5 today', icon: ArrowUpRight },
    { label: 'Active Tasks', value: jobs.length.toString(), trend: '1.2s avg latency', icon: Clock },
  ];

  const tripleStats = [...stats, ...stats, ...stats];

  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3;
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, [nodes.length, jobs.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth } = scrollRef.current;
    const singleSetWidth = scrollWidth / 3;

    if (scrollLeft <= 5) {
      scrollRef.current.style.scrollBehavior = 'auto';
      scrollRef.current.scrollLeft = singleSetWidth;
    } else if (scrollLeft >= singleSetWidth * 2 - 5) {
      scrollRef.current.style.scrollBehavior = 'auto';
      scrollRef.current.scrollLeft = singleSetWidth;
    } else {
      scrollRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'PENDING': return 'text-status-yellow bg-status-yellow/10 border-status-yellow/20';
      case 'FAILED': return 'text-status-red bg-status-red/10 border-status-red/20';
      case 'COMPLETED': return 'text-status-blue bg-status-blue/10 border-status-blue/20';
      default: return 'text-text-muted bg-[#111] border-[#222]';
    }
  };

  const transactions = [
    { type: 'earn', amount: '+12.0', desc: 'Contributed 2 GPU-hrs', time: '2M AGO' },
    { type: 'spend', amount: '-30.0', desc: 'Submitted ResNet Training', time: '1H AGO' },
    { type: 'earn', amount: '+8.5', desc: 'Contributed 1.5 CPU-hrs', time: '3H AGO' },
    { type: 'spend', amount: '-15.0', desc: 'Submitted ANN Experiment', time: '5H AGO' },
    { type: 'earn', amount: '+20.0', desc: 'Contributed 4 CPU-hrs', time: '1D AGO' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-text-primary pb-20 px-6 lg:px-8">
      {/* SECTION 1 — PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 pt-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-6 mb-4 lg:mb-0">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase"><ScrambleText text="Dashboard" /></h1>
              <span className="text-[10px] font-mono text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded border border-accent-primary/20 animate-pulse">SYSTEM_U64_STABLE</span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-muted mt-1">PRIMARY_DIAGNOSTIC_ROOT</p>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          <button
            onClick={() => setIsContributing(!isContributing)}
            className={`group relative flex items-center gap-4 px-6 py-2.5 rounded-none border transition-all duration-500 overflow-hidden ${isContributing
                ? 'bg-accent-primary/5 border-accent-primary/50 shadow-[0_0_20px_rgba(250,255,0,0.1)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
          >
            <div className={`absolute inset-0 bg-accent-primary/5 transition-transform duration-700 ${isContributing ? 'translate-x-0' : '-translate-x-full'}`} />
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${isContributing ? 'bg-accent-primary shadow-[0_0_12px_rgb(250,255,0)]' : 'bg-white/20'}`} />
                {isContributing && <div className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-40" />}
              </div>
              <span className={`text-[11px] font-mono font-black tracking-[0.2em] uppercase transition-colors ${isContributing ? 'text-accent-primary' : 'text-text-muted'}`}>
                {isContributing ? 'TERMINAL_LINK_ACTIVE' : 'TERMINAL_LINK_IDLE'}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-center lg:justify-end gap-10">
          <div className="flex flex-col items-end">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1 opacity-90">NETWORK_LATENCY</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 h-3 items-end">
                <div className="w-0.5 h-full bg-status-green" />
                <div className="w-0.5 h-[80%] bg-status-green" />
                <div className="w-0.5 h-[60%] bg-status-green" />
                <div className="w-0.5 h-[40%] bg-white/20" />
              </div>
              <span className="text-[13px] font-mono font-black text-white">24ms</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex flex-col items-end min-w-[120px]">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1 opacity-90">UTC_TIMESTAMP</div>
            <div className="text-xl font-mono font-black text-accent-primary tracking-tighter">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10" />

          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="w-4 h-4 text-accent-primary animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-pulse shadow-[0_0_8px_rgb(250,255,0)]" />
              </div>
            </div>
            <div className="text-[10px] font-mono font-black text-white tracking-widest uppercase">SYNC_100%</div>
          </div>
        </div>
      </div>

      {/* SECTION 2 — STAT CARDS (CIRCULAR SCROLL) */}
      <div className="relative mb-12 -mx-6 lg:-mx-10 overflow-hidden group/scroll bg-[#0A0A0A] rounded-none">
        <div className="absolute top-0 left-0 bottom-8 w-40 bg-gradient-to-r from-[#0A0A0A] to-transparent pointer-events-none z-10" />
        
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar pb-10 px-10 bg-black/10 transition-all duration-700 scroll-smooth"
        >
          {tripleStats.map((stat, i) => (
            <div 
              key={`${stat.label}-${i}`} 
              className="flex-shrink-0 w-[320px] snap-center bg-surface-card border border-white/5 rounded-[40px] p-8 relative group overflow-hidden transition-all duration-700 hover:border-accent-primary/30 hover:bg-surface-elevated hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute top-0 right-0 p-6">
                <span className="text-[10px] font-mono font-bold text-status-green bg-status-green/5 px-3 py-1 rounded-full border border-status-green/10">
                  {stat.trend}
                </span>
              </div>
              <div className="w-14 h-14 rounded-[20px] bg-surface-elevated border border-white/5 flex items-center justify-center mb-6 group-hover:border-accent-primary transition-colors duration-500">
                <stat.icon className="w-6 h-6 text-text-muted group-hover:text-accent-primary transition-colors duration-500" />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2">
                <ScrambleText text={stat.label} />
              </div>
              <div className="text-4xl font-mono font-bold text-accent-primary leading-none">
                <ScrambleText text={stat.value} />
              </div>
              
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-primary/5 rounded-full blur-[80px] group-hover:bg-accent-primary/10 transition-all duration-1000" />
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 right-0 bottom-8 w-40 bg-gradient-to-l from-[#0A0A0A] to-transparent pointer-events-none z-10" />
      </div>

      {/* SECTION 3 — YOUR NODE */}
      <div className="bg-surface-card border border-accent-primary/30 rounded-[40px] p-10 w-full mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-primary mb-1">NETWORK NODE TERMINAL</div>
            <div className="text-lg font-black font-mono text-white">
              {localNodeId ? <ScrambleText text={localNodeId} /> : "INITIALIZING..."}
            </div>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 bg-black/40 border rounded-full transition-all duration-500 ${isContributing ? 'border-status-green animate-pulse shadow-[0_0_15px_rgba(57,255,106,0.2)]' : 'border-[#222]'}`}>
            <div className={`w-2 h-2 rounded-full ${isContributing ? 'bg-status-green shadow-[0_0_10px_rgb(57,255,106)]' : 'bg-text-muted'}`} />
            <span className={`text-[10px] font-mono uppercase font-bold tracking-widest ${isContributing ? 'text-status-green' : 'text-text-muted'}`}>
              {isContributing ? 'CONTRIBUTING LIVE' : 'TERMINAL IDLE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <NodeGauge label="CPU" value={localNodeData?.metrics?.cpu || 0} specs={localNodeData?.specs?.cpu || "N/A"} />
          <NodeGauge label="GPU" value={localNodeData?.metrics?.gpu || 0} specs={localNodeData?.specs?.gpu || "N/A"} />
          <NodeGauge label="RAM" value={localNodeData?.metrics?.ram || 0} specs={localNodeData?.specs?.ram || "N/A"} />
        </div>
        
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5 relative z-10 font-mono text-[9px] text-text-muted uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3 bg-accent-primary" />
            {localNodeData?.jobs_completed || 0} JOBS CONTRIBUTED BY THIS NODE
          </div>
          <div className="text-[#FAFF00] font-bold">STABILITY: {localNodeData?.uptime || "99.9%"} / OPTIMAL</div>
        </div>
      </div>

      {/* SECTION 4 — MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <section className="bg-surface-card border border-white/5 rounded-none overflow-hidden h-full">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0d0d0d]">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white"><ScrambleText text="Active Task Queue" /></h2>
                <p className="text-[10px] text-text-muted mt-1 font-mono uppercase tracking-[0.2em]">DIAGNOSTIC SYSTEM STREAM</p>
              </div>
              <Link to="/jobs" className="text-[10px] font-mono font-bold text-accent-primary hover:text-white transition-colors flex items-center gap-2 px-4 py-2 bg-accent-primary/5 border border-accent-primary/20 rounded-full">
                EXPAND REGISTRY <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                <thead>
                  <tr className="bg-black/40">
                    <th className="w-[30%] px-6 py-4 text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase whitespace-nowrap">Process Identifier</th>
                    <th className="w-[15%] px-4 py-4 text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase whitespace-nowrap">Operator</th>
                    <th className="w-[12%] px-4 py-4 text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase whitespace-nowrap">Node ID</th>
                    <th className="w-[15%] px-4 py-4 text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase whitespace-nowrap">State</th>
                    <th className="w-[28%] px-6 py-4 text-[9px] font-mono tracking-[0.2em] text-text-secondary uppercase whitespace-nowrap">Network Health / Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-accent-primary/[0.03] transition-all duration-300 group cursor-pointer relative">
                      <td className="px-6 py-5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                          {job.name}
                        </div>
                        <div className="text-[9px] font-mono text-text-muted mt-1 uppercase tracking-wider">
                          PID: {job.id}
                        </div>
                      </td>
                      <td className="px-4 py-5 text-[11px] font-mono text-text-secondary truncate">@{job.submitter}</td>
                      <td className="px-4 py-5 text-[9px] font-mono text-accent-primary/60 uppercase truncate">
                        {job.node || job.assigned_node_id || 'PENDING'}
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold font-mono border-l-2 shadow-sm whitespace-nowrap ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <SegmentedProgress percent={job.progress} />
                          <span className="text-[10px] font-mono font-black text-white/70 group-hover:text-accent-primary transition-colors w-10 text-right">{job.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-text-muted font-mono text-xs uppercase tracking-widest opacity-40">
                        NO ACTIVE PROCESSES DETECTED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <section className="bg-surface-card border border-white/5 rounded-none flex flex-col h-full bg-[#0d0d0d]">
            <div className="p-8 border-b border-white/5">
              <h2 className="text-xl font-bold tracking-tight text-white"><ScrambleText text="Wealth Ledger" /></h2>
              <p className="text-[10px] text-text-muted mt-1 font-mono uppercase tracking-[0.2em]">TRANSACTION HISTORY</p>
            </div>

            <div className="p-8 pb-6 border-b border-white/5 bg-black/20">
              <div className="text-5xl font-black font-mono text-accent-primary tracking-tighter hover:scale-[1.02] transition-transform cursor-pointer origin-left">
                <ScrambleText text={wealth?.mindCredits?.toLocaleString() || "0"} />
              </div>
              <p className="text-[10px] font-mono text-text-muted uppercase mt-2 tracking-[0.3em] font-bold">MINDCREDITS (MC) SYNCED</p>
            </div>

            <div className="flex-1 p-0 overflow-y-auto custom-scrollbar no-scrollbar min-h-[300px]">
              <div className="divide-y divide-white/5">
                {transactions.map((tx, i) => (
                  <div key={i} className="flex justify-between items-center p-6 hover:bg-white/[0.02] transition-colors group">
                    <div>
                      <div className="text-[11px] text-text-primary group-hover:text-white transition-colors">{tx.desc}</div>
                      <div className="text-[9px] font-mono text-text-muted uppercase mt-1 tracking-widest">{tx.time}</div>
                    </div>
                    <div className={`text-sm font-mono font-black ${tx.type === 'earn' ? 'text-status-green' : 'text-status-red'} flex items-center gap-1`}>
                      {tx.type === 'earn' ? '+' : ''}{tx.amount}
                      <span className="text-[8px] opacity-40 ml-0.5">MC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/40">
              <Link to="/credits" className="w-full py-4 block text-center text-[10px] font-mono font-bold text-text-secondary uppercase tracking-[0.3em] hover:text-accent-primary hover:bg-accent-primary/5 transition-all border border-transparent hover:border-accent-primary/20 rounded-sm">
                ACCESS SYSTEM ARCHIVE →
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* SECTION 5 — LIVE COMPUTE NODES */}
      <div className="mb-8">
        <div className="mb-4 flex justify-between items-center px-1">
          <div>
            <h2 className="text-lg font-bold">Active Compute Nodes</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-[0.1em]">LIVE INSTANCES</p>
          </div>
          <LayoutGrid className="w-4 h-4 text-text-muted hover:text-accent-primary cursor-pointer transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map((node) => (
            <div key={node.id} className={`bg-surface-card border p-5 rounded-2xl relative group transition-all duration-300 ${node.id === localNodeId ? 'border-accent-primary' : 'border-white/5 hover:border-accent-primary/30'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`text-xs font-mono ${node.id === localNodeId ? 'text-accent-primary' : 'text-text-primary'}`}>
                    <ScrambleText text={node.id} />
                  </div>
                  {node.id === localNodeId && (
                    <span className="text-[10px] font-mono bg-accent-primary text-black px-1.5 py-0.5 rounded ml-2 uppercase font-bold">YOU</span>
                  )}
                </div>
                <div className={`w-2 h-2 rounded-full ${node.status === 'ONLINE' ? 'bg-status-green shadow-[0_0_8px_rgb(57,255,106)]' : 'bg-status-red'} animate-pulse`} />
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[9px] font-mono text-text-muted uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Cpu className="w-2.5 h-2.5" /> {node.specs?.cpu || 'Unknown'}</span>
                    <span>{node.metrics?.cpu || 0}%</span>
                  </div>
                  <div className="bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className={`${node.id === localNodeId ? 'bg-text-muted opacity-40' : 'bg-white/20'} h-full`} style={{ width: `${node.metrics?.cpu || 0}%` }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[9px] font-mono text-text-muted uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Monitor className="w-2.5 h-2.5" /> {node.specs?.gpu || 'Unknown'}</span>
                    <span>{node.metrics?.gpu || 0}%</span>
                  </div>
                  <div className="bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-accent-primary h-full" style={{ width: `${node.metrics?.gpu || 0}%` }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[9px] font-mono text-text-muted uppercase tracking-tighter">
                    <span className="flex items-center gap-1"><Database className="w-2.5 h-2.5" /> {node.specs?.ram || 'Unknown'}</span>
                    <span>{node.metrics?.ram || 0}%</span>
                  </div>
                  <div className="bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-status-yellow h-full opacity-60" style={{ width: `${node.metrics?.ram || 0}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {nodes.length === 0 && !loading && (
            <div className="col-span-4 border border-dashed border-white/10 p-5 py-10 rounded-2xl flex items-center justify-center">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest opacity-40">SEARCHING_NODES...</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6 — TERMINAL LOGS */}
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-[#050505] border border-white/5 rounded-none h-[500px] flex flex-col font-mono shadow-2xl relative overflow-hidden group/term">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="text-[10px] text-text-muted tracking-widest font-bold">SYSTEM_DIAGNOSTICS_V4.0.2</div>
            <div className="w-12" />
          </div>

          {/* Log Stream */}
          <div className="flex-1 p-6 space-y-1.5 overflow-y-auto no-scrollbar bg-black/40">
            {activity.map((event, i) => {
              const logLevel = 
                event.color === 'green' ? 'SUCCESS' : 
                event.color === 'red' ? 'CRITICAL' : 
                event.color === 'yellow' ? 'WARNING' : 
                event.color === 'blue' ? 'INFO' : 'SYSTEM';
              
              const levelColor = 
                event.color === 'green' ? 'text-status-green' : 
                event.color === 'red' ? 'text-status-red' : 
                event.color === 'yellow' ? 'text-status-yellow' : 
                event.color === 'blue' ? 'text-status-blue' : 'text-white/40';

              return (
                <div key={event.id || i} className="text-[11px] leading-relaxed group/line flex gap-3">
                  <span className="text-white/20 whitespace-nowrap">[{event.time}]</span>
                  <span className={`${levelColor} font-bold whitespace-nowrap w-20`}>[{logLevel}]</span>
                  <span className="text-text-secondary group-hover:text-white transition-colors">{event.text}</span>
                </div>
              );
            })}
            
            <div className="pt-6 flex gap-3 text-[11px]">
              <span className="text-accent-primary font-bold">[ROOT@HIVEMIND]:</span>
              <span className="text-white/40">~/_</span>
              <span className="w-1.5 h-4 bg-accent-primary animate-pulse -ml-1 mt-0.5" />
            </div>
          </div>

          {/* Terminal Footer Info */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[9px] text-text-muted lowercase tracking-tighter">
            <div>LOG_SYNC: ACTIVE</div>
            <div className="flex gap-4">
              <span>ENV: PRODUCTION_NODE</span>
              <span>BUF_SIZE: 1024KB</span>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Dashboard;
