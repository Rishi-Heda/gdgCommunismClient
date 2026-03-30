import React, { useState } from 'react';
import { 
  PlusSquare, 
  Cpu, 
  Layers, 
  Upload, 
  Github, 
  ShieldCheck, 
  Zap, 
  Clock,
  ArrowRight
} from 'lucide-react';
import ScrambleText from '../components/common/ScrambleText';
import { useWealth } from '../context/WealthContext';

const SubmitJob = () => {
  const [jobType, setJobType] = useState('AI Training');
  const [gpuRequired, setGpuRequired] = useState(true);
  const [priority, setPriority] = useState('Standard');
  const [minRam, setMinRam] = useState(32);

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const { wealth } = useWealth();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setSelectedFile(file);
    } else if (file) {
      alert('Invalid file format. Please upload a .zip file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setSelectedFile(file);
    } else if (file) {
      alert('Invalid file format. Please upload a .zip file.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <PlusSquare className="w-8 h-8 text-accent-primary" />
          <ScrambleText text="Submit Compute Job" />
        </h1>
        <p className="text-text-secondary mt-2">Configure your requirements and upload your workload to the HiveMind network.</p>
      </header>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Section 1 - Job Details */}
        <div className="bg-surface-card border border-[#222] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 mb-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#555]">
            <span className="w-5 h-5 rounded-full border border-[#333] flex items-center justify-center text-text-muted">1</span>
            <ScrambleText text="Job Details" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Job Name</label>
              <input 
                type="text" 
                placeholder="e.g. LLM-FineTune-Medical-v2" 
                className="w-full bg-surface-elevated border border-[#222] rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-colors text-text-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Description</label>
              <textarea 
                rows="3" 
                placeholder="Describe the nature of your workload..." 
                className="w-full bg-surface-elevated border border-[#222] rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-colors text-text-primary resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3 text-text-secondary">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {['AI Training', 'Simulation', 'Data Processing', 'Custom'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setJobType(type)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                      jobType === type 
                        ? 'bg-accent-primary text-black border-accent-primary' 
                        : 'bg-surface-elevated text-text-secondary border-[#222] hover:border-text-muted'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Resource Requirements */}
        <div className="bg-surface-card border border-[#222] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 mb-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#555]">
            <span className="w-5 h-5 rounded-full border border-[#333] flex items-center justify-center text-text-muted">2</span>
            <ScrambleText text="Resource Requirements" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <label className="text-text-secondary flex items-center gap-2 uppercase font-mono tracking-tighter">
                  <Cpu className="w-4 h-4" /> Min CPU Cores
                </label>
                <input type="number" defaultValue={8} min={1} max={128} className="w-20 bg-surface-elevated border border-[#222] rounded-lg px-3 py-1 text-center font-mono text-accent-primary focus:border-accent-primary outline-none" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <label className="text-text-secondary flex items-center gap-2 uppercase font-mono tracking-tighter">
                    <Layers className="w-4 h-4" /> Min RAM: {minRam} GB
                  </label>
                </div>
                <input
                  type="range"
                  min="8"
                  max="128"
                  step="8"
                  value={minRam}
                  onChange={(e) => setMinRam(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent-primary"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-elevated border border-[#222] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${gpuRequired ? 'bg-accent-glow text-accent-primary' : 'bg-background-base text-text-muted'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">GPU Required</div>
                    <div className="text-[10px] text-text-muted font-mono uppercase">ACCELERATED COMPUTE</div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setGpuRequired(!gpuRequired)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${gpuRequired ? 'bg-accent-primary' : 'bg-[#222]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${gpuRequired ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {gpuRequired && (
                <select className="w-full bg-surface-elevated border border-[#222] rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-colors text-text-primary text-sm appearance-none cursor-pointer">
                  <option>Any GPU</option>
                  <option>NVIDIA RTX 4090 (or equivalent)</option>
                  <option>NVIDIA RTX 3000 Series</option>
                  <option>NVIDIA A100 / H100</option>
                  <option>AMD Radeon Pro</option>
                </select>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <label className="block text-sm font-medium mb-3 text-text-secondary uppercase font-mono tracking-tighter flex items-center gap-2">
              <Clock className="w-4 h-4" /> Estimated Duration
            </label>
            <select className="w-full bg-surface-elevated border border-[#222] rounded-xl px-4 py-3 outline-none focus:border-accent-primary transition-colors text-text-primary text-sm">
              <option>&lt; 1 hour</option>
              <option>1 – 6 hours</option>
              <option>6 – 24 hours</option>
              <option>24 hours+</option>
            </select>
          </div>
        </div>

        {/* Section 3 - Upload */}
        <div className="bg-surface-card border border-[#222] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 mb-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#555]">
            <span className="w-5 h-5 rounded-full border border-[#333] flex items-center justify-center text-text-muted">3</span>
            <ScrambleText text="Upload" />
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[#222] hover:border-accent-primary transition-colors rounded-3xl p-12 text-center group bg-surface-elevated/50 cursor-pointer relative"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".zip" 
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-full bg-background-base border border-[#222] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent-glow transition-all">
              <Upload className="w-6 h-6 text-text-muted group-hover:text-accent-primary" />
            </div>
            {selectedFile ? (
              <div className="animate-fade-in">
                <p className="text-accent-primary font-bold font-mono tracking-wider">{selectedFile.name}</p>
                <p className="text-[10px] text-text-muted font-mono uppercase mt-1">FILE VERIFIED & READY</p>
              </div>
            ) : (
              <>
                <p className="text-text-primary font-medium">Click or drag and drop files here</p>
                <p className="text-text-muted text-xs mt-2 uppercase font-mono tracking-widest">Supports .zip only</p>
              </>
            )}
          </div>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-[#222]"></div>
            <span className="flex-shrink mx-4 text-text-muted text-[10px] font-mono uppercase">or</span>
            <div className="flex-grow border-t border-[#222]"></div>
          </div>
          
          <div>
            <div className="relative">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                type="text" 
                placeholder="Paste GitHub Repository URL" 
                className="w-full bg-surface-elevated border border-[#222] rounded-xl pl-12 pr-4 py-3 outline-none focus:border-accent-primary transition-colors text-text-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 4 - Priority & Cost */}
        <div className="bg-surface-card border border-[#222] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-2 mb-6 text-[10px] font-mono uppercase tracking-[0.2em] text-[#555]">
            <span className="w-5 h-5 rounded-full border border-[#333] flex items-center justify-center text-text-muted">4</span>
            <ScrambleText text="Priority & Credits" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Standard', cost: '12 – 18', desc: 'Queued normally', icon: Clock },
              { name: 'Priority', cost: '25 – 40', desc: 'Jump the queue', icon: Zap, glow: true },
              { name: 'Urgent', cost: '80 – 120', desc: 'High availability', icon: ShieldCheck, accent: true }
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setPriority(p.name)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  priority === p.name 
                    ? 'border-accent-primary bg-accent-glow' 
                    : 'border-[#222] bg-surface-elevated hover:border-[#333]'
                }`}
              >
                {priority === p.name && <div className="absolute top-0 right-0 w-8 h-8 bg-accent-primary/20 flex items-center justify-center rounded-bl-xl"><PlusSquare className="w-3 h-3 text-accent-primary" /></div>}
                <div className="text-xs font-mono text-text-muted mb-1 uppercase tracking-tighter">
                  <ScrambleText text={p.name} />
                </div>
                <div className="text-xl font-bold font-mono text-text-primary mb-2">
                  <ScrambleText text={p.cost} /> <span className="text-[10px] text-text-muted uppercase tracking-tighter">Credits/hr</span>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed uppercase font-mono tracking-tighter truncate">{p.desc}</p>
              </button>
            ))}
          </div>
          
          <div className="pt-6 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Account Balance:</div>
              <div className="text-xl font-bold font-mono">
                <ScrambleText text={wealth.mindCredits.toLocaleString()} /> MC
              </div>
            </div>
            
            <button className="w-full sm:w-auto bg-accent-primary text-black px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(250,255,0,0.1)]">
              Submit Job <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitJob;
