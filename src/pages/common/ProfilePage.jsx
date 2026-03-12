import React, { useState, useEffect } from 'react';
import { getMyProfile, updateProfile, changePassword } from '../../services/api/UserApi.jsx'; // Cập nhật link
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Header from '../../components/common/Header'; 
import { ROLE_ADMIN } from '../../utils/Constants.jsx';
import '@/asset/style/ProfilePage.css';

const ProfilePage = () => {
    const { auth, login } = useAuth();
    const [profile, setProfile] = useState({ fullName: '', phone: '', email: '', username: '', provider: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getMyProfile();
            setProfile(res);
        } catch (error) {
            toast.error("Không thể tải thông tin cá nhân");
        }
    };

  const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$/;
        if (!nameRegex.test(profile.fullName.trim())) {
            toast.error("Họ tên không hợp lệ (Phải từ 2 ký tự và không chứa ký tự đặc biệt)");
            return;
        }

        if (profile.phone) {
            const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phoneRegex.test(profile.phone.trim())) {
                toast.error("Số điện thoại không đúng định dạng (10 số, bắt đầu bằng 0 hoặc +84)");
                return;
            }
        }

        setIsLoading(true);
        try {
            await updateProfile({ 
                fullName: profile.fullName.trim(), 
                phone: profile.phone ? profile.phone.trim() : null 
            });
            toast.success("Cập nhật thông tin thành công!");
            login({ ...auth, fullName: profile.fullName.trim() });
        } catch (error) {
       
            const errorMsg = error.response?.data?.message || "Lỗi khi cập nhật";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword({ 
                oldPassword: passwordData.oldPassword, 
                newPassword: passwordData.newPassword 
            });
            toast.success("Đổi mật khẩu thành công!");
            setIsModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Mật khẩu cũ không đúng!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-container">

            <div className="profile-content">
                <h2 className="profile-title">Tài khoản cá nhân</h2>

                <div className="profile-card">
                    <h3>Hồ sơ của tôi</h3>
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input type="text" value={profile.username} disabled className="form-input-disabled" />
                        </div>
                        <div className="form-group">
                            <label>Email liên kết</label>
                            <input type="email" value={profile.email} disabled className="form-input-disabled" />
                        </div>
                        <div className="form-group">
                            <label>Họ và tên *</label>
                            <input 
                                type="text" 
                                value={profile.fullName} 
                                onChange={(e) => setProfile({...profile, fullName: e.target.value})} 
                                required 
                                className="form-input" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input 
                                type="text" 
                                value={profile.phone || ''} 
                                onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                                className="form-input" 
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" className="btn-update" disabled={isLoading}>Lưu thay đổi</button>
                            <button type="button" className="btn-show-password" onClick={() => setIsModalOpen(true)}>Đổi mật khẩu</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL ĐỔI MẬT KHẨU */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3 style={{ margin: 0 }}>Cập nhật mật khẩu</h3>
                        </div>

                        {profile.provider === 'GOOGLE' ? (
                            <div className="google-info-box">
                                <p style={{ marginTop: 0 }}>🔒 <b>Tài khoản Google</b></p>
                                <p>Bạn đang sử dụng đăng nhập qua Google. Để đảm bảo an toàn, vui lòng thực hiện đổi mật khẩu trong phần cài đặt bảo mật của Google.</p>
                                <div className="modal-footer">
                                    <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Đóng</button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleChangePassword}>
                                <div className="profile-form">
                                    <div className="form-group">
                                        <label>Mật khẩu hiện tại</label>
                                        <input 
                                            type="password" 
                                            className="form-input"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            className="form-input"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Xác nhận mật khẩu mới</label>
                                        <input 
                                            type="password" 
                                            className="form-control"
                                            style={{ padding: '12px' }}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                    <button type="submit" className="btn-save" disabled={isLoading}>Xác nhận đổi</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;