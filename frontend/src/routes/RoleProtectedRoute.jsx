import { Navigate, useLocation } from "react-router-dom";
import userAuthStore from "../store/userAuthstore";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = userAuthStore();
  const location = useLocation();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!user) {
    return <div>Loading...</div>; // wait
  }
  const role = user?.results?.[0]?.role?.role_name;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
