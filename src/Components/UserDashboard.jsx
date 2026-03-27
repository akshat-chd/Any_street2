import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import {
  getUserProfile,
  listUserApplications,
  listUserFavorites,
  listUserNotifications,
} from '../services/firestoreData';
import {
  formatDisplayDate,
} from '../utils/storage';
import './UserDashboard.css';

const emptyProfile = {
  fullName: '',
  email: '',
  phoneNumber: '',
  city: '',
  state: '',
  housingType: '',
  preferredPetTypes: [],
};

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(emptyProfile);
  const [savedPets, setSavedPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateDashboard() {
      if (!currentUser) {
        return;
      }

      try {
        const [profileData, favoriteData, applicationData, notificationData] =
          await Promise.all([
            getUserProfile(currentUser),
            listUserFavorites(currentUser),
            listUserApplications(currentUser),
            listUserNotifications(currentUser),
          ]);

        if (!isMounted) {
          return;
        }

        setProfile({ ...emptyProfile, ...profileData });
        setSavedPets(favoriteData);
        setApplications(applicationData);
        setNotifications(notificationData);
      } catch {
        if (!isMounted) {
          return;
        }

        setProfile({
          ...emptyProfile,
          email: currentUser.email || '',
        });
        setSavedPets([]);
        setApplications([]);
        setNotifications([]);
      }

      setLoading(false);
    }

    hydrateDashboard();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const welcomeName = profile.fullName || currentUser?.email || 'Adopter';

  if (loading) {
    return <main className="dashboard-page"><div className="dashboard-container"><p className="dashboard-empty">Loading your dashboard...</p></div></main>;
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        {location.state?.message ? (
          <div className="dashboard-banner">{location.state.message}</div>
        ) : null}

        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">Account overview</p>
            <h1>Welcome, {welcomeName}</h1>
            <p>
              Track your profile, saved pets, and application activity from one
              place.
            </p>
          </div>
          <div className="dashboard-header__actions">
            <Link to="/profile-setup" className="dashboard-button dashboard-button--secondary">
              Edit profile
            </Link>
            <Link to="/adopt" className="dashboard-button dashboard-button--primary">
              Browse pets
            </Link>
          </div>
        </section>

        <section className="dashboard-summary">
          <article className="dashboard-summary__card">
            <strong>{savedPets.length}</strong>
            <span>Saved pets</span>
          </article>
          <article className="dashboard-summary__card">
            <strong>{applications.length}</strong>
            <span>Applications sent</span>
          </article>
          <article className="dashboard-summary__card">
            <strong>{unreadCount}</strong>
            <span>Unread notifications</span>
          </article>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-panel">
            <div className="dashboard-panel__heading">
              <h2>Profile snapshot</h2>
              <Link to="/profile-setup">Update</Link>
            </div>
            <div className="dashboard-profile-list">
              <p><strong>Email:</strong> {profile.email || currentUser?.email || 'Not set'}</p>
              <p><strong>Phone:</strong> {profile.phoneNumber || 'Not set'}</p>
              <p><strong>Location:</strong> {[profile.city, profile.state].filter(Boolean).join(', ') || 'Not set'}</p>
              <p><strong>Housing:</strong> {profile.housingType || 'Not set'}</p>
              <p>
                <strong>Pet interests:</strong>{' '}
                {profile.preferredPetTypes?.length
                  ? profile.preferredPetTypes.join(', ')
                  : 'Not set'}
              </p>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__heading">
              <h2>Recent applications</h2>
              <Link to="/adopt">Find more pets</Link>
            </div>
            <div className="dashboard-list">
              {applications.length === 0 ? (
                <p className="dashboard-empty">
                  No applications yet. Save a pet or apply from the adoption board.
                </p>
              ) : (
                applications.slice(0, 3).map((application) => (
                  <article key={application.id} className="dashboard-card">
                    <h3>{application.petName}</h3>
                    <p>Status: <span className={`status-${application.status.toLowerCase()}`}>{application.status}</span></p>
                    <p>Submitted: {formatDisplayDate(application.submittedAt)}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__heading">
              <h2>Saved pets</h2>
              <Link to="/favorites">Open favorites</Link>
            </div>
            <div className="dashboard-list">
              {savedPets.length === 0 ? (
                <p className="dashboard-empty">
                  Save pets from the adoption board to compare them here.
                </p>
              ) : (
                savedPets.slice(0, 3).map((pet) => (
                  <article key={pet.petKey} className="dashboard-card">
                    <h3>{pet.name}</h3>
                    <p>{pet.animal} · {pet.age}</p>
                    <p>{pet.location}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__heading">
              <h2>Notifications</h2>
              <Link to="/notifications">Open inbox</Link>
            </div>
            <div className="dashboard-list">
              {notifications.length === 0 ? (
                <p className="dashboard-empty">
                  Your inbox is empty. New application updates will appear here.
                </p>
              ) : (
                notifications.slice(0, 3).map((notification) => (
                  <article key={notification.id} className="dashboard-card">
                    <h3>{notification.message}</h3>
                    <p>{formatDisplayDate(notification.date)}</p>
                    <p>{notification.read ? 'Read' : 'Unread'}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
