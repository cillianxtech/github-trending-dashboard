import { TrendingRepo } from '../types';

interface TrendingListProps {
  repos: TrendingRepo[];
  loading: boolean;
}

export function TrendingList({ repos, loading }: TrendingListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="p-3 rounded bg-[#0d1117] border border-[#21262d] animate-pulse">
            <div className="h-3 bg-[#21262d] rounded w-3/4 mb-2" />
            <div className="h-2 bg-[#21262d] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const displayRepos = repos.slice(0, 10);

  return (
    <div className="space-y-2">
      {displayRepos.map((repo, index) => (
        <a
          key={`${repo.username}/${repo.repositoryName}`}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2.5 rounded bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/50 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono" style={{ color: index < 3 ? '#d29922' : '#484f58' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-[#8b949e]">
              {repo.language}
            </span>
          </div>
          <div className="text-xs text-[#58a6ff] truncate mb-1 group-hover:underline">
            {repo.repositoryName}
          </div>
          <p className="text-[10px] text-[#8b949e] line-clamp-1 mb-1">
            {repo.description || 'No description'}
          </p>
          <div className="flex items-center gap-2 text-[9px] text-[#8b949e]">
            <span className="text-[#d29922]">★ {repo.starsSince.toLocaleString()}</span>
            <span className="text-[#a371f7]">⟳ {repo.forks.toLocaleString()}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
