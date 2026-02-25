import { useState, useEffect } from 'react';
import { ExternalLink, Zap } from 'lucide-react';

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
  };
}

export function OpenRouterRanking() {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // 按上下文长度排序，取前10个
        const sortedModels = data.data
          .sort((a: OpenRouterModel, b: OpenRouterModel) => b.context_length - a.context_length)
          .slice(0, 10);
        setModels(sortedModels);
      } catch (err) {
        console.error('Failed to load OpenRouter models:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num === 0) return 'Free';
    return `$${(num * 1000000).toFixed(2)}/M`;
  };

  const formatContext = (length: number) => {
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="p-2 rounded bg-[#0d1117] border border-[#21262d] animate-pulse">
            <div className="h-3 bg-[#21262d] rounded w-3/4 mb-2" />
            <div className="h-2 bg-[#21262d] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <div className="text-[#8b949e] text-xs mb-3">Unable to load OpenRouter data</div>
        <a 
          href="https://openrouter.ai/rankings" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#58a6ff]/10 text-[#58a6ff] rounded text-xs hover:bg-[#58a6ff]/20 transition-colors"
        >
          <span>View on OpenRouter</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-2 space-y-1.5">
        {models.map((model, index) => (
          <a
            key={model.id}
            href={`https://openrouter.ai/${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-2 rounded bg-[#0d1117] border border-[#21262d] hover:border-[#58a6ff]/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[10px] font-mono w-4 flex-shrink-0" style={{ color: index < 3 ? '#58a6ff' : '#484f58' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-medium text-[#c9d1d9] truncate group-hover:text-[#58a6ff]">
                  {model.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[9px] text-[#3fb950] font-mono">
                  {formatContext(model.context_length)} ctx
                </span>
              </div>
            </div>
            <p className="text-[9px] text-[#8b949e] line-clamp-1 mb-1 pl-6">
              {model.description || 'No description available'}
            </p>
            <div className="flex items-center justify-between pl-6">
              <div className="flex items-center gap-2 text-[8px]">
                <span className="text-[#d29922]">
                  In: {formatPrice(model.pricing.prompt)}
                </span>
                <span className="text-[#58a6ff]">
                  Out: {formatPrice(model.pricing.completion)}
                </span>
              </div>
              <ExternalLink className="w-2.5 h-2.5 text-[#484f58] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#21262d] bg-[#0d1117]/50">
        <a 
          href="https://openrouter.ai/rankings" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-[9px] text-[#58a6ff] hover:underline"
        >
          <Zap className="w-2.5 h-2.5" />
          <span>View Full Rankings on OpenRouter</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
