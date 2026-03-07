import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import './AdminStyle.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <Sidebar />
            <div className="admin-main">
                <AdminHeader /> 
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default AdminLayout;