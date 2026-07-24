export interface TradeRecord {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'deposit';
  lots?: number;
  openPrice?: number;
  closePrice?: number;
  profit: number;
  date: string;
}

export type ViewType = 'dashboard' | 'calendar' | 'history' | 'compounding' | 'ai';

export interface WeeklyDayStat {
  key: string;
  label: string;
  dayIndex: number;
  profit: number;
  hasTraded: boolean;
}

export interface Stats {
  totalProfit: number;
  balance: number;
  wRate: number;
  tradeCount: number;
  maxDrawdown: number;
  matrix: Record<string, number[]>; // Year -> 12 months array
  calendarData: Record<string, { profit: number; tradesList: { profit: number }[] }>;
  baggerMilestones: Record<string, number[]>;
  eData: { date: string; balance: number }[];
  weeklyStats: WeeklyDayStat[];
  weeklySummary: { netProfit: number };
}

export interface Quote {
  quote: string;
  author: string;
}
