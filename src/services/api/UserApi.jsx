import AxiosClient from "./AxiosClient";

export const getMyProfile = () => AxiosClient.get('/users/me');
export const updateProfile = (data) => AxiosClient.put('/users/me', data);
export const changePassword = (data) => AxiosClient.post('/users/me/change-password', data);