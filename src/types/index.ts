export interface TrendingRepo {
  rank: number;
  username: string;
  repositoryName: string;
  url: string;
  description: string;
  language: string;
  languageColor: string;
  totalStars: number;
  forks: number;
  starsSince: number;
  since: string;
  builtBy: Array<{
    username: string;
    avatar: string;
  }>;
}

export interface TrendingDeveloper {
  rank: number;
  username: string;
  name: string;
  avatar: string;
  url: string;
  sponsorUrl?: string;
  popularRepository?: {
    repositoryName: string;
    description: string;
    url: string;
  };
}

export interface Language {
  name: string;
  value: string;
}
