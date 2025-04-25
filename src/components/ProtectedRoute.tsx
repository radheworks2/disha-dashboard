
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
