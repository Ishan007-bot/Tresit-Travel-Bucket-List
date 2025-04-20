import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          Tre<span>sit</span>
        </Link>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/add-destination" className="nav-link">
                Add Destination
              </Link>
            </li>
            <li>
              <Link to="/travel-log" className="nav-link">
                My Travel Log
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 