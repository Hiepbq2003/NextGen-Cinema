import AxiosClient from "./AxiosClient";

const SeatApi = {
    getSeatsByShowtime: async (showtimeId) => {
        return AxiosClient.get(`/seats/public/showtime/${showtimeId}`);
    },

    reserveSeats: async (showtimeId, seatIds) => {
        return AxiosClient.post(`/seats/reserve`, { showtimeId: showtimeId, seatIds: seatIds });
    },

    releaseSeats: async (showtimeId) => {
        return AxiosClient.post(`/seats/public/release?showtimeId=${showtimeId}`);
    },
}
export default SeatApi;