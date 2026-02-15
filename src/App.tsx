import { useState, useEffect } from 'react';
import { Globe } from './components/Globe';
import { StatsPanel } from './components/StatsPanel';
import { TrendingList } from './components/TrendingList';
import { OpenRouterRanking } from './components/OpenRouterRanking';
import { FilterPanel } from './components/FilterPanel';
import { Header } from './components/Header';
import { AIUsageRanking } from './components/AIUsageRanking';
import { TrendingRepo } from './types';
import { fetchTrendingRepos } from './api';

function App() {
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('');
  const [since, setSince] = useState('daily');

  useEffect(() => {
    loadTrending();
  }, [language, since]);

  const loadTrending = async () => {
    setLoading(true);
    try {
      const data = await fetchTrendingRepos({ language, since });
      setRepos(data);
    } catch (error) {
      console.error('Failed to load trending:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalStars = repos.reduce((sum, repo) => sum + repo.starsSince, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];

  // 计算语言统计
  const languageStats: Record<string, number> = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header />
      
      <main className="p-4">
        {/* Top Section - Stats & Globe & Requests Table */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          {/* Left - Connections & Deployments */}
          <div className="col-span-12 lg:col-span-2">
            <div className="space-y-3">
              {/* Connections */}
              <div className="panel">
                <div className="panel-header">
                  <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Connections</span>
                </div>
                <div className="panel-content text-xs space-y-1">
                  <div className="text-[#c9d1d9]">{totalStars.toLocaleString()} <span className="text-[#8b949e]">Stars</span></div>
                  <div className="text-[#c9d1d9]">{totalForks.toLocaleString()} <span className="text-[#8b949e]">Forks</span></div>
                  <div className="text-[#c9d1d9]">{languages.length} <span className="text-[#8b949e]">Languages</span></div>
                </div>
              </div>

              {/* Deployments / Recent Activity */}
              <div className="panel">
                <div className="panel-header">
                  <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Recent</span>
                </div>
                <div className="panel-content text-[11px] space-y-2">
                  {repos.slice(0, 5).map((repo, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#58a6ff] truncate flex-1">{repo.repositoryName}</span>
                      <span className="text-[#484f58] flex-shrink-0">{Math.floor(Math.random() * 60)}m ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center - Globe */}
          <div className="col-span-12 lg:col-span-5">
            <div className="panel h-[320px] relative">
              <div className="absolute top-3 left-3 z-10">
                <div className="text-xs text-[#8b949e] uppercase tracking-wide">Global Activity</div>
              </div>
              <Globe repos={repos} />
            </div>
          </div>

          {/* Right - HTTP Requests Table */}
          <div className="col-span-12 lg:col-span-5">
            <div className="panel h-[320px] flex flex-col">
              <div className="panel-header flex items-center justify-between">
                <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Top Repositories</span>
                <span className="text-[10px] text-[#3fb950]">REQUESTS HANDLED</span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="data-table text-xs">
                  <thead>
                    <tr>
                      <th>Repository</th>
                      <th className="text-right">Stars</th>
                      <th className="text-right">Forks</th>
                      <th className="text-right">Today</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repos.slice(0, 10).map((repo, i) => (
                      <tr key={i}>
                        <td>
                          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">
                            {repo.username}/{repo.repositoryName.slice(0, 15)}
                          </a>
                        </td>
                        <td className="text-right font-mono text-[#c9d1d9]">{repo.totalStars?.toLocaleString() || '--'}</td>
                        <td className="text-right font-mono text-[#c9d1d9]">{repo.forks.toLocaleString()}</td>
                        <td className="text-right font-mono text-[#d29922]">+{repo.starsSince.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mini chart */}
              <div className="p-3 border-t border-[#21262d]">
                <div className="flex items-end gap-[2px] h-8">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-[#3fb950]" 
                      style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.5 + Math.random() * 0.5 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-[#484f58]">
                  <span>0ms LATENCY</span>
                  <span>{(totalStars / 10).toFixed(0)} REQUESTS/S</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div>
          <FilterPanel 
            language={language}
            since={since}
            onLanguageChange={setLanguage}
            onSinceChange={setSince}
          />
        </div>

        {/* Filter 框下的4个等高面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Stats Panel - 固定高度 450px */}
          <div className="panel h-[450px] flex flex-col overflow-hidden">
            <div className="panel-header">
              <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">Statistics</span>
            </div>
            <div className="flex-1 overflow-auto">
              <StatsPanel
                totalRepos={repos.length}
                totalStars={totalStars}
                totalForks={totalForks}
                languages={languages.length}
                loading={loading}
                languageStats={languageStats}
              />
            </div>
          </div>

          {/* AI Usage Ranking Panel - 固定高度 450px */}
          <div className="panel h-[450px] flex flex-col">
            <div className="panel-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">AI Tools Ranking</span>
              </div>
              <span className="px-2 py-0.5 text-[9px] bg-[#58a6ff]/10 text-[#58a6ff] rounded">Global</span>
            </div>
            <div className="flex-1 overflow-auto">
              <AIUsageRanking />
            </div>
          </div>

          {/* GitHub Trending Repos - 固定高度 450px */}
          <div className="panel h-[450px] flex flex-col">
            <div className="panel-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#d29922]"></div>
                <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">GitHub Trending</span>
              </div>
              <span className="text-[10px] text-[#484f58]">{repos.length} repos</span>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <TrendingList repos={repos} loading={loading} />
            </div>
          </div>

          {/* AI Models - OpenRouter Rankings */}
          <div className="panel h-[450px] flex flex-col">
            <div className="panel-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#58a6ff]"></div>
                <span className="text-xs font-medium text-[#8b949e] uppercase tracking-wide">AI Models</span>
              </div>
              <span className="px-2 py-0.5 text-[9px] bg-[#58a6ff]/10 text-[#58a6ff] rounded">OpenRouter</span>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <OpenRouterRanking />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
