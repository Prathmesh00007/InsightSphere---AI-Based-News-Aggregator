import React from 'react';

const NotificationPage = () => {
  const notifications = [
    {
      type: 'success',
      message: 'Your profile has been updated successfully!',
      time: '2 minutes ago',
    },
    {
      type: 'info',
      message: 'New features are now available. Check out the latest update!',
      time: '1 hour ago',
    },
    {
      type: 'warning',
      message: 'Your subscription is about to expire in 3 days.',
      time: '3 hours ago',
    },
    {
      type: 'error',
      message: 'Failed to connect to the server. Please try again later.',
      time: 'Yesterday',
    },
  ];

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Notifications</h2>
        <div className="space-y-6">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 ${getNotificationStyles(notification.type)} rounded-md shadow-md`}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">{notification.message}</p>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
