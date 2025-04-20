import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TravelProvider } from './contexts/TravelContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CountryDetails from './pages/CountryDetails';
import AddDestination from './pages/AddDestination';
import TravelLog from './pages/TravelLog';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <TravelProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/country/:id" element={<CountryDetails />} />
                <Route path="/add-destination" element={<AddDestination />} />
                <Route path="/travel-log" element={<TravelLog />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </TravelProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
