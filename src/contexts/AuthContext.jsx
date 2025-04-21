import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();
// Export the context directly so it can be imported in App.jsx
export { AuthContext };

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Mock user for development
const mockUser = {
  name: "Test User",
  email: "test@example.com",
  createdAt: new Date().toISOString(),
  id: Date.now().toString()
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('tresit_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Use mock user if no saved user
      setCurrentUser(mockUser);
      localStorage.setItem('tresit_user', JSON.stringify(mockUser));
    }
    setLoading(false);
  }, []);

  // Mock implementation of signup
  function signup(email, password, displayName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { 
          email, 
          name: displayName, 
          createdAt: new Date().toISOString(),
          id: Date.now().toString()
        };
        setCurrentUser(newUser);
        localStorage.setItem('tresit_user', JSON.stringify(newUser));
        
        // Store in users array too
        const savedUsers = JSON.parse(localStorage.getItem('tresit_users') || '[]');
        savedUsers.push(newUser);
        localStorage.setItem('tresit_users', JSON.stringify(savedUsers));
        
        resolve({ user: newUser });
      }, 1000);
    });
  }

  // Mock implementation of login
  function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check users in localStorage
        const savedUsers = JSON.parse(localStorage.getItem('tresit_users') || '[]');
        const user = savedUsers.find(u => u.email === email);
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('tresit_user', JSON.stringify(user));
          resolve({ user });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }

  // Mock implementation of logout
  function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('tresit_user');
        resolve();
      }, 500);
    });
  }

  // Update user profile
  const updateProfileHandler = (updates) => {
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!currentUser) {
            throw new Error('No authenticated user');
          }
          
          // Update the current user with new info
          const updatedUser = { ...currentUser, ...updates };
          
          // Update in users array
          const savedUsers = JSON.parse(localStorage.getItem('tresit_users') || '[]');
          const updatedUsers = savedUsers.map(user => 
            user.id === currentUser.id ? updatedUser : user
          );
          
          localStorage.setItem('tresit_users', JSON.stringify(updatedUsers));
          
          // Update current user
          setCurrentUser(updatedUser);
          localStorage.setItem('tresit_user', JSON.stringify(updatedUser));
          
          resolve(updatedUser);
        } catch (err) {
          setError(err.message);
          reject(err);
        }
      }, 1000);
    });
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile: updateProfileHandler
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 