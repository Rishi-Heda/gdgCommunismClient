import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, 
  Search, 
  Filter, 
  Calendar, 
  MoreVertical, 
  Eye, 
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrambleText from '../components/common/ScrambleText';

const JobsList = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    filterStatus === 'All' || job.status === filterStatus.toUpperCase()
  );
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'RUNNING': return 'text-status-green bg-status-green/10 border-status-green/20';
      case 'PENDING': return 'text-status-yellow bg-status-yellow/10 border-status-yellow/20';
      case 'FAILED': return 'text-status-red bg-status-red/10 border-status-red/20';
      case 'COMPLETED': return 'text-text-primary bg-text-primary/10 border-text-primary/20';
      default: return 'text-text-muted bg-[#111] border-[#222]';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PlayCircle className="w-8 h-8 text-accent-primary" />
            <ScrambleText text="All Compute Jobs" />
          </h1>
          <p className="text-text-secondary mt-1">Manage and monitor all workloads across the HiveMind network.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="bg-surface-card border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-accent-primary outline-none transition-colors w-full md:w-64"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-surface-card border border-[#222] text-text-muted hover:text-accent-primary transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-surface-card p-2 rounded-2xl border border-[#222]">
        <div className="flex items-center gap-1 p-1 bg-background-base rounded-xl border border-[#222]">
          {['All', 'Running', 'Pending', 'Completed', 'Failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-accent-primary text-black' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="h-6 w-[1px] bg-[#222] hidden md:block" />
        
        <div className="flex items-center gap-2 px-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <select className="bg-transparent text-xs font-mono text-text-secondary outline-none cursor-pointer">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <section className="bg-surface-card border border-[#222] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111]">
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Job ID" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Name & Type" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Submitter" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Status" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Node" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Started" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase">
                  <ScrambleText text="Duration" />
                </th>
                <th className="px-6 py-5 text-[10px] font-mono tracking-widest text-[#555] uppercase text-right">
                  <ScrambleText text="Actions" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredJobs.map((job, idx) => (
                <tr key={`${job.id}-${idx}`} className="hover:bg-[#111] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-tighter">
                      #<ScrambleText text={job.id.includes('-') ? job.id.split('-')[1] : job.id.slice(0, 4)} />
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold group-hover:text-accent-primary transition-colors">
                      <ScrambleText text={job.name} />
                    </div>
                    <div className="text-[10px] font-mono text-text-muted uppercase mt-0.5 tracking-tighter">{job.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-surface-elevated border border-[#222] flex items-center justify-center">
                        <span className="text-[8px] text-text-muted uppercase">{job.submitter ? job.submitter[0] : '?'}</span>
                      </div>
                      <span className="text-xs font-mono text-text-secondary">@<ScrambleText text={job.submitter || 'anonymous'} /></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border whitespace-nowrap ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-text-muted">
                      <ScrambleText text={job.assigned_node_id || 'unassigned'} />
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary whitespace-nowrap">
                    {job.started_at || '-'}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary whitespace-nowrap">
                    {job.duration || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/jobs/${job.id}`}>
                        <button className="p-2 rounded-lg bg-surface-elevated border border-[#222] text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2 rounded-lg bg-surface-elevated border border-[#222] text-text-muted hover:text-status-red hover:border-status-red transition-all">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-[#222] bg-[#0c0c0c] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#555] uppercase tracking-widest">
            Showing 1 – 10 of 42 Jobs
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-surface-card border border-[#222] text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-accent-glow text-accent-primary border border-accent-primary/20">1</span>
              <span className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text-primary cursor-pointer hover:bg-surface-elevated">2</span>
              <span className="px-3 py-1.5 rounded-lg text-text-muted hover:text-text-primary cursor-pointer hover:bg-surface-elevated">3</span>
            </div>
            <button className="p-2 rounded-lg bg-surface-card border border-[#222] text-text-muted hover:text-text-primary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobsList;
