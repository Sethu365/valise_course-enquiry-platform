// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // stores logged in user object
  const [loading, setLoading] = useState(true);

  //---------------------------------------------------------------------------
  // ✅ Load user from localStorage when app starts
  //---------------------------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));   // restore user session
    }

    setLoading(false);
  }, []);



  //---------------------------------------------------------------------------
  // ✅ Login: save token + user in localStorage + update context state
  //---------------------------------------------------------------------------
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);  // <--- MOST IMPORTANT FIX ✅
  };



  //---------------------------------------------------------------------------
  // ✅ Logout: remove token + user
  //---------------------------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };



  //---------------------------------------------------------------------------
  // ✅ Exposed values to components
  //---------------------------------------------------------------------------
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,              // TRUE if user exists
    isAdmin: user?.role === "ADMIN",      // Backend role is uppercase ✅
    isUser: user?.role === "USER",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
