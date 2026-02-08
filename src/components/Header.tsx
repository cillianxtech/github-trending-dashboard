import { useState, useEffect } from 'react';
import { Github } from 'lucide-react';

export function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 10);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');

  return (
    <header className="border-b border-[#30363d] bg-[#161b22]">
      <div className="px-4">
        <div className="flex items-center justify-between h-12">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-[#c9d1d9]" />
            <span className="text-sm font-semibold text-[#c9d1d9]">GITHUB TRENDING DASHBOARD</span>
          </div>
          
          {/* Right - Time */}
          <div 
            className="flex items-baseline text-[#3fb950]"
            style={{ 
              fontFamily: "'Orbitron', 'Share Tech Mono', 'JetBrains Mono', monospace", 
              textShadow: '0 0 10px rgba(63, 185, 80, 0.5)',
            }}
          >
            <span className="text-base tracking-wider" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {hours}:{minutes}:{seconds}
            </span>
            <span className="text-[#3fb950]/50 text-xs">.</span>
            <span 
              className="text-xs text-[#3fb950]/80"
              style={{ 
                width: '2.2em', 
                display: 'inline-block', 
                fontVariantNumeric: 'tabular-nums' 
              }}
            >
              {ms}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
