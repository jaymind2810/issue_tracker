import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
