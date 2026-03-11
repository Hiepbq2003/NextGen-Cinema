import AxiosClient from "./AxiosClient";

export const login = (data) => {
    return AxiosClient.post('/auth/login', data);
};
export const register = (data) => {
    return AxiosClient.post('/auth/register', data);
};

export const forgotPassword = (data) => {
    return AxiosClient.post('/auth/forgot-password', data);
};

export const resetPassword = (data) => {
    return AxiosClient.post('/auth/reset-password', data);
};

// Admin Management
export const getUsersByRole = (role) => AxiosClient.get(`/users/admin/list?role=${role}`);
export const toggleUserStatus = (id) => AxiosClient.put(`/users/admin/toggle-status/${id}`);
export const createStaffAccount = (data) => AxiosClient.post('/auth/register-staff', data);
export const updateUserAdmin = (id, data) => AxiosClient.put(`/users/admin/update/${id}`, data);
