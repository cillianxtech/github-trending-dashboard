import { useState, useEffect } from 'react';
import { Star, GitFork, Clock, ExternalLink } from 'lucide-react';
import { fetchAIToolsRanking, AITool } from '../api';

export function AIUsageRanking() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAIToolsRanking();
        setTools(data);
      } catch (error) {
        console.error('Failed to load AI tools:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 计算统计数据
  const totalStars = tools.reduce((sum, t) => sum + t.stars, 0);
  const totalForks = tools.reduce((sum, t) => sum + t.forks, 0);
  const avgStars = tools.length > 0 ? Math.round(totalStars / tools.length) : 0;
  const topStars = tools.length > 0 ? tools[0].stars : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Stats Overview */}
      <div className="p-3 grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-2.5 h-2.5 text-[#d29922]" />
            <span className="text-[9px] text-[#8b949e]">Total</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#c9d1d9]">
            {loading ? '--' : `${(totalStars / 1000).toFixed(0)}K`}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <GitFork className="w-2.5 h-2.5 text-[#a371f7]" />
            <span className="text-[9px] text-[#8b949e]">Forks</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#a371f7]">
            {loading ? '--' : `${(totalForks / 1000).toFixed(0)}K`}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-2.5 h-2.5 text-[#58a6ff]" />
            <span className="text-[9px] text-[#8b949e]">Avg</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#58a6ff]">
            {loading ? '--' : `${(avgStars / 1000).toFixed(0)}K`}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-2.5 h-2.5 text-[#3fb950]" />
            <span className="text-[9px] text-[#8b949e]">Top</span>
          </div>
          <div className="text-sm font-bold font-mono text-[#3fb950]">
            {loading ? '--' : `${(topStars / 1000).toFixed(0)}K`}
          </div>
        </div>
      </div>

      <div className="border-t border-[#21262d]"></div>

      {/* AI Tools Rankings */}
      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          // Loading skeleton
          <div className="space-y-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-2.5 bg-[#21262d] rounded animate-pulse"></div>
                    <div className="flex flex-col gap-1">
                      <div className="w-20 h-2 bg-[#21262d] rounded animate-pulse"></div>
                      <div className="w-12 h-1.5 bg-[#21262d] rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1.5 bg-[#21262d] rounded animate-pulse"></div>
                    <div className="w-8 h-1.5 bg-[#21262d] rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-1 bg-[#21262d] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full w-0 bg-[#58a6ff]/20 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-24 h-1.5 bg-[#21262d] rounded animate-pulse"></div>
                  <div className="w-12 h-1.5 bg-[#21262d] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1.5">
            {tools.map((tool, index) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/30 transition-all group"
              >
                {/* Main Info */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[10px] font-mono w-4 flex-shrink-0" style={{ color: index < 3 ? '#58a6ff' : '#484f58' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[#c9d1d9] truncate">
                          {tool.name}
                        </span>
                        <span className="px-1.5 py-0.5 text-[8px] bg-[#21262d] text-[#8b949e] rounded flex-shrink-0">
                          {tool.category}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#484f58] truncate">
                        {tool.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1 text-[9px] text-[#8b949e]">
                      <Star className="w-2.5 h-2.5 text-[#d29922]" />
                      <span className="font-mono">{(tool.stars / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-[#8b949e]">
                      <GitFork className="w-2.5 h-2.5 text-[#a371f7]" />
                      <span className="font-mono">{(tool.forks / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar - based on stars relative to top */}
                <div className="h-1 bg-[#21262d] rounded-full overflow-hidden mb-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500 group-hover:bg-[#58a6ff]/80"
                    style={{
                      width: topStars > 0 ? `${(tool.stars / topStars) * 100}%` : '0%',
                      background: `linear-gradient(90deg, #0369a1, #58a6ff)`,
                    }}
                  />
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-[9px]">
                  <div className="flex items-center gap-2 text-[#484f58]">
                    <span className="px-1.5 py-0.5 bg-[#0d1117] rounded text-[#8b949e]">
                      {tool.language}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{getRelativeTime(tool.updatedAt)}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-2.5 h-2.5 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#21262d] bg-[#0d1117]/50">
        <div className="flex items-center justify-between text-[9px] text-[#484f58]">
          <div className="flex items-center gap-3">
            <span>{loading ? '--' : `${tools.length} repos`}</span>
            <span>
              Categories: {loading ? '--' : Array.from(new Set(tools.map(t => t.category))).slice(0, 4).join(', ')}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-[#58a6ff] animate-pulse"></span>
            Live
          </span>
        </div>
      </div>
    </div>
  );
}

// 计算相对时间
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return '< 1h';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return '30d+ ago';
}
