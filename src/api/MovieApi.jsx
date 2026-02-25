import axiosClient from './axiosClient';

// Lấy tất cả phim (dành cho Admin)
export const getAllMovies = () => {
    return axiosClient.get('/movies');
};

// Lấy phim đang chiếu (Public)
export const getActiveMovies = () => {
    return axiosClient.get('/movies/public');
};

// Thêm phim mới
export const createMovie = (data) => {
    return axiosClient.post('/movies', data);
};

// Cập nhật phim
export const updateMovie = (id, data) => {
    return axiosClient.put(`/movies/${id}`, data);
};

// Xóa phim (Soft delete)
export const deleteMovie = (id) => {
    return axiosClient.delete(`/movies/${id}`);
};