/// <reference types="vite/client" />

interface Window {
    chrome?: {
      runtime: any;
      storage: any;
      notifications: any;
      alarms: any;
      tabs: any;
    };
  }