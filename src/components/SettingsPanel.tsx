import React from 'react';
import { Bell, Shield, Vote, Gift, Zap, Sun, Moon, LogOut } from 'lucide-react';
import { NotificationPreferences } from '../types';

interface SettingsPanelProps {
  preferences: NotificationPreferences;
  onChange: (preferences: NotificationPreferences) => void;
  onLogout: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ preferences, onChange, onLogout }) => {
  const handleToggle = (key: keyof NotificationPreferences) => {
    onChange({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const toggleTheme = () => {
    onChange({
      ...preferences,
      theme: preferences.theme === 'light' ? 'dark' : 'light'
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {preferences.theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
              <span className="font-medium">Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {preferences.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-4">
          Notification Preferences
        </h3>
        
        <SettingToggle
          icon={<Vote className="w-5 h-5 text-blue-500" />}
          title="Governance Updates"
          description="Proposals, voting periods, and results"
          checked={preferences.governance}
          onChange={() => handleToggle('governance')}
        />
        
        <SettingToggle
          icon={<Shield className="w-5 h-5 text-red-500" />}
          title="Security Alerts"
          description="Critical security updates and warnings"
          checked={preferences.security}
          onChange={() => handleToggle('security')}
        />
        
        <SettingToggle
          icon={<Gift className="w-5 h-5 text-purple-500" />}
          title="Airdrop Notifications"
          description="New airdrops and claim periods"
          checked={preferences.airdrops}
          onChange={() => handleToggle('airdrops')}
        />
        
        <SettingToggle
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
          title="Protocol Upgrades"
          description="Major updates and protocol changes"
          checked={preferences.upgrades}
          onChange={() => handleToggle('upgrades')}
        />

        <div className="mt-8">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  title,
  description,
  checked,
  onChange
}) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    </label>
  </div>
);

export default SettingsPanel;