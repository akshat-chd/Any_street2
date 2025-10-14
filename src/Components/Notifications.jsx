import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Notifications.css';

export default function Notifications() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated notifications data
        // In a real app, this would fetch from your backend
        const fetchNotifications = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setNotifications([
                    {
                        id: 1,
                        type: 'application',
                        message: 'Your application for Max has been approved!',
                        date: '2025-10-14',
                        read: false
                    },
                    {
                        id: 2,
                        type: 'message',
                        message: 'New message from Sunshine Shelter about Luna',
                        date: '2025-10-13',
                        read: true
                    },
                    {
                        id: 3,
                        type: 'alert',
                        message: 'A new pet matching your preferences is available',
                        date: '2025-10-12',
                        read: false
                    }
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [currentUser]);

    const markAsRead = async (notificationId) => {
        // In a real app, this would update the backend
        setNotifications(notifications.map(notification =>
            notification.id === notificationId
                ? { ...notification, read: true }
                : notification
        ));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'application':
                return '📝';
            case 'message':
                return '💌';
            case 'alert':
                return '🔔';
            default:
                return '📫';
        }
    };

    if (loading) {
        return <div className="notifications-loading">Loading notifications...</div>;
    }

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="no-notifications">
                        No notifications to display
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => markAsRead(notification.id)}
                        >
                            <div className="notification-icon">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-date">{notification.date}</span>
                            </div>
                            {!notification.read && (
                                <div className="unread-indicator" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}