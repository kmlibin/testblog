"use client";
import React, { useState, useEffect, createContext, useContext } from "react";


export const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContext;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check session storage for user data
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData);
    }
  }, []);

  const addAuthContext = async () => {
    try {
      
      const userData = { isAdmin: true }; 

      // store in session storage
      sessionStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const removeAuthContext = () => {
    // clear user from session storage
    sessionStorage.removeItem("user");
    setUser(null);
  };

  console.log(user);
  const authState = {
    user: user || { isAdmin: false }, // init user with admin: false
    setUser,
    addAuthContext,
    removeAuthContext,
  };

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;