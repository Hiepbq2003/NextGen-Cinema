import { useState, useEffect } from 'react';

const AdminDashboard = () => {

    const [stats, setStats] = useState({
        totalMovies: 18,
        totalUsers: 245,
        totalBookings: 890,
        totalRevenue: 125500000
    });

    const formatVND = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>📊 Tổng quan hệ thống</h2>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '20px', 
                marginBottom: '30px' 
            }}>
                {/* Thẻ 1: Phim */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '5px solid #007bff' }}>
                    <div style={{ fontSize: '2.5rem', background: '#e6f2ff', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>🎬</div>
                    <div>
                        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: 'bold' }}>Phim đang chiếu</p>
                        <h3 style={{ margin: '5px 0 0', fontSize: '24px', color: '#333' }}>{stats.totalMovies}</h3>
                    </div>
                </div>

                {/* Thẻ 2: Khách hàng */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '5px solid #28a745' }}>
                    <div style={{ fontSize: '2.5rem', background: '#e6f9ed', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>👥</div>
                    <div>
                        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: 'bold' }}>Khách hàng</p>
                        <h3 style={{ margin: '5px 0 0', fontSize: '24px', color: '#333' }}>{stats.totalUsers}</h3>
                    </div>
                </div>

                {/* Thẻ 3: Vé */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '5px solid #ffc107' }}>
                    <div style={{ fontSize: '2.5rem', background: '#fff8e6', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>🎟️</div>
                    <div>
                        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: 'bold' }}>Số vé đã bán</p>
                        <h3 style={{ margin: '5px 0 0', fontSize: '24px', color: '#333' }}>{stats.totalBookings}</h3>
                    </div>
                </div>

                {/* Thẻ 4: Doanh thu */}
                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '18px', borderLeft: '5px solid #dc3545' }}>
                    <div style={{ fontSize: '2.5rem', background: '#fceced', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>💰</div>
                    <div>
                        <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: 'bold' }}>Tổng Doanh thu</p>
                        <h3 style={{ margin: '5px 0 0', fontSize: '20px', color: '#333' }}>{formatVND(stats.totalRevenue)}</h3>
                    </div>
                </div>
            </div>

            {/* Bảng Placeholder (Giao dịch gần đây) */}
            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '18px' }}>🕒 Hoạt động mua vé gần đây</h3>
                <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #e9ecef', borderRadius: '8px', color: '#888' }}>
                    Đang kết nối API để tải dữ liệu giao dịch...
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;