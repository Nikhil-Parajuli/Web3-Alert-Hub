export interface Notification {
  id: string;
  type: 'governance' | 'security' | 'airdrop' | 'upgrade';
  title: string;
  description: string;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  // Additional fields for airdrops
  airdropStatus?: 'active' | 'upcoming' | 'expired';
  amount?: string;
  endDate?: string;
}

export type Theme = 'light' | 'dark';

export interface NotificationPreferences {
  governance: boolean;
  security: boolean;
  airdrops: boolean;
  upgrades: boolean;
  theme: Theme;
}

export interface Protocol {
  id: string;
  name: string;
  enabled: boolean;
  types: Array<Notification['type']>;
}