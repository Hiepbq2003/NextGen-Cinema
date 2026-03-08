import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ADMIN, ROLE_STAFF } from '../utils/Constants.jsx';

import Login from '../pages/auth/Login.jsx';
import AdminPage from '../pages/admin/AdminPage';
import StaffPage from '../pages/staff/StaffPage';
import HomePage from '../pages/common/HomePage';
import ProtectedRoute from './ProtectedRoute';
import Register from "../pages/auth/Register.jsx";
import MovieList from "../pages/common/OngoingMovies.jsx";
import UpcomingMovieList from "../pages/common/UpcomingMovies.jsx";
import MovieDetail from "../pages/common/MovieDetail.jsx";
import SeatSelection from "../pages/common/SeatSelection.jsx";
import BookingDetail from "../pages/common/BookingDetail.jsx";
import Payment from "../pages/common/Payment.jsx";
import QrPayment from "../pages/common/QrPayment.jsx";

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

            <Route
                path="/movies"
                element={
                    <MovieList/>
                }
            />

            <Route
                path="/movies/upcoming"
                element={
                    <UpcomingMovieList/>
                }
            />

            <Route
                path="/movies/:id"
                element={<MovieDetail/>}
            />

            <Route
                path="/movies/booking/:showtimeId"
                element={
                    <SeatSelection/>
                }
            />

            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <Payment />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/qr-payment"
                element={<QrPayment />}
            />

            <Route
                path="/booking-detail"
                element={
                    <ProtectedRoute>
                        <BookingDetail/>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to={getRedirectPath()} />} />
        </Routes>
    );
};

export default AppRouter;
