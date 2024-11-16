// Storage utility functions with mock data for development
const mockStorage = {
  preferences: {
    governance: true,
    security: true,
    airdrops: true,
    upgrades: true,
    theme: 'light'
  },
  notifications: [
    {
      id: '1',
      type: 'governance',
      title: 'New Governance Proposal',
      description: 'Vote on the latest protocol upgrade proposal',
      timestamp: Date.now() - 1000 * 60 * 30,
      priority: 'high',
      actionUrl: 'https://example.com/proposal'
    },
    {
      id: '2',
      type: 'security',
      title: 'Security Alert',
      description: 'Important security update available',
      timestamp: Date.now() - 1000 * 60 * 60,
      priority: 'high',
      actionUrl: 'https://example.com/security'
    },
    {
      id: '3',
      type: 'airdrop',
      title: 'New Token Airdrop',
      description: 'Claim your tokens from the latest protocol',
      timestamp: Date.now() - 1000 * 60 * 90,
      priority: 'medium',
      actionUrl: 'https://example.com/airdrop',
      airdropStatus: 'active',
      amount: '1000 XYZ',
      endDate: '2024-04-01'
    }
  ]
};

// Check if we're in the Chrome extension environment
const isExtension = typeof chrome !== 'undefined' && chrome.storage;

export const storage = {
  async get(key: string) {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.sync.get([key], (result) => {
          resolve(result[key]);
        });
      });
    }
    return mockStorage[key as keyof typeof mockStorage];
  },

  async set(key: string, value: any) {
    if (isExtension) {
      return new Promise<void>((resolve) => {
        chrome.storage.sync.set({ [key]: value }, () => {
          resolve();
        });
      });
    }
    mockStorage[key as keyof typeof mockStorage] = value;
    return Promise.resolve();
  },

  async getLocal(key: string) {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    }
    return mockStorage[key as keyof typeof mockStorage];
  },

  async setLocal(key: string, value: any) {
    if (isExtension) {
      return new Promise<void>((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    }
    mockStorage[key as keyof typeof mockStorage] = value;
    return Promise.resolve();
  }
};