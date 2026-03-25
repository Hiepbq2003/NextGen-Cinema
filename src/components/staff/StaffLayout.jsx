import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar';
import '../../asset/style/AdminLayoutStyle.css';
import StaffHeader from './StaffHeader';
const StaffLayout = () => {
    return (
        <div className="admin-container">
            <StaffSidebar />
            <div className="admin-main">
                <StaffHeader />
                <div className="admin-content" style={{ background: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
                    <Outlet /> 
                </div>
            </div>
        </div>
    );
};

export default StaffLayout;