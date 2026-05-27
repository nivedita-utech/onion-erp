import { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { HiOutlineBell, HiOutlineCheck, HiOutlineCheckCircle } from 'react-icons/hi';
import { formatRelativeTime } from '../../utils/helpers';

const sampleNotifications = [
  { _id: '1', type: 'low_stock', message: 'Onion Powder Premium stock is below threshold (30 kg remaining)', isRead: false, createdAt: '2024-01-15T10:30:00Z' },
  { _id: '2', type: 'payment_due', message: 'Payment of ₹3,20,000 from Dubai Spices LLC is overdue by 15 days', isRead: false, createdAt: '2024-01-15T09:00:00Z' },
  { _id: '3', type: 'shipment_update', message: 'Export order EXP-2024-001 has departed from Mumbai port', isRead: true, createdAt: '2024-01-14T16:00:00Z' },
  { _id: '4', type: 'followup_reminder', message: 'Follow-up due for lead: Ahmed Al-Rashid (Dubai Spices)', isRead: true, createdAt: '2024-01-14T08:00:00Z' },
  { _id: '5', type: 'order_status', message: 'Sales order SO-2024-002 has been approved by Manager', isRead: true, createdAt: '2024-01-13T14:00:00Z' },
];

const typeIcons = {
  low_stock: '📦',
  payment_due: '💰',
  shipment_update: '🚢',
  followup_reminder: '📅',
  order_status: '📋',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2 text-sm">
              <HiOutlineCheckCircle className="w-4 h-4" />
              Mark All Read
            </button>
          )
        }
      />

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`glass-card p-4 flex items-start gap-4 transition-all duration-200 ${
              !notification.isRead ? 'border-l-2 border-l-primary-500 bg-primary-500/[0.03]' : ''
            }`}
          >
            <span className="text-2xl">{typeIcons[notification.type] || '🔔'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${notification.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                {notification.message}
              </p>
              <p className="text-xs text-gray-600 mt-1">{formatRelativeTime(notification.createdAt)}</p>
            </div>
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification._id)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-primary-400 transition-colors"
                title="Mark as read"
              >
                <HiOutlineCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
