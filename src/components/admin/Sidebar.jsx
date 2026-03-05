import { NavLink } from 'react-router-dom';
import './AdminStyle.css';

const Sidebar = () => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-logo">
                🎫 NextGen Cinema
            </div>
            <ul className="sidebar-menu">
                <li>
                    {/* Thêm end để nó chỉ active khi url chính xác là /admin */}
                    <NavLink to="/admin" end>📊 Tổng quan</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/movies">🎬 Quản lý Phim</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/rooms">🚪 Quản lý Phòng chiếu</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/showtimes">📅 Quản lý Lịch chiếu</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;