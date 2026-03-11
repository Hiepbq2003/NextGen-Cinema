import AxiosClient from "./AxiosClient";


export const getActiveVouchers = () => {
    return AxiosClient.get('/vouchers/public');
};


export const getAllVouchers = () => {
    return AxiosClient.get('/vouchers');
};

export const createVoucher = (data) => {
    return AxiosClient.post('/vouchers', data);
};

export const updateVoucher = (id, data) => {
    return AxiosClient.put(`/vouchers/${id}`, data);
};

export const deleteVoucher = (id) => {
    return AxiosClient.delete(`/vouchers/${id}`);
};

export const toggleVoucherStatus = (id) => {
    return AxiosClient.put(`/vouchers/toggle-status/${id}`);
};

export const getVoucherUsages = (id) => {
    return AxiosClient.get(`/vouchers/${id}/usages`);
};

const VoucherApi = {
    getActiveVoucher: getActiveVouchers,
    getAllVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    toggleVoucherStatus,
    getVoucherUsages
};

export default VoucherApi;