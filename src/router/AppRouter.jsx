import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ADMIN, ROLE_STAFF } from '../utils/constants';

import Login from '../pages/auth/Login';
import AdminPage from '../pages/admin/AdminPage';
import StaffPage from '../pages/staff/StaffPage';
import HomePage from '../pages/common/HomePage';
import ProtectedRoute from './ProtectedRoute';
import Register from "../pages/auth/register.jsx";

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
