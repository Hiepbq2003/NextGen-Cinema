import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { 
    FaFilm, FaUsers, FaTicketAlt, FaMoneyBillWave, 
    FaChartLine, FaTags, FaClock, FaDoorOpen, FaUserShield 
} from 'react-icons/fa';
import AxiosClient from '../../services/api/AxiosClient';
import '../../asset/style/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await AxiosClient.get('/admin/dashboard/stats');
                setData(res.data || res);
            } catch (error) {
                console.error("Lỗi tải dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="ad-page">Đang tổng hợp dữ liệu phân tích...</div>;

    return (
        <div className="ad-page">
            <div className="ab-header" style={{ marginBottom: '30px' }}>
                <div>
                    <h2 className="ab-title">Hệ thống Quản trị NextGen</h2>
                    <p className="ab-desc">Báo cáo tổng quan về doanh thu và hoạt động của rạp phim.</p>
                </div>
            </div>

            {/* 1. STATS CARDS */}
            <div className="ad-stats-grid">
                <div className="ad-stat-card">
                    <div className="ad-stat-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}><FaMoneyBillWave /></div>
                    <div className="ad-stat-info">
                        <h3>Doanh thu tổng</h3>
                        <p className="ad-stat-value">{data.totalRevenue?.toLocaleString()}đ</p>
                    </div>
                </div>
                <div className="ad-stat-card">
                    <div className="ad-stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><FaTicketAlt /></div>
                    <div className="ad-stat-info">
                        <h3>Đơn đặt vé</h3>
                        <p className="ad-stat-value">{data.totalBookings}</p>
                    </div>
                </div>
                <div className="ad-stat-card">
                    <div className="ad-stat-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}><FaUsers /></div>
                    <div className="ad-stat-info">
                        <h3>Người dùng</h3>
                        <p className="ad-stat-value">{data.totalUsers}</p>
                    </div>
                </div>
                <div className="ad-stat-card">
                    <div className="ad-stat-icon" style={{ background: '#fff7ed', color: '#f97316' }}><FaFilm /></div>
                    <div className="ad-stat-info">
                        <h3>Phim hiện có</h3>
                        <p className="ad-stat-value">{data.totalMovies}</p>
                    </div>
                </div>
            </div>

            {/* 2. CHARTS */}
            <div className="ad-charts-row">
                <div className="ad-chart-card">
                    <h4><FaChartLine color="#3b82f6" /> Doanh thu 7 ngày gần nhất</h4>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <LineChart data={data.dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `${v/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(v) => [v.toLocaleString() + ' VNĐ', 'Doanh thu']} 
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="ad-chart-card">
                    <h4><FaFilm color="#ef4444" /> Doanh thu theo phim</h4>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.movieRevenue} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="movieName" type="category" width={100} tick={{fontSize: 11, fontWeight: 600}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} formatter={(v) => v.toLocaleString() + 'đ'} />
                                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.movieRevenue.map((_, index) => (
                                        <Cell key={index} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. QUICK NAV */}
            <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>Lối tắt quản lý nhanh</h4>
            <div className="ad-nav-grid">
                <div className="ad-nav-item" onClick={() => navigate('/admin/movies')}>
                    <FaFilm size={24} /> <span>Phim</span>
                </div>
                <div className="ad-nav-item" onClick={() => navigate('/admin/bookings')}>
                    <FaTicketAlt size={24} /> <span>Đơn vé</span>
                </div>
                <div className="ad-nav-item" onClick={() => navigate('/admin/showtimes')}>
                    <FaClock size={24} /> <span>Lịch chiếu</span>
                </div>
                <div className="ad-nav-item" onClick={() => navigate('/admin/vouchers')}>
                    <FaTags size={24} /> <span>Voucher</span>
                </div>
                <div className="ad-nav-item" onClick={() => navigate('/admin/staffs')}>
                    <FaUserShield size={24} /> <span>Nhân sự</span>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;