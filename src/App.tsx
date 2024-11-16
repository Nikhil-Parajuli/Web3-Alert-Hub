import React, { useState, useEffect } from 'react';
import { Bell, Settings, Wallet, Shield, Vote, Gift, Home, Sun, Moon } from 'lucide-react';
import NotificationList from './components/NotificationList';
import SettingsPanel from './components/SettingsPanel';
import WalletPanel from './components/WalletPanel';
import AirdropPanel from './components/AirdropPanel';
import DashboardPanel from './components/DashboardPanel';
import LoginPanel from './components/LoginPanel';
import { Notification, NotificationPreferences, Theme } from './types';
import { storage } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings' | 'wallet' | 'airdrops' | 'dashboard' | 'login'>('login');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    governance: true,
    security: true,
    airdrops: true,
    upgrades: true,
    theme: 'light'
  });
  const [filteredType, setFilteredType] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPreferences = await storage.get('preferences');
        if (savedPreferences) {
          setPreferences(savedPreferences);
          document.documentElement.classList.toggle('dark', savedPreferences.theme === 'dark');
        }

        const savedNotifications = await storage.getLocal('notifications');
        if (savedNotifications) {
          setNotifications(savedNotifications);
          setFilteredNotifications(savedNotifications);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Update filtered notifications when notifications or filter type changes
  useEffect(() => {
    if (filteredType) {
      const filtered = notifications.filter(n => n.type === filteredType.toLowerCase());
      setFilteredNotifications(filtered);
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filteredType]);

  const handlePreferencesChange = async (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    await storage.set('preferences', newPreferences);
    document.documentElement.classList.toggle('dark', newPreferences.theme === 'dark');
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setActiveTab('notifications');
    } else if (username && password) {
      setIsAdmin(false);
      setIsLoggedIn(true);
      setActiveTab('notifications');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    setActiveTab('login');
  };

  const filterNotifications = (type: string | null) => {
    setFilteredType(type);
    setActiveTab('notifications');
  };

  const handleDeleteNotification = async (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    await storage.setLocal('notifications', updatedNotifications);
  };

  const handleNotificationAdded = async () => {
    const savedNotifications = await storage.getLocal('notifications');
    setNotifications(savedNotifications || []);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPanel onLogin={handleLogin} />;
    }

    switch (activeTab) {
      case 'settings':
        return <SettingsPanel preferences={preferences} onChange={handlePreferencesChange} onLogout={handleLogout} />;
      case 'wallet':
        return <WalletPanel onClose={() => setActiveTab('notifications')} />;
      case 'airdrops':
        return <AirdropPanel notifications={notifications.filter(n => n.type === 'airdrop')} onClose={() => setActiveTab('notifications')} />;
      case 'dashboard':
        return isAdmin ? (
          <DashboardPanel 
            onClose={() => setActiveTab('notifications')} 
            onNotificationAdded={handleNotificationAdded}
          />
        ) : null;
      default:
        return (
          <NotificationList 
            notifications={filteredNotifications}
            onDelete={handleDeleteNotification}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-[400px] h-[600px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="w-[400px] h-[600px] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 dark:bg-indigo-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6" />
          <h1 className="text-xl font-bold">Web3 Notification Hub</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-900 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setActiveTab('notifications');
              setFilteredType(null);
            }}
            className="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-900 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-900 rounded-full transition-colors"
              title="Dashboard"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Quick Actions */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2">
        <div className="grid grid-cols-5 gap-1">
          <QuickAction 
            icon={<Home className="w-5 h-5" />} 
            label="All" 
            onClick={() => filterNotifications(null)} 
            active={filteredType === null}
          />
          <QuickAction 
            icon={<Vote className="w-5 h-5" />} 
            label="Governance" 
            onClick={() => filterNotifications('governance')} 
            active={filteredType === 'governance'}
          />
          <QuickAction 
            icon={<Shield className="w-5 h-5" />} 
            label="Security" 
            onClick={() => filterNotifications('security')} 
            active={filteredType === 'security'}
          />
          <QuickAction 
            icon={<Gift className="w-5 h-5" />} 
            label="Airdrops" 
            onClick={() => setActiveTab('airdrops')} 
            active={activeTab === 'airdrops'}
          />
          <QuickAction 
            icon={<Wallet className="w-5 h-5" />} 
            label="Wallet" 
            onClick={() => setActiveTab('wallet')} 
            active={activeTab === 'wallet'}
          />
        </div>
      </footer>
    </div>
  );
}

const QuickAction = ({ 
  icon, 
  label, 
  onClick,
  active = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void;
  active?: boolean;
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default App;