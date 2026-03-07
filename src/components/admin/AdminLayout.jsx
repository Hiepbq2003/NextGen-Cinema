import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../common/Header';
import './AdminStyle.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <Header />
                <div className="admin-content">
                    {/* Outlet chính là nơi các component con (Dashboard, Movies, Rooms...) sẽ render vào */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;