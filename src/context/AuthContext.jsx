// src/context/AuthContext.jsx
import { createContext, useContext } from "react";
import useAuthLogic from "../hooks/useAuth"; // renamed to avoid conflict

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthLogic(); // use the hook logic here
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// convenient custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
