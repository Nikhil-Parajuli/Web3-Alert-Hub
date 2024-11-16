import React from 'react';
import { Bell, Shield, Vote, Gift, Zap, ExternalLink, Trash2, Calendar } from 'lucide-react';
import { Notification } from '../types';

interface NotificationListProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onDelete }) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-400">
        <Bell className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No notifications yet</p>
        <p className="text-sm">Stay tuned for Web3 updates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification.id} 
          notification={notification} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const NotificationCard: React.FC<{ 
  notification: Notification; 
  onDelete: (id: string) => void;
}> = ({ notification, onDelete }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'governance':
        return <Vote className="w-6 h-6 text-blue-500" />;
      case 'security':
        return <Shield className="w-6 h-6 text-red-500" />;
      case 'airdrop':
        return <Gift className="w-6 h-6 text-purple-500" />;
      default:
        return <Zap className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleViewDetails = () => {
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">{notification.title}</h3>
            {notification.type === 'airdrop' && notification.airdropStatus && (
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(notification.airdropStatus)}`}>
                {notification.airdropStatus}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.description}</p>
          
          {notification.type === 'airdrop' && (
            <div className="mt-2 space-y-1">
              {notification.amount && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Amount: {notification.amount}
                </p>
              )}
              {notification.endDate && (
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Ends: {new Date(notification.endDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              {notification.actionUrl && (
                <button 
                  onClick={handleViewDetails}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Details
                </button>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <button
              onClick={() => onDelete(notification.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
              title="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;