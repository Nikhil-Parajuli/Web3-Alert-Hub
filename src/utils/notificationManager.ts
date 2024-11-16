import { storage } from './storage';
import type { Notification } from '../types';

export const notificationManager = {
  async addNotification(notification: Partial<Notification>) {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: notification.type || 'governance',
        title: notification.title || '',
        description: notification.description || '',
        priority: notification.priority || 'medium'
      } as Notification;

      const existingNotifications = await storage.getLocal('notifications') || [];
      const updatedNotifications = [newNotification, ...existingNotifications];
      
      await storage.setLocal('notifications', updatedNotifications);
      return true;
    } catch (error) {
      console.error('Error adding notification:', error);
      return false;
    }
  }
};

export const addNewNotification = async (notification: Partial<Notification>) => {
  return notificationManager.addNotification(notification);
};