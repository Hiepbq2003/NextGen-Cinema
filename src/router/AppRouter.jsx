import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_STAFF } from "../utils/Constants.jsx";

// Auth Components
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import OAuth2RedirectHandler from "../pages/auth/OAuth2RedirectHandler";

// Layout & Common Components
import UserLayout from "../components/common/UserLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/common/HomePage.jsx";
import ProfilePage from "../pages/common/ProfilePage.jsx";
import MyTickets from "../pages/common/MyTickets.jsx";

// Movie & Booking Components
import MovieList from "../pages/common/OngoingMovies.jsx";
import UpcomingMovieList from "../pages/common/UpcomingMovies.jsx";
import MovieDetail from "../pages/common/MovieDetail.jsx";
import SeatSelection from "../pages/common/SeatSelection.jsx";
import BookingDetail from "../pages/common/BookingDetail.jsx";
import Payment from "../pages/common/Payment.jsx";
import QrPayment from "../pages/common/QrPayment.jsx";

// Info & Policy Pages 
import PolicyLayout from "../pages/info/InfoLayout.jsx";
import TermsConditions from "../pages/info/TermsConditions.jsx";
import PrivacyPolicy from "../pages/info/PrivacyPolicy.jsx";
import RefundPolicy from "../pages/info/RefundPolicy.jsx";
import Faq from "../pages/info/Faq.jsx";
import AboutUs from "../pages/info/AboutUs";
import Contact from "../pages/info/Contact";

// Admin Components
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminMovies from "../pages/admin/AdminMovies.jsx";
import AdminRooms from "../pages/admin/AdminRooms.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminStaffs from "../pages/admin/AdminStaffs.jsx";
import AdminVouchers from "../pages/admin/AdminVouchers.jsx";
import AdminShowtimes from "../pages/admin/AdminShowtimes.jsx";
import AdminBookings from "../pages/admin/AdminBookings.jsx";

//Staff Components
import StaffLayout from '../components/staff/StaffLayout';
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffBookings from '../pages/staff/StaffBookings';
import StaffPOS from '../pages/staff/StaffPOS';
const AppRouter = () => {
  const { auth } = useAuth();

  const getRedirectPath = () => {
    if (!auth) return "/login";
    if (auth.role === ROLE_ADMIN) return "/admin";
    if (auth.role === ROLE_STAFF) return "/staff";
    return "/home";
  };

  return (
    <Routes>
      {/* 1. Nhóm Route Người dùng (Dùng UserLayout) */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Phim và Đặt vé */}
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/upcoming" element={<UpcomingMovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />

        <Route path="/movies/booking/:showtimeId" element={<SeatSelection />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/payment" element={<Payment />} />
          <Route path="/qr-payment" element={<QrPayment />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Route>

        {/* Thông tin chính sách */}
        <Route path="/info" element={<PolicyLayout />}>
          <Route path="about" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="refund" element={<RefundPolicy />} />
          <Route path="faq" element={<Faq />} />
        </Route>
      </Route>

      {/* 2. Nhóm Route Auth */}
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route
        path="/login"
        element={!auth ? <Login /> : <Navigate to={getRedirectPath()} />}
      />
      <Route
        path="/register"
        element={!auth ? <Register /> : <Navigate to={getRedirectPath()} />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* 3. Nhóm Route Admin */}
      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={[ROLE_ADMIN]}><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="staffs" element={<AdminStaffs />} />
        <Route path="vouchers" element={<AdminVouchers />} />
        <Route path="showtimes" element={<AdminShowtimes />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 4. Staff */}

      <Route path="/staff" element={<ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}><StaffLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="bookings" element={<StaffBookings />} />
        {/* <Route path="pos" element={<StaffPOS />} /> */}
      </Route>

      {/* 5. Điều hướng mặc định */}
      <Route path="*" element={<Navigate to={getRedirectPath()} />} />
    </Routes>
  );
};

export default AppRouter;