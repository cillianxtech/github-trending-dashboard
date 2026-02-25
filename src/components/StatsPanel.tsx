import { useMemo } from 'react';

interface StatsPanelProps {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  languages: number;
  loading: boolean;
  languageStats: Record<string, number>;
}

// 语言颜色映射
const LANGUAGE_COLORS: Record<string, string> = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Ruby': '#701516',
  'C++': '#f34b7d',
  'C#': '#178600',
  'PHP': '#4F5D95',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Vue': '#41b883',
  'C': '#555555',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
  'default': '#8b949e',
};

export function StatsPanel({ totalRepos, totalStars, totalForks, languages, loading, languageStats }: StatsPanelProps) {
  // 计算语言排行
  const topLanguages = useMemo(() => {
    const total = Object.values(languageStats).reduce((sum, count) => sum + count, 0);
    return Object.entries(languageStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang, count]) => ({
        name: lang,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default,
      }));
  }, [languageStats]);

  return (
    <div className="space-y-3">
      {/* Top Languages - 基于实际数据 */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Top Languages</span>
        </div>
        <div className="panel-content">
          <div className="space-y-2">
            {topLanguages.length > 0 ? (
              topLanguages.map((lang, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }}></span>
                    <span className="text-[#c9d1d9]">{lang.name}</span>
                  </div>
                  <span className="font-mono text-[#8b949e]">{lang.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#484f58]">Loading...</div>
            )}
          </div>
        </div>
      </div>

      {/* Connections Panel */}
      <div className="panel">
        <div className="panel-header flex items-center justify-between">
          <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Connections</span>
          <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span>
        </div>
        <div className="panel-content space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#8b949e] text-xs">{totalStars.toLocaleString()}</span>
            <span className="text-[#c9d1d9] text-xs">Stars</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8b949e] text-xs">{totalForks.toLocaleString()}</span>
            <span className="text-[#c9d1d9] text-xs">Forks</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#8b949e] text-xs">{languages}</span>
            <span className="text-[#c9d1d9] text-xs">Languages</span>
          </div>
        </div>
      </div>

      {/* Trending Stats */}
      <div className="panel">
        <div className="panel-header">
          <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Trending Stats</span>
        </div>
        <div className="panel-content">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-[#21262d]">
                <td className="py-2 text-[#58a6ff]">REPOS</td>
                <td className="py-2 text-right font-mono text-[#c9d1d9]">{loading ? '--' : totalRepos}</td>
                <td className="py-2 text-right text-[#8b949e]">total</td>
              </tr>
              <tr className="border-b border-[#21262d]">
                <td className="py-2 text-[#3fb950]">STARS</td>
                <td className="py-2 text-right font-mono text-[#c9d1d9]">{loading ? '--' : totalStars.toLocaleString()}</td>
                <td className="py-2 text-right text-[#8b949e]">today</td>
              </tr>
              <tr className="border-b border-[#21262d]">
                <td className="py-2 text-[#a371f7]">FORKS</td>
                <td className="py-2 text-right font-mono text-[#c9d1d9]">{loading ? '--' : totalForks.toLocaleString()}</td>
                <td className="py-2 text-right text-[#8b949e]">total</td>
              </tr>
              <tr>
                <td className="py-2 text-[#d29922]">LANGS</td>
                <td className="py-2 text-right font-mono text-[#c9d1d9]">{loading ? '--' : languages}</td>
                <td className="py-2 text-right text-[#8b949e]">unique</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
