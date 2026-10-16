export type Category = 'Sports' | 'Crypto' | 'Politics' | 'Business' | 'Entertainment';

export type MarketOutcome = 'YES' | 'NO';

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  category: Category;
  outcome: MarketOutcome;
  shares: number;
  avgCost: number;
  lastPrice: number;
}

export interface Order {
  id: string;
  marketTitle: string;
  outcome: MarketOutcome;
  type: 'LIMIT' | 'MARKET';
  side: 'BUY' | 'SELL';
  shares: number;
  price: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BUY' | 'SELL' | 'RESOLUTION_PAYOUT';
  amount: number;
  asset: string;
  description: string;
  txHash: string;
  timestamp: string;
}

export interface Resolution {
  id: string;
  marketTitle: string;
  winningOutcome: MarketOutcome;
  yourOutcome: MarketOutcome;
  payout: number;
  date: string;
  claimed: boolean;
}

export interface Market {
  id: string;
  title: string;
  category: Category;
  yesPrice: number;
  noPrice: number;
  volume24h: number;
  liquidity: number;
  endDate: string;
  description: string;
}

export interface UserProfile {
  username: string;
  walletAddress: string;
  avatar: string;
  followers: number;
  following: number;
  isXLinked: boolean;
  xHandle?: string;
  bio?: string;
}
