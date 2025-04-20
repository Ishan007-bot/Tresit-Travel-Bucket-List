import { Link, NavLink } from 'react-router-dom';
import ThemeToggler from './ThemeToggler';

const Header = () => {
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
                Explore
              </NavLink>
            </li>
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
          </ul>
        </nav>
        <ThemeToggler />
      </div>
    </header>
  );
};

export default Header; 