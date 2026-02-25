import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from "../../services/api/AuthApi";
import { toast } from 'react-toastify';
import './Login.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email , setEmail] = useState("");
    const [otp , setOtp] = useState("");
    const [newPassword , setNewPassword] = useState("");
    const [isLoading , setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword({email}) ;
            toast.success('Mã OTP đã được gửi đến email của bạn!');
            setStep(2);
        }catch(err){
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi gửi email!';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await resetPassword({ email, otp, newPassword });
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
            navigate('/login'); 
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Mã OTP không hợp lệ!';
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
                <div className="form-content">
                    <h3 className="form-title">Khôi Phục Mật Khẩu</h3>
                    
                    {step === 1 ? (
                        <>
                            <p className="form-subtitle">Nhập email của bạn để nhận mã OTP khôi phục.</p>
                            <form onSubmit={handleSendEmail}>
                                <div className="form-group">
                                    <label>Địa chỉ Email</label>
                                    <input 
                                        className="form-control"
                                        type="email" 
                                        placeholder="Nhập email đã đăng ký"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={isLoading}>
                                    {isLoading ? 'Đang gửi mã...' : 'Gửi mã OTP'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <p className="form-subtitle">Nhập mã OTP vừa được gửi đến <b>{email}</b></p>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label>Mã OTP</label>
                                    <input 
                                        className="form-control"
                                        type="text" 
                                        placeholder="Nhập 6 số OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu mới</label>
                                    <input 
                                        className="form-control"
                                        type="password" 
                                        placeholder="Nhập mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-submit" disabled={isLoading}>
                                    {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                                </button>
                            </form>
                        </>
                    )}

                    <p style={{ marginTop: '25px', textAlign: 'center', color: '#666' }}>
                        Nhớ mật khẩu rồi?{' '}
                        <span className="link-register" onClick={() => navigate('/login')}>
                            Quay lại đăng nhập
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
