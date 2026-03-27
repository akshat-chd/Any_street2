import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  listUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/firestoreData';
import {
  formatDisplayDate,
} from '../utils/storage';
import './Notifications.css';

export default function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateNotifications() {
      if (!currentUser) {
        return;
      }

      try {
        const savedNotifications = await listUserNotifications(currentUser);

        if (!isMounted) {
          return;
        }

        setNotifications(savedNotifications);
      } catch {
        if (!isMounted) {
          return;
        }

        setNotifications([]);
      }
      setLoading(false);
    }

    hydrateNotifications();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const persistNotifications = async (nextNotifications) => {
    setNotifications(nextNotifications);
  };

  const markAsRead = async (notificationId) => {
    await markNotificationAsRead(currentUser, notificationId);
    const nextNotifications = notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
    );
    await persistNotifications(nextNotifications);
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead(currentUser, notifications);
    await persistNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationLabel = (type) => {
    switch (type) {
      case 'application':
        return 'Application';
      case 'message':
        return 'Message';
      default:
        return 'Alert';
    }
  };

  if (loading) {
    return (
      <main className="notifications-page">
        <div className="notifications-container">
          <p className="notifications-empty">Loading notifications...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="notifications-page">
      <div className="notifications-container">
        <section className="notifications-header">
          <div>
            <p className="notifications-eyebrow">Inbox</p>
            <h1>Notifications</h1>
            <p>Application updates and saved actions show up here.</p>
          </div>

          {notifications.length ? (
            <button
              type="button"
              className="notifications-mark-all"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          ) : null}
        </section>

        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <h2>No notifications yet</h2>
            <p>
              Submit an application or complete your profile to start building a
              useful activity history.
            </p>
            <Link to="/dashboard" className="notifications-link">
              Go to dashboard
            </Link>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-item ${notification.read ? 'is-read' : 'is-unread'}`}
              >
                <div className="notification-item__content">
                  <p className="notification-item__label">
                    {getNotificationLabel(notification.type)}
                  </p>
                  <h2>{notification.message}</h2>
                  <p className="notification-item__date">
                    {formatDisplayDate(notification.date)}
                  </p>
                </div>

                <div className="notification-item__actions">
                  {notification.link ? (
                    <Link to={notification.link} className="notifications-link">
                      Open
                    </Link>
                  ) : null}
                  {!notification.read ? (
                    <button
                      type="button"
                      className="notifications-mark"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  ) : (
                    <span className="notification-item__status">Read</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
