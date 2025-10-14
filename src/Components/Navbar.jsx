import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="navbar-brand" to="/">🐾 AnyStreet</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/adopt">Adopt</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/sightings'>Sightings</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/resources'>Resources</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {currentUser ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="me-2">👤</span>{currentUser.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><NavLink className="dropdown-item" to="/dashboard">Profile</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/favorites">Favorites</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/notifications">Notifications</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Sign Up</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;