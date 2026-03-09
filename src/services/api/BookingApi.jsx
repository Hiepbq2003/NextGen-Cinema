import AxiosClient from "./AxiosClient";

export const getAllBookings = () => {
    return AxiosClient.get('/admin/bookings');
};

export const cancelBooking = (id) => {
    return AxiosClient.put(`/admin/bookings/${id}/cancel`);
};