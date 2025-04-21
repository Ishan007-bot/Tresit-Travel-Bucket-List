import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TravelProvider } from './contexts/TravelContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import CountryDetails from './pages/CountryDetails';
import AddDestination from './pages/AddDestination';
import TravelLog from './pages/TravelLog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <TravelProvider>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/country/:id" element={<CountryDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/add-destination" element={<AddDestination />} />
                    <Route path="/travel-log" element={<TravelLog />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
          </TravelProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
