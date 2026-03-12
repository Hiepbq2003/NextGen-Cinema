import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import '@/asset/style/AdminLayoutStyle.css';

const StaffLayout = () => {
    return (
        <div className="admin-layout">
            <StaffSidebar />
            <div className="admin-main">
                <div className="admin-content" style={{ background: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;