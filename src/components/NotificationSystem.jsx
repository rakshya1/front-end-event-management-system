import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Mock notification types for Nepal context
  const notificationTypes = {
    REGISTRATION_SUCCESS: 'registration_success',
    PAYMENT_SUCCESS: 'payment_success',
    EVENT_UPDATE: 'event_update',
    EVENT_REMINDER: 'event_reminder',
    EVENT_CANCELLED: 'event_cancelled',
    FESTIVAL_ALERT: 'festival_alert',
    WEATHER_WARNING: 'weather_warning',
    NEW_EVENT: 'new_event'
  };

  useEffect(() => {
    if (!user) return;

    // Initialize with some Nepal-context notifications
    const initialNotifications = [
      {
        id: 1,
        type: notificationTypes.FESTIVAL_ALERT,
        title: 'Dashain Festival Events',
        message: 'Special Dashain celebration events are now available for booking in Kathmandu!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: '🎭',
        priority: 'high'
      },
      {
        id: 2,
        type: notificationTypes.PAYMENT_SUCCESS,
        title: 'Payment Confirmed - Nepal Tech Summit',
        message: 'Your payment of Rs. 2,500 via eSewa has been successfully processed.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        icon: '✅',
        priority: 'medium'
      },
      {
        id: 3,
        type: notificationTypes.EVENT_REMINDER,
        title: 'Event Tomorrow: Momo Festival',
        message: 'Don\'t forget about the Momo & Street Food Festival tomorrow at Bhrikutimandap!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        icon: '🍽️',
        priority: 'medium'
      }
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter(n => !n.read).length);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        addNotification(generateRandomNotification());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const generateRandomNotification = () => {
    const types = Object.values(notificationTypes);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const templates = {
      [notificationTypes.NEW_EVENT]: {
        title: 'New Event: Himalayan Adventure Expo',
        message: 'A new trekking and adventure expo has been posted in Pokhara!',
        icon: '🏔️',
        priority: 'low'
      },
      [notificationTypes.WEATHER_WARNING]: {
        title: 'Weather Alert for Outdoor Events',
        message: 'Heavy rainfall expected in Kathmandu valley. Some outdoor events may be affected.',
        icon: '⛈️',
        priority: 'high'
      },
      [notificationTypes.EVENT_UPDATE]: {
        title: 'Event Location Changed',
        message: 'Buddha Jayanti celebration venue has been moved to Lumbini Garden main hall.',
        icon: '📍',
        priority: 'medium'
      }
    };

    const template = templates[randomType] || templates[notificationTypes.NEW_EVENT];
    
    return {
      id: Date.now(),
      type: randomType,
      ...template,
      timestamp: new Date().toISOString(),
      read: false
    };
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Simulate notifications for specific events
  const notifyRegistrationSuccess = (eventTitle, transactionId) => {
    addNotification({
      id: Date.now(),
      type: notificationTypes.REGISTRATION_SUCCESS,
      title: 'Registration Successful!',
      message: `You've successfully registered for "${eventTitle}". Transaction ID: ${transactionId}`,
      timestamp: new Date().toISOString(),
      read: false,
      icon: '🎉',
      priority: 'high'
    });
  };

  const notifyPaymentSuccess = (amount, method, eventTitle) => {
    addNotification({
      id: Date.now(),
      type: notificationTypes.PAYMENT_SUCCESS,
      title: 'Payment Confirmed',
      message: `Payment of Rs. ${amount.toLocaleString()} via ${method} for "${eventTitle}" was successful.`,
      timestamp: new Date().toISOString(),
      read: false,
      icon: '💳',
      priority: 'high'
    });
  };

  const notifyEventReminder = (eventTitle, eventDate) => {
    addNotification({
      id: Date.now(),
      type: notificationTypes.EVENT_REMINDER,
      title: 'Event Reminder',
      message: `"${eventTitle}" is scheduled for ${eventDate}. Don't forget to attend!`,
      timestamp: new Date().toISOString(),
      read: false,
      icon: '⏰',
      priority: 'medium'
    });
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    notifyRegistrationSuccess,
    notifyPaymentSuccess,
    notifyEventReminder,
    notificationTypes
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Display Component
export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-orange-400 bg-orange-50';
      case 'low': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 17h5l-5-5.5v-3.5a6 6 0 1 0-12 0v3.5l-5 5.5h5m7 0v1a3 3 0 1 1-6 0v-1m6 0h-6" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔔</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};