import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../services/api/AuthApi.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './Login.css';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await registerApi(form);
            login(res);
            
            toast.success(`Đăng ký thành công! Chào mừng ${form.fullName}`);
            navigate('/home');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
       
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-side-image" style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop')"
            }}></div>

            <div className="login-side-form">
                <div className="form-content" style={{ maxWidth: '500px' }}>
                    <h3 className="form-title">Đăng Ký Mới</h3>
                    <p className="form-subtitle">Tạo tài khoản để trải nghiệm dịch vụ đặt vé tốt nhất.</p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Tên đăng nhập *</label>
                                <input 
                                    className="form-control"
                                    type="text" 
                                    name="username"
                                    placeholder="Ví dụ: abc123"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group" style={{ flex: 1, position: 'relative' }}>
                                <label>Mật khẩu *</label>
                                <input 
                                    className="form-control"
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    placeholder="Mật khẩu"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <span 
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '38px',
                                        cursor: 'pointer',
                                        color: '#6c757d'
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input 
                                className="form-control"
                                type="text" 
                                name="fullName"
                                placeholder="Nhập đầy đủ họ tên của bạn"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Địa chỉ Email *</label>
                            <input 
                                className="form-control"
                                type="email" 
                                name="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                className="form-control"
                                type="text" 
                                name="phone"
                                placeholder="Nhập số điện thoại (Không bắt buộc)"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn-submit" disabled={isLoading} style={{ marginTop: '20px' }}>
                            {isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}
                        </button>
                    </form>

                    <p style={{ marginTop: '25px', textAlign: 'center', color: '#666' }}>
                        Đã có tài khoản?{' '}
                        <span className="link-register" onClick={() => navigate('/login')}>
                            Đăng nhập ngay
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;