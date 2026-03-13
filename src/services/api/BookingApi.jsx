import AxiosClient from "./AxiosClient";

export const createBooking = (data) => {
    return AxiosClient.post('/bookings', data);
};

export const getBookingById = (id) => {
    return AxiosClient.get(`/bookings/${id}`);
}

export const confirmBooking = (bookingId) => {
    return AxiosClient.post(`/bookings/${bookingId}/confirm`);
};

// Hủy đơn dành cho User 
export const cancelBooking = (bookingId) => {
    return AxiosClient.post(`/bookings/${bookingId}/cancel`);
};

export const getAllBookings = () => {
    return AxiosClient.get('/admin/bookings');
};

// Hủy đơn dành cho Admin
export const adminCancelBooking = (id) => {
    return AxiosClient.put(`/admin/bookings/${id}/cancel`);
};

export const getMyBookings = () => {
    return AxiosClient.get('/bookings/my-bookings');
};

const BookingApi = {
    createBooking,
    confirmBooking,
    cancelBooking,
    getAllBookings,
    adminCancelBooking,
    getBookingById,
    getMyBookings
};

export default BookingApi;