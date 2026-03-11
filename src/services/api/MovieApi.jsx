import axiosClient from './AxiosClient';

export const getActiveMovies = () => {
    return axiosClient.get('/movies/public');
};

export const getUpcomingMovies = () => {
    return axiosClient.get('/movies/public/upcoming');
};

export const getMovieById = (id) => {
    return axiosClient.get(`/movies/public/${id}`);
};

export const getShowtimesByMovie = (movieId) => {
    return axiosClient.get(`/showtimes/public/${movieId}`);
};

export const getAllMovies = () => {
    return axiosClient.get('/movies');
};

export const createMovie = (data) => {
    return axiosClient.post('/movies', data);
};

export const updateMovie = (id, data) => {
    return axiosClient.put(`/movies/${id}`, data);
};

export const deleteMovie = (id) => {
    return axiosClient.delete(`/movies/${id}`);
};

const MovieApi = {
    getOngoingMovies: getActiveMovies, 
    getUpcomingMovies,
    getMovieById,
    getShowtimesByMovie,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie
};

export default MovieApi;