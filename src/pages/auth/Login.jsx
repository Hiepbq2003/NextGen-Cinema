import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../services/api/AuthApi.jsx';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await loginApi({ username, password });
            login(res.data);
            
            toast.success(`Chào mừng ${res.data.fullName || username} trở lại!`);
            navigate('/'); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu!';
      
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="login-wrapper">
            <div className="login-side-image"></div>
            <div className="login-side-form">
                <div className="form-content">
                    <h3 className="form-title">Đăng Nhập</h3>
                    <p className="form-subtitle">Chào mừng bạn đến với NextGen Cinema.</p>

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

                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Mật khẩu</label>
                            <input 
                                className="form-control"
                              
                                type={showPassword ? "text" : "password"} 
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                          
                            <span 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    top: '38px',
                                    cursor: 'pointer',
                                    color: '#6c757d'
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Đang xử lý...' : 'Đăng Nhập Hệ Thống'}
                        </button>
                    </form>

                    <div className="divider">
                        <span>Hoặc</span>
                    </div>

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