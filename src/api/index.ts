import { TrendingRepo, TrendingDeveloper, Language } from '../types';

// 使用 GitHub 官方 API
const API_BASE = 'https://api.github.com';

interface FetchOptions {
  language?: string;
  since?: string;
  spoken_language?: string;
}

// 语言颜色映射
const LANGUAGE_COLORS: Record<string, string> = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#2b7489',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'C++': '#f34b7d',
  'C': '#555555',
  'C#': '#239120',
  'PHP': '#4F5D95',
  'Ruby': '#701516',
  'Swift': '#ffac45',
  'Kotlin': '#F18E33',
  'Vue': '#2c3e50',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Jupyter Notebook': '#DA5B0B',
};

// AI 相关的关键词和技术标签
const AI_KEYWORDS = [
  'machine-learning',
  'deep-learning',
  'llm',
  'large-language-model',
  'transformer',
  'neural-network',
  'nlp',
  'computer-vision',
  'artificial-intelligence'
];

const AI_FRAMEWORKS = [
  'pytorch',
  'tensorflow',
  'transformers',
  'langchain',
  'huggingface',
  'openai',
  'anthropic',
  'llama',
  'mistral'
];

function getDateRange(since: string): string {
  const now = new Date();
  let date: Date;
  
  switch (since) {
    case 'weekly':
      date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default: // daily
      date = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
  }
  
  return date.toISOString().split('T')[0];
}

export async function fetchTrendingRepos(options: FetchOptions = {}): Promise<TrendingRepo[]> {
  try {
    // 构建搜索查询
    const dateRange = getDateRange(options.since || 'daily');
    let query = `created:>${dateRange}`;
    
    if (options.language) {
      query += ` language:${options.language}`;
    }
    
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '30'
    });
    
    const response = await fetch(`${API_BASE}/search/repositories?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 转换数据格式以匹配我们的类型
    return data.items.map((repo: any, index: number) => ({
      rank: index + 1,
      username: repo.owner.login,
      repositoryName: repo.name,
      url: repo.html_url,
      description: repo.description || '',
      language: repo.language || '',
      languageColor: LANGUAGE_COLORS[repo.language] || '#8b949e',
      totalStars: repo.stargazers_count,
      forks: repo.forks_count,
      starsSince: Math.floor(repo.stargazers_count * 0.1), // 估算新增 stars
      since: options.since || 'daily',
      builtBy: [], // GitHub API 不直接提供这个信息
    }));
  } catch (error) {
    console.error('Error fetching trending repos:', error);
    // 返回一些示例数据以便测试
    return generateMockData();
  }
}

// 生成模拟数据用于测试
function generateMockData(): TrendingRepo[] {
  const mockRepos = [
    {
      rank: 1,
      username: 'microsoft',
      repositoryName: 'vscode',
      url: 'https://github.com/microsoft/vscode',
      description: 'Visual Studio Code',
      language: 'TypeScript',
      languageColor: '#2b7489',
      totalStars: 162000,
      forks: 28500,
      starsSince: 245,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 2,
      username: 'facebook',
      repositoryName: 'react',
      url: 'https://github.com/facebook/react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      totalStars: 227000,
      forks: 46300,
      starsSince: 189,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 3,
      username: 'vercel',
      repositoryName: 'next.js',
      url: 'https://github.com/vercel/next.js',
      description: 'The React Framework',
      language: 'JavaScript',
      languageColor: '#f1e05a',
      totalStars: 124000,
      forks: 26400,
      starsSince: 156,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 4,
      username: 'python',
      repositoryName: 'cpython',
      url: 'https://github.com/python/cpython',
      description: 'The Python programming language',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 62000,
      forks: 29800,
      starsSince: 134,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 5,
      username: 'golang',
      repositoryName: 'go',
      url: 'https://github.com/golang/go',
      description: 'The Go programming language',
      language: 'Go',
      languageColor: '#00ADD8',
      totalStars: 123000,
      forks: 17500,
      starsSince: 98,
      since: 'daily',
      builtBy: []
    }
  ];
  
  return mockRepos;
}

export async function fetchTrendingDevelopers(options: FetchOptions = {}): Promise<TrendingDeveloper[]> {
  const params = new URLSearchParams();
  if (options.language) params.append('language', options.language);
  if (options.since) params.append('since', options.since);
  
  try {
    const response = await fetch(`${API_BASE}/developers?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch trending developers');
    }
    const data = await response.json();
    
    return data.map((dev: Record<string, unknown>, index: number) => ({
      rank: index + 1,
      username: dev.username || '',
      name: dev.name || '',
      avatar: dev.avatar || '',
      url: dev.url || `https://github.com/${dev.username}`,
      sponsorUrl: dev.sponsorUrl as string | undefined,
      popularRepository: dev.repo ? {
        repositoryName: (dev.repo as Record<string, unknown>).name as string || '',
        description: (dev.repo as Record<string, unknown>).description as string || '',
        url: (dev.repo as Record<string, unknown>).url as string || '',
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching trending developers:', error);
    return [];
  }
}

export async function fetchAITrendingRepos(options: FetchOptions = {}): Promise<TrendingRepo[]> {
  try {
    const dateRange = getDateRange(options.since || 'daily');

    // 构建 AI 相关的搜索查询
    const keywordQuery = AI_KEYWORDS.join(' OR ');
    const frameworkQuery = AI_FRAMEWORKS.join(' OR ');

    let query = `created:>${dateRange} (${keywordQuery} OR ${frameworkQuery})`;

    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '30'
    });

    const response = await fetch(`${API_BASE}/search/repositories?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return data.items.map((repo: any, index: number) => ({
      rank: index + 1,
      username: repo.owner.login,
      repositoryName: repo.name,
      url: repo.html_url,
      description: repo.description || '',
      language: repo.language || '',
      languageColor: LANGUAGE_COLORS[repo.language] || '#8b949e',
      totalStars: repo.stargazers_count,
      forks: repo.forks_count,
      starsSince: Math.floor(repo.stargazers_count * 0.1),
      since: options.since || 'daily',
      builtBy: [],
    }));
  } catch (error) {
    console.error('Error fetching AI trending repos:', error);
    return generateMockAIData();
  }
}

// 生成模拟 AI 数据用于测试
function generateMockAIData(): TrendingRepo[] {
  const mockAIRepos = [
    {
      rank: 1,
      username: 'openai',
      repositoryName: 'gpt-4',
      url: 'https://github.com/openai/gpt-4',
      description: 'OpenAI GPT-4 Language Model',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 45000,
      forks: 8900,
      starsSince: 450,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 2,
      username: 'huggingface',
      repositoryName: 'transformers',
      url: 'https://github.com/huggingface/transformers',
      description: 'Transformers: State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX.',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 132000,
      forks: 26400,
      starsSince: 1320,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 3,
      username: 'pytorch',
      repositoryName: 'pytorch',
      url: 'https://github.com/pytorch/pytorch',
      description: 'Tensors and Dynamic neural networks',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 78000,
      forks: 21500,
      starsSince: 780,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 4,
      username: 'tensorflow',
      repositoryName: 'tensorflow',
      url: 'https://github.com/tensorflow/tensorflow',
      description: 'An Open Source Machine Learning Framework',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 185000,
      forks: 74200,
      starsSince: 1850,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 5,
      username: 'langchain-ai',
      repositoryName: 'langchain',
      url: 'https://github.com/langchain-ai/langchain',
      description: 'Building applications with LLMs',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 89000,
      forks: 14200,
      starsSince: 890,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 6,
      username: 'microsoft',
      repositoryName: 'semantic-kernel',
      url: 'https://github.com/microsoft/semantic-kernel',
      description: 'Integrate cutting-edge LLM technology quickly and easily into your apps',
      language: 'C#',
      languageColor: '#178600',
      totalStars: 21000,
      forks: 3200,
      starsSince: 210,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 7,
      username: 'openai',
      repositoryName: 'whisper',
      url: 'https://github.com/openai/whisper',
      description: 'Robust Speech Recognition via Large-Scale Weak Supervision',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 58000,
      forks: 6800,
      starsSince: 580,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 8,
      username: 'compvis',
      repositoryName: 'stable-diffusion',
      url: 'https://github.com/CompVis/stable-diffusion',
      description: 'A latent text-to-image diffusion model',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 65000,
      forks: 9500,
      starsSince: 650,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 9,
      username: 'google',
      repositoryName: 'jax',
      url: 'https://github.com/google/jax',
      description: 'Composable transformations of Python+NumPy programs',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 28000,
      forks: 2500,
      starsSince: 280,
      since: 'daily',
      builtBy: []
    },
    {
      rank: 10,
      username: 'anthropics',
      repositoryName: 'anthropic-sdk-python',
      url: 'https://github.com/anthropics/anthropic-sdk-python',
      description: 'Anthropic API Python SDK',
      language: 'Python',
      languageColor: '#3572A5',
      totalStars: 8500,
      forks: 1100,
      starsSince: 85,
      since: 'daily',
      builtBy: []
    }
  ];

  return mockAIRepos;
}

export async function fetchLanguages(): Promise<Language[]> {
  // 返回常用编程语言列表（静态数据，因为语言列表基本固定）
  return [
    { name: 'All Languages', value: '' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' },
    { name: 'C++', value: 'c++' },
    { name: 'C', value: 'c' },
    { name: 'C#', value: 'c#' },
    { name: 'PHP', value: 'php' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Swift', value: 'swift' },
    { name: 'Kotlin', value: 'kotlin' },
    { name: 'Vue', value: 'vue' },
    { name: 'Shell', value: 'shell' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'Jupyter Notebook', value: 'jupyter-notebook' },
  ];
}

// AI 工具排行数据类型
export interface AITool {
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
  category: string;
}

// 根据关键词确定分类
function getCategory(name: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  const categories = {
    'LLM': ['gpt', 'llm', 'openai', 'claude', 'bloom', 'mpt', 'vicuna', 'alpaca'],
    'Framework': ['torch', 'tensor', 'jax', 'keras', 'mxnet', 'paddle', 'mindspore', 'caffe', 'theano'],
    'NLP': ['nlp', 'transformer', 'bert', 'gpt', 'token', 'embedding', 'language model'],
    'CV': ['vision', 'detection', 'segmentation', 'recognition', 'image', 'video', 'yolo', 'stable diffusion'],
    'Audio': ['speech', 'audio', 'voice', 'tts', 'asr', 'whisper'],
    'Reinforcement': ['reinforcement', 'gym', 'agent', 'environment'],
    'Dataset': ['dataset', 'data', 'benchmark', 'corpus'],
    'Tool': ['tool', 'utility', 'helper', 'library', 'sdk'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword) || lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Other';
}

// 计算相对时间
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffHours < 1) return '< 1h';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return '1y+ ago';
}

export async function fetchAIToolsRanking(): Promise<AITool[]> {
  try {
    // 构建搜索查询 - 搜索AI相关的热门仓库
    const keywords = AI_KEYWORDS.slice(0, 6).join(' OR ');
    const frameworks = AI_FRAMEWORKS.slice(0, 4).join(' OR ');

    const query = `(${keywords}) OR (${frameworks})`;

    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '15'
    });

    const response = await fetch(`${API_BASE}/search/repositories?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error('No items returned from GitHub API');
    }

    // 转换数据
    const tools: AITool[] = data.items.map((repo: any) => ({
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description || '',
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      url: repo.html_url,
      updatedAt: repo.updated_at,
      category: getCategory(repo.name, repo.description || ''),
    }));

    // 按 stars 排序并取前 10 个
    return tools.sort((a, b) => b.stars - a.stars).slice(0, 10);
  } catch (error) {
    console.error('Error fetching AI tools ranking:', error);
    // 返回静态数据作为fallback
    return getStaticAITools();
  }
}

// 静态数据作为fallback
function getStaticAITools(): AITool[] {
  return [
    {
      name: 'tensorflow',
      owner: 'tensorflow',
      description: 'An Open Source Machine Learning Framework for Everyone',
      language: 'C++',
      stars: 185000,
      forks: 74200,
      url: 'https://github.com/tensorflow/tensorflow',
      updatedAt: '2024-01-15T10:30:00Z',
      category: 'Framework',
    },
    {
      name: 'pytorch',
      owner: 'pytorch',
      description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration',
      language: 'Python',
      stars: 78000,
      forks: 21500,
      url: 'https://github.com/pytorch/pytorch',
      updatedAt: '2024-01-14T15:20:00Z',
      category: 'Framework',
    },
    {
      name: 'transformers',
      owner: 'huggingface',
      description: 'Transformers: State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX',
      language: 'Python',
      stars: 162000,
      forks: 28500,
      url: 'https://github.com/huggingface/transformers',
      updatedAt: '2024-01-15T08:45:00Z',
      category: 'NLP',
    },
    {
      name: 'langchain',
      owner: 'langchain-ai',
      description: 'Building applications with LLMs through composability',
      language: 'Python',
      stars: 92000,
      forks: 16500,
      url: 'https://github.com/langchain-ai/langchain',
      updatedAt: '2024-01-14T20:10:00Z',
      category: 'LLM',
    },
    {
      name: 'keras',
      owner: 'keras-team',
      description: 'Deep Learning for Humans',
      language: 'Python',
      stars: 61000,
      forks: 19500,
      url: 'https://github.com/keras-team/keras',
      updatedAt: '2024-01-13T14:25:00Z',
      category: 'Framework',
    },
    {
      name: 'stable-diffusion',
      owner: 'Stability-AI',
      description: 'A latent text-to-image diffusion model capable of generating photo-realistic images',
      language: 'Python',
      stars: 32500,
      forks: 5200,
      url: 'https://github.com/Stability-AI/stable-diffusion',
      updatedAt: '2024-01-12T18:30:00Z',
      category: 'CV',
    },
    {
      name: 'yolov5',
      owner: 'ultralytics',
      description: 'YOLOv5 in PyTorch > ONNX > CoreML > TFLite',
      language: 'Python',
      stars: 42000,
      forks: 15000,
      url: 'https://github.com/ultralytics/yolov5',
      updatedAt: '2024-01-11T12:15:00Z',
      category: 'CV',
    },
    {
      name: 'diffusers',
      owner: 'huggingface',
      description: '🤗 Diffusers: State-of-the-art pretrained diffusion models for image and audio generation',
      language: 'Python',
      stars: 45000,
      forks: 8900,
      url: 'https://github.com/huggingface/diffusers',
      updatedAt: '2024-01-10T16:40:00Z',
      category: 'CV',
    },
    {
      name: 'llama',
      owner: 'facebookresearch',
      description: 'Inference code for LLaMA models',
      language: 'Python',
      stars: 52000,
      forks: 8500,
      url: 'https://github.com/facebookresearch/llama',
      updatedAt: '2024-01-09T09:50:00Z',
      category: 'LLM',
    },
    {
      name: 'openai-cookbook',
      owner: 'openai',
      description: 'Examples and guides for using the OpenAI API',
      language: 'Python',
      stars: 58000,
      forks: 9200,
      url: 'https://github.com/openai/openai-cookbook',
      updatedAt: '2024-01-08T13:20:00Z',
      category: 'LLM',
    },
  ];
}

