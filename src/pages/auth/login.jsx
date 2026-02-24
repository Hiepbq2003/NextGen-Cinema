import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/api/authApi.jsx';
import { useAuth } from '../../context/AuthContext';
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await loginApi({ username, password });
            login(res.data);
            navigate('/'); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu!';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm gọi đến Backend để lấy link xác thực OAuth2
    const handleGoogleLogin = () => {
        // Chuyển hướng trình duyệt tới endpoint Google OAuth2 mặc định của Spring Boot
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="login-wrapper">
            {/* Cột 1: Hiển thị hình ảnh rạp phim bên trái */}
            <div className="login-side-image"></div>

            {/* Cột 2: Form đăng nhập bên phải */}
            <div className="login-side-form">
                <div className="form-content">
                    <h3 className="form-title">Đăng Nhập</h3>
                    <p className="form-subtitle">Chào mừng bạn đến với NextGen Cinema.</p>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input 
                                className="form-control"
                                type="text" 
                                placeholder="Nhập username của bạn"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input 
                                className="form-control"
                                type="password" 
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập Hệ Thống'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>Hoặc</span>
                    </div>

                    {/* Nút đăng nhập bằng Google */}
                    <button type="button" className="btn-google" onClick={handleGoogleLogin}>
                 
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
                        Đăng nhập bằng Google
                    </button>

                    <p style={{ marginTop: '25px', textAlign: 'center', color: '#666' }}>
                        Chưa có tài khoản?{' '}
                        <span className="link-register" onClick={() => navigate('/register')}>
                            Đăng ký ngay
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;