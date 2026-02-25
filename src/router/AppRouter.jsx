import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ADMIN, ROLE_STAFF } from '../utils/Constants.jsx';
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import Login from '../pages/auth/Login.jsx';
import AdminPage from '../pages/admin/adminPage.jsx';
import StaffPage from '../pages/staff/staffPage.jsx';
import HomePage from '../pages/common/homePage.jsx';
import ProtectedRoute from './ProtectedRoute';
import Register from "../pages/auth/Register.jsx";

const AppRouter = () => {
    const { auth } = useAuth();

    const getRedirectPath = () => {
        if (!auth) return '/login';
        if (auth.role === ROLE_ADMIN) return '/admin';
        if (auth.role === ROLE_STAFF) return '/staff';
        return '/home';
    };

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/staff"
                element={
                    <ProtectedRoute>
                        <StaffPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to={getRedirectPath()} />} />
        </Routes>
    );
};

export default AppRouter;
