import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../services/api/UserApi';
import { toast } from 'react-toastify';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const hasProcessed = useRef(false);

    useEffect(() => {
    
        if (hasProcessed.current) return;

        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            hasProcessed.current = true; 

            const fetchProfile = async () => {
                try {
            
                    localStorage.setItem('auth', JSON.stringify({ token }));

                    const userProfile = await getMyProfile();
                    const fullAuthData = { 
                        token, 
                        ...userProfile,
                        role: userProfile.role
                    };
                    
                    login(fullAuthData);
                    toast.success("Đăng nhập Google thành công!");
                    navigate('/home');
                } catch (error) {
                    console.error(error);
                    toast.error("Lỗi khi lấy thông tin tài khoản!");
                    localStorage.removeItem('auth');
                    navigate('/login');
                }
            };
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, [location.search, login, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <p>Đang xác thực tài khoản Google, vui lòng đợi...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;