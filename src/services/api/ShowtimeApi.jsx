import AxiosClient from "./AxiosClient";

export const getAllShowtimes = () => {
    return AxiosClient.get('/showtimes');
};

export const createShowtime = (data) => {
    return AxiosClient.post('/showtimes', data);
};

export const cancelShowtime = (id) => {
    return AxiosClient.delete(`/showtimes/${id}`);
};