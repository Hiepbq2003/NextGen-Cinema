import AxiosClient from "./AxiosClient";

export const createBooking = (data) => {
    return AxiosClient.post('/bookings', data);
};

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

const BookingApi = {
    createBooking,
    confirmBooking,
    cancelBooking,
    getAllBookings,
    adminCancelBooking
};

export default BookingApi;