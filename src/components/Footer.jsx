import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h3>Tresit</h3>
          <p>Your personal travel bucket list companion</p>
          <p>&copy; {currentYear} Tresit. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/add-destination" className="footer-link">Add Destination</Link>
          <Link to="/travel-log" className="footer-link">Travel Log</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 