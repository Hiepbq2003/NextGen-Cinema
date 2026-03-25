import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_STAFF } from "../utils/Constants.jsx";

import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import Login from "../pages/auth/Login.jsx";
import HomePage from "../pages/common/HomePage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../pages/auth/Register.jsx";

import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminMovies from "../pages/admin/AdminMovies.jsx";
import AdminRooms from "../pages/admin/AdminRooms.jsx";

import StaffDashboard from "../pages/staff/StaffDashBoard.jsx";
import CheckIn from "../pages/staff/CheckIn.jsx";
import StaffSupport from "../pages/staff/StaffSupport.jsx";
import StaffLayout from "../components/staff/StaffLayout";

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

<<<<<<< Updated upstream
      {/* Staff */}
      <Route
        path="/staff"
        element={
          
            <StaffLayout />
         
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="checkin" element={<CheckIn />} />
        <Route path="support" element={<StaffSupport />} />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to={getRedirectPath()} />} />
    </Routes>
  );
=======
                {/* Thông tin chính sách */}
                <Route path="/info" element={<PolicyLayout/>}>
                    <Route path="about" element={<AboutUs/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path="terms" element={<TermsConditions/>}/>
                    <Route path="privacy" element={<PrivacyPolicy/>}/>
                    <Route path="refund" element={<RefundPolicy/>}/>
                    <Route path="faq" element={<Faq/>}/>
                </Route>
            </Route>

            {/* 2. Nhóm Route Auth */}
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
            <Route
                path="/login"
                element={!auth ? <Login/> : <Navigate to={getRedirectPath()}/>}
            />
            <Route
                path="/register"
                element={!auth ? <Register/> : <Navigate to={getRedirectPath()}/>}
            />
            <Route path="/forgot-password" element={<ForgotPassword/>}/>

            {/* 3. Nhóm Route Admin */}
            <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={[ROLE_ADMIN]}><AdminLayout/></ProtectedRoute>}
            >
                <Route index element={<AdminDashboard/>}/>
                <Route path="movies" element={<AdminMovies/>}/>
                <Route path="rooms" element={<AdminRooms/>}/>
                <Route path="users" element={<AdminUsers/>}/>
                <Route path="staffs" element={<AdminStaffs/>}/>
                <Route path="vouchers" element={<AdminVouchers/>}/>
                <Route path="showtimes" element={<AdminShowtimes/>}/>
                <Route path="bookings" element={<AdminBookings/>}/>
                <Route path="profile" element={<ProfilePage/>}/>
            </Route>

            {/* 4. Staff */}

            <Route path="/staff"
                   element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}><StaffLayout/></ProtectedRoute>}>
                <Route index element={<Navigate to="/staff/dashboard" replace/>}/>
                <Route path="dashboard" element={<StaffDashboard/>}/>
                <Route path="bookings" element={<StaffBookings/>}/>
                {<Route path="pos" element={<StaffPOS />} />}
            </Route>

            {/* 5. Điều hướng mặc định */}
            <Route path="*" element={<Navigate to={getRedirectPath()}/>}/>
        </Routes>
    );
>>>>>>> Stashed changes
};

export default AppRouter;
