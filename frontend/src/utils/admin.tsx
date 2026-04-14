import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

const AdminRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isAuth = authService.isAuthenticated();

  useEffect(() => {
    const run = async () => {
      if (!isAuth) {
        setIsChecking(false);
        return;
      }

      try {
        const user = await authService.syncSessionUser();
        setIsAdmin((user?.role || "").toLowerCase() === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    run();
  }, [isAuth]);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (isChecking) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Verification des droits admin...</p>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default AdminRoute;

