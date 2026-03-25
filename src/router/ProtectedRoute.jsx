import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

<<<<<<< Updated upstream
const ProtectedRoute = ({ children }) => {
=======
const ProtectedRoute = ({ children, allowedRoles }) => {
>>>>>>> Stashed changes
    const { auth } = useAuth();

    console.log("AUTH:", auth);

    // chưa login
    if (!auth) {
        return <Navigate to="/login" replace />;
    }

<<<<<<< Updated upstream
    return children;
=======
    // check role
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
>>>>>>> Stashed changes
};

export default ProtectedRoute;