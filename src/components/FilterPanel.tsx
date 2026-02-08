import { Filter, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  language: string;
  since: string;
  onLanguageChange: (language: string) => void;
  onSinceChange: (since: string) => void;
}

const languages = [
  { name: 'All Languages', value: '' },
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'Go', value: 'go' },
  { name: 'Rust', value: 'rust' },
  { name: 'C++', value: 'c++' },
];

const timeRanges = [
  { name: 'Today', value: 'daily' },
  { name: 'Week', value: 'weekly' },
  { name: 'Month', value: 'monthly' },
];

export function FilterPanel({ language, since, onLanguageChange, onSinceChange }: FilterPanelProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded p-3 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#8b949e]" />
        <span className="text-xs text-[#8b949e] uppercase tracking-wide">Filters</span>
      </div>
      
      <div className="h-4 w-px bg-[#30363d]" />
      
      {/* Language */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#484f58] uppercase">Lang:</span>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 pr-7 text-xs text-[#c9d1d9] focus:border-[#58a6ff] cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#484f58] pointer-events-none" />
        </div>
      </div>
      
      {/* Time Range */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#484f58] uppercase">Time:</span>
        <div className="flex">
          {timeRanges.map((range, i) => (
            <button
              key={range.value}
              onClick={() => onSinceChange(range.value)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                i === 0 ? 'rounded-l' : ''
              } ${
                i === timeRanges.length - 1 ? 'rounded-r' : ''
              } ${
                i > 0 ? 'border-l-0' : ''
              } ${
                since === range.value
                  ? 'bg-transparent border-[#58a6ff] text-[#58a6ff]'
                  : 'bg-transparent border-[#30363d] text-[#8b949e] hover:border-[#58a6ff] hover:text-[#c9d1d9]'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
