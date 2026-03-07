import AxiosClient from "./AxiosClient";

export const getMyProfile = () => {
    return AxiosClient.get('/users/me');
};

export const updateProfile = (data) => {
    return AxiosClient.put('/users/me', data);
};

export const changePassword = (data) => {
    return AxiosClient.post('/users/me/change-password', data);
};