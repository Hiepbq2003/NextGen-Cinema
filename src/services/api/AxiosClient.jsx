import axios from 'axios';
import { getAuth, clearAuth } from '../../utils/Auth';
import { toast } from 'react-toastify';

const AxiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000,
});

AxiosClient.interceptors.request.use(
    (config) => {
        const auth = getAuth();
        if (auth && auth.token) {
            config.headers.Authorization = `Bearer ${auth.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosClient.interceptors.response.use(
    (response) => {

        return response.data?.data !== undefined ? response.data.data : response.data;
    },
    (error) => {

        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Lỗi 401: Chưa đăng nhập hoặc Token đã hết hạn
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            clearAuth();
            
            window.location.href = '/login';
        } 
        else if (status === 403) {
            // Lỗi 403: Không có quyền truy cập
            toast.error("Tài khoản của bạn có vấn đề!");
        }
        else if (status === 500) {
         
            toast.error("Lỗi hệ thống (Server Error). Vui lòng thử lại sau!");
        }

        return Promise.reject(error);
    }
);

export default AxiosClient;
