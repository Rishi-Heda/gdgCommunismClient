import React from 'react';

/**
 * ScrollingTape Component
 * Creates a dynamic "tape" effect with dual-layer scrolling text.
 * Integrates infinite marquee effect for industrial visual noise.
 */
const ScrollingTape = ({ text = "THE HIVE MARKET", speed = 40, tilt = -2.5 }) => {
  // Number of items to fill the width. Doubled for the marquee loop.
  const items = Array(12).fill(text);

  return (
    <div 
      className="relative w-[110vw] left-1/2 -translate-x-1/2 overflow-hidden mb-8 py-2 pointer-events-none select-none z-10"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {/* Top Row: Moves Left */}
      <div className="bg-black py-4 mb-3 flex border-y border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div 
          className="animate-marquee-left flex items-center min-w-max"
          style={{ '--duration': `${speed}s` }}
        >
          {items.map((t, idx) => (
            <div key={`l1-${idx}`} className="flex items-center mx-8 leading-none">
              <span className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                {t}
              </span>
              <div className="mx-12 w-3 h-3 bg-white/20 rotate-45" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {items.map((t, idx) => (
            <div key={`l2-${idx}`} className="flex items-center mx-8 leading-none">
              <span className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                {t}
              </span>
              <div className="mx-12 w-3 h-3 bg-white/20 rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Moves Right */}
      <div className="bg-black py-4 flex border-y border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div 
          className="animate-marquee-right flex items-center min-w-max"
          style={{ '--duration': `${speed * 1.2}s` }}
        >
          {items.map((t, idx) => (
            <div key={`r1-${idx}`} className="flex items-center mx-8 leading-none">
              <span className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                {t}
              </span>
              <div className="mx-12 w-3 h-3 bg-white/20 rotate-45" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {items.map((t, idx) => (
            <div key={`r2-${idx}`} className="flex items-center mx-8 leading-none">
              <span className="text-white text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
                {t}
              </span>
              <div className="mx-12 w-3 h-3 bg-white/20 rotate-45" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Tape "Texture" */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};

export default ScrollingTape;

