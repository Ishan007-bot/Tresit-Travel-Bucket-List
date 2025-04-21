import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggler from './ThemeToggler';

const Header = () => {
  const { currentUser } = useAuth();
  
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          Tre<span>sit</span>
        </Link>
        <nav className="nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Explore
              </NavLink>
            </li>
            {currentUser && (
              <>
                <li>
                  <NavLink to="/add-destination" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                    Add Destination
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/travel-log" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                    My Travel Log
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="header-right">
          {currentUser ? (
            <div className="user-menu">
              <NavLink to="/profile" className={({isActive}) => isActive ? "user-profile active" : "user-profile"}>
                <span className="user-avatar">{currentUser.name ? currentUser.name[0].toUpperCase() : '?'}</span>
                <span className="user-name">{currentUser.name || 'Profile'}</span>
              </NavLink>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="header-auth-link">Log In</Link>
              <Link to="/signup" className="header-auth-link signup">Sign Up</Link>
            </div>
          )}
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
};

export default Header; 