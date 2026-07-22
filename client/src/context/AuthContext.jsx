import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, loadProfile, clearAuth } from '../redux/slices/authSlice.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Silently sync latest profile in background
      dispatch(loadProfile());
    }

    // Handle token refresh/expired event from axios configuration
    const handleLogoutEvent = () => {
      dispatch(clearAuth());
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [isAuthenticated, dispatch]);


  const login = async (email, password) => {
    return dispatch(loginUser({ email, password })).unwrap();
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const role = user?.role || (user?.adminid ? 'admin' : user?.studentId ? 'student' : user?.facultyId ? 'faculty' : null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
