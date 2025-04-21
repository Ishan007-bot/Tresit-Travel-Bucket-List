import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { TravelProvider } from './contexts/TravelContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TravelProvider>
        <App />
      </TravelProvider>
    </AuthProvider>
  </React.StrictMode>,
)
