import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { loading, isAuthenticated, role } = useAuth();

    if (loading) return <h1>Loading .....</h1>;
    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (!role) return <Navigate to="/" replace />; // Evita que entre sin rol definido
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />; 

    return <Outlet />;
};

export default RoleProtectedRoute;
