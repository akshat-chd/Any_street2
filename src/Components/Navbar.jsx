import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate('/login');
  };

  const getNavClassName = ({ isActive }) =>
    `site-navbar__link ${isActive ? 'is-active' : ''}`;

  return (
    <nav className="site-navbar">
      <div className="container-fluid site-navbar__inner">
        <div className="site-navbar__top">
          <NavLink className="site-navbar__brand" to="/" onClick={closeMenu}>
            <span className="site-navbar__brand-mark">🐾</span>
            <span>AnyStreet</span>
          </NavLink>

          <button
            type="button"
            className="site-navbar__toggle"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((previous) => !previous)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`site-navbar__menu ${isOpen ? 'is-open' : ''}`}>
          <div className="site-navbar__links">
            <NavLink className={getNavClassName} to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink className={getNavClassName} to="/adopt" onClick={closeMenu}>
              Adopt
            </NavLink>
            <NavLink className={getNavClassName} to="/sightings" onClick={closeMenu}>
              Sightings
            </NavLink>
            <NavLink className={getNavClassName} to="/resources" onClick={closeMenu}>
              Resources
            </NavLink>
          </div>

          <div className="site-navbar__account">
            {currentUser ? (
              <>
                <div className="site-navbar__user">
                  <span className="site-navbar__user-label">Signed in as</span>
                  <span className="site-navbar__user-email">{currentUser.email}</span>
                </div>
                <NavLink
                  className={getNavClassName}
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  className={getNavClassName}
                  to="/favorites"
                  onClick={closeMenu}
                >
                  Favorites
                </NavLink>
                <NavLink
                  className={getNavClassName}
                  to="/notifications"
                  onClick={closeMenu}
                >
                  Notifications
                </NavLink>
                <button
                  type="button"
                  className="site-navbar__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className={getNavClassName} to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink
                  className="site-navbar__signup"
                  to="/register"
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
