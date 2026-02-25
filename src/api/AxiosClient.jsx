import axios from 'axios';
import { getAuth, clearAuth } from '../../utils/Auth.jsx';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000, // Hủy request nếu backend phản hồi quá 10 giây 
});

// 2. REQUEST INTERCEPTOR: Can thiệp vào request trước khi gửi đi
axiosClient.interceptors.request.use(
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

// 3. RESPONSE INTERCEPTOR: Can thiệp vào response trước khi trả về cho Component
axiosClient.interceptors.response.use(
    (response) => {

        return response.data;
    },
    (error) => {
        // Xử lý các lỗi HTTP chung
        const status = error.response ? error.response.status : null;

        if (status === 401) {
            // Lỗi 401: Chưa đăng nhập hoặc Token đã hết hạn
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            clearAuth();
            
            // Đá người dùng về trang login (Dùng window.location vì đang ở ngoài React Component)
            window.location.href = '/login';
        } 
        else if (status === 403) {
            // Lỗi 403: Không có quyền truy cập (Ví dụ: USER cố gọi API của ADMIN)
            toast.error("Bạn không có quyền thực hiện hành động này!");
        }
        else if (status === 500) {
            // Lỗi từ Server Backend
            toast.error("Lỗi hệ thống (Server Error). Vui lòng thử lại sau!");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;