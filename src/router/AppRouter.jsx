import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_STAFF } from "../utils/Constants.jsx";

import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import Login from "../pages/auth/Login.jsx";
import StaffPage from "../pages/staff/staffPage.jsx";
import HomePage from "../pages/common/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/auth/Register.jsx";

import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminMovies from "../pages/admin/AdminMovies.jsx";
import AdminRooms from "../pages/admin/AdminRooms.jsx";

const AppRouter = () => {
  const { auth } = useAuth();

  const getRedirectPath = () => {
    if (!auth) return "/";
    if (auth.role === ROLE_ADMIN) return "/admin";
    if (auth.role === ROLE_STAFF) return "/staff";
    return "/";
  };

  return (
    <Routes>
      {/* Homepage public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="rooms" element={<AdminRooms />} />
      </Route>

      {/* Staff */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={getRedirectPath()} />} />
    </Routes>
  );
};

export default AppRouter;