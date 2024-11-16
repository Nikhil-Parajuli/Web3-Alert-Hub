import React, { useState } from 'react';
import { ArrowLeft, Plus, Bell } from 'lucide-react';
import { addNewNotification } from '../utils/notificationManager';
import type { Notification } from '../types';

interface DashboardPanelProps {
  onClose: () => void;
  onNotificationAdded: () => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ onClose, onNotificationAdded }) => {
  const [formData, setFormData] = useState({
    type: 'governance',
    title: '',
    description: '',
    priority: 'medium',
    actionUrl: '',
    airdropStatus: 'active',
    amount: '',
    endDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { type, title, description, priority, actionUrl, airdropStatus, amount, endDate } = formData;
    
    const notification: Partial<Notification> = {
      type: type as Notification['type'],
      title,
      description,
      priority: priority as Notification['priority'],
      actionUrl: actionUrl || undefined
    };

    if (type === 'airdrop') {
      notification.airdropStatus = airdropStatus as Notification['airdropStatus'];
      notification.amount = amount;
      notification.endDate = endDate;
    }

    await addNewNotification(notification);
    onNotificationAdded();

    // Reset form
    setFormData({
      type: 'governance',
      title: '',
      description: '',
      priority: 'medium',
      actionUrl: '',
      airdropStatus: 'active',
      amount: '',
      endDate: ''
    });

    alert('Notification added successfully!');
  };

  const pushNotification = async (type: string) => {
    let notificationData = {
      title: '',
      message: '',
      icon: '/icons/icon128.png'
    };

    switch (type) {
      case 'governance':
        notificationData = {
          title: 'New Governance Update',
          message: 'Important: New governance proposal available for voting',
          icon: '/icons/icon128.png'
        };
        break;
      case 'security':
        notificationData = {
          title: 'Security Alert',
          message: 'Critical security update required',
          icon: '/icons/icon128.png'
        };
        break;
      case 'airdrop':
        notificationData = {
          title: 'New Airdrop Available',
          message: 'A new token airdrop is available for claiming',
          icon: '/icons/icon128.png'
        };
        break;
      case 'upgrade':
        notificationData = {
          title: 'Protocol Upgrade',
          message: 'New protocol upgrade announcement',
          icon: '/icons/icon128.png'
        };
        break;
    }

    // First, request notification permission if not granted
    if (window.Notification && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Please enable notifications to use this feature');
        return;
      }
    }

    // Create browser notification
    if (window.Notification) {
      new Notification(notificationData.title, {
        body: notificationData.message,
        icon: notificationData.icon
      });
    }

    // Add to notification list
    const notification: Partial<Notification> = {
      type: type as Notification['type'],
      title: notificationData.title,
      description: notificationData.message,
      priority: 'high',
      timestamp: Date.now()
    };

    await addNewNotification(notification);
    onNotificationAdded();
  };

  const QuickPushButton = ({ type, label }: { type: string; label: string }) => (
    <button
      onClick={() => pushNotification(type)}
      className="flex items-center justify-center space-x-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      <Bell className="w-4 h-4" />
      <span>Push {label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={onClose} className="mr-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      {/* Quick Push Notification Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Quick Push Notifications</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickPushButton type="governance" label="Governance" />
          <QuickPushButton type="security" label="Security" />
          <QuickPushButton type="airdrop" label="Airdrop" />
          <QuickPushButton type="upgrade" label="Upgrade" />
        </div>
      </div>

      {/* Custom Notification Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Create Custom Notification</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="governance">Governance</option>
              <option value="security">Security</option>
              <option value="airdrop">Airdrop</option>
              <option value="upgrade">Upgrade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {formData.type === 'airdrop' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={formData.airdropStatus}
                  onChange={(e) => setFormData({ ...formData, airdropStatus: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 1000 XYZ"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Action URL (optional)</label>
            <input
              type="url"
              value={formData.actionUrl}
              onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Notification
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPanel;