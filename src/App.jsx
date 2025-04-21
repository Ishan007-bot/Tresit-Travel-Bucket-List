import React, { lazy, Suspense, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Background from './components/Background';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'));
const AddDestination = lazy(() => import('./pages/AddDestination'));
const Profile = lazy(() => import('./pages/Profile'));
const TravelLog = lazy(() => import('./pages/TravelLog'));
const Explore = lazy(() => import('./pages/Explore'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Background />
          <Header />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/explore" element={<Explore />} />
                
                {/* Protected routes */}
                <Route path="/destination/:id" element={
                  <ProtectedRoute>
                    <DestinationDetail />
                  </ProtectedRoute>
                } />
                <Route path="/add-destination" element={
                  <ProtectedRoute>
                    <AddDestination />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/travel-log" element={
                  <ProtectedRoute>
                    <TravelLog />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
