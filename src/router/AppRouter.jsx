import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_STAFF } from "../utils/Constants.jsx";

// Auth Components
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";

// Layout & Pages
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/common/HomePage.jsx";
import StaffPage from "../pages/staff/StaffPage.jsx"; 

// Admin Components
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminMovies from "../pages/admin/AdminMovies.jsx";
import AdminRooms from "../pages/admin/AdminRooms.jsx";

const AppRouter = () => {
  const { auth } = useAuth();

  // Hàm điều hướng khi user truy cập vào các đường dẫn không tồn tại
  const getRedirectPath = () => {
    if (!auth) return "/login"; 
    if (auth.role === ROLE_ADMIN) return "/admin";
    if (auth.role === ROLE_STAFF) return "/staff";
    return "/home";
  };

  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      
      {/* 2. Auth Routes */}
      <Route 
        path="/login" 
        element={!auth ? <Login /> : <Navigate to={getRedirectPath()} />} 
      />
      <Route 
        path="/register" 
        element={!auth ? <Register /> : <Navigate to={getRedirectPath()} />} 
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 3. Admin Routes (Nested Routes) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Các route con này sẽ được render tại <Outlet /> trong AdminLayout */}
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="rooms" element={<AdminRooms />} />
      </Route>

      {/* 4. Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={[ROLE_STAFF]}>
            <StaffPage />
          </ProtectedRoute>
        }
      />

      {/* 5. Fallback - Xử lý 404 hoặc Redirect */}
      <Route path="*" element={<Navigate to={getRedirectPath()} />} />
    </Routes>
  );
};

export default AppRouter;