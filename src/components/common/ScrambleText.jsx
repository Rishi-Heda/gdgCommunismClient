import React, { useState, useEffect, useRef } from 'react';

const SYMBOLS = "!@#$%^&*()_+=-[]{};':\"|,.<>/?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleLetter = ({ letter }) => {
  const [displayLetter, setDisplayLetter] = useState(letter);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(0);

  const startAnimation = () => {
    setIsHovered(true);
    setIsAnimating(true);
    startTimeRef.current = Date.now();
    
    // Clear any existing cleanup timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const stopAnimation = () => {
    setIsHovered(false);
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, 500 - elapsed);

    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, remaining);
  };

  useEffect(() => {
    if (isAnimating && letter !== ' ') {
      intervalRef.current = setInterval(() => {
        const randomChar = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        setDisplayLetter(randomChar);
      }, 60);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayLetter(letter);
      };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayLetter(letter);
    }
  }, [isAnimating, letter]);

  return (
    <span
      onMouseEnter={startAnimation}
      onMouseLeave={stopAnimation}
      className={`inline-block cursor-default transition-all duration-200 select-none ${isHovered || isAnimating ? 'text-accent-primary transform scale-110' : ''}`}
      style={{ display: 'inline-block' }}
    >
      {displayLetter === ' ' ? '\u00A0' : displayLetter}
    </span>
  );
};

const ScrambleText = ({ text, className = "" }) => {
  if (!text) return null;
  
  return (
    <span className={`${className} inline-block whitespace-nowrap`}>
      {text.split('').map((char, index) => (
        <ScrambleLetter key={`${char}-${index}`} letter={char} />
      ))}
    </span>
  );
};

export default ScrambleText;
