import AxiosClient from "./AxiosClient";

// Lấy danh sách tất cả voucher
export const getAllVouchers = () => {
    return AxiosClient.get('/vouchers');
};

// Tạo voucher mới
export const createVoucher = (data) => {
    return AxiosClient.post('/vouchers', data);
};

// Cập nhật voucher
export const updateVoucher = (id, data) => {
    return AxiosClient.put(`/vouchers/${id}`, data);
};

// Xóa hoặc đổi trạng thái 
export const deleteVoucher = (id) => {
    return AxiosClient.delete(`/vouchers/${id}`);
};

// Đổi trạng thái 
export const toggleVoucherStatus = (id) => {
    return AxiosClient.put(`/vouchers/toggle-status/${id}`);
};

export const getVoucherUsages = (id) => {
    return AxiosClient.get(`/vouchers/${id}/usages`);
};