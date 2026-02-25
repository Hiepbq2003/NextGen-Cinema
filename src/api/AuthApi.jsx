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