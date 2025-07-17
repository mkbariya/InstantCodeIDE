// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../helper";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(API_BASE_URL +  "/verifyuser", {
          withCredentials: true,
        });
        setIsAuthenticated(res.data.success);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-white p-6">Verifying...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
