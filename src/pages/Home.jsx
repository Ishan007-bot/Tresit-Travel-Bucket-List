import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaMapMarkedAlt, FaSuitcase, FaRegListAlt } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Track, plan, and remember your travels around the world</p>
          {currentUser ? (
            <div className="cta-buttons">
              <Link to="/add-destination" className="cta-button">
                Add New Destination
              </Link>
              <Link to="/explore" className="cta-button secondary">
                Explore
              </Link>
            </div>
          ) : (
            <div className="cta-buttons">
              <Link to="/login" className="cta-button">
                Log In
              </Link>
              <Link to="/register" className="cta-button secondary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features-section">
        <h2>Why Use Tresit?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaMapMarkedAlt />
            </div>
            <h3>Track Your Travels</h3>
            <p>Create a personalized map of all the places you've been and want to go</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaSuitcase />
            </div>
            <h3>Plan Your Trips</h3>
            <p>Organize your travel wishlist and access important country information</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaRegListAlt />
            </div>
            <h3>Keep Travel Notes</h3>
            <p>Record your memories, recommendations, and highlights from each destination</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 