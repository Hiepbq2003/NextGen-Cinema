import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StaffSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-sidebar" style={{ background: '#2c3e50' }}>
            <div className="sidebar-header" style={{ borderBottom: '1px solid #34495e' }}>
                <h2 style={{ color: '#ecf0f1' }}>🎬 STAFF PORTAL</h2>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink to="/staff/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    📊 Tổng quan (Dashboard)
                </NavLink>

                <NavLink to="/staff/bookings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    🎟️ Quản lý & Soát vé
                </NavLink>

                <NavLink to="/staff/pos" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    🍿 Bán vé tại quầy
                </NavLink>
            </nav>

            <div style={{ position: 'absolute', bottom: '20px', width: '100%', padding: '0 20px' }}>
                <button 
                    onClick={handleLogout} 
                    style={{ width: '100%', padding: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default StaffSidebar;