import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient';
import { Link } from 'react-router-dom';
import { 
    MonitorPlay, 
    TicketCheck, 
    Store,
    Clock,
    Calendar,
    ChevronRight,
    Film,
    MapPin,
    CheckCircle2,
    User
} from 'lucide-react';

const StaffDashboard = () => {
    const [stats, setStats] = useState({
        ongoingShowtimes: 0,
        pendingTickets: 0,
        posTickets: 0 // Will map to today's tickets
    });
    
    const [recentBookings, setRecentBookings] = useState([]);
    const [upcomingShowtimes, setUpcomingShowtimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch bookings
                const bookingsRes = await AxiosClient.get('/admin/bookings');
                const bookings = Array.isArray(bookingsRes.data || bookingsRes) ? (bookingsRes.data || bookingsRes) : [];
                
                // Fetch showtimes
                const showtimesRes = await AxiosClient.get('/showtimes');
                const showtimes = Array.isArray(showtimesRes.data || showtimesRes) ? (showtimesRes.data || showtimesRes) : [];

                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

                // 1. Ongoing showtimes
                let ongoingCount = 0;
                let upcoming = [];
                showtimes.forEach(st => {
                    const start = new Date(st.startTime);
                    const end = new Date(st.endTime);
                    if (st.status === 'NOW_SHOWING' || (now >= start && now <= end)) {
                        ongoingCount++;
                    }
                    if (start >= now && start <= todayEnd) {
                        upcoming.push(st);
                    }
                });

                upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                setUpcomingShowtimes(upcoming.slice(0, 5));

                // 2. Metrics & Recent bookings
                let pendingTicketsCount = 0;
                let todayTicketsCount = 0;
                let validRecentBookings = [];

                bookings.forEach(b => {
                    const createdAt = b.createdAt ? new Date(b.createdAt) : new Date(b.showtimeStart);
                    const isToday = createdAt >= todayStart && createdAt <= todayEnd;

                    if (isToday) {
                        if (b.status === 'PAID') {
                            const uncheckTickets = (b.tickets || []).filter(t => !t.checkInStatus && !t.isCancelled);
                            pendingTicketsCount += uncheckTickets.length;
                        }

                        // Just count all valid tickets created today as today's volume (since paymentMethod isn't mapped)
                        const validTickets = (b.tickets || []).filter(t => !t.isCancelled);
                        todayTicketsCount += validTickets.length;
                    }

                    if (b.status === 'PAID' || b.status === 'COMPLETED' || b.status === 'PENDING') {
                        validRecentBookings.push(b);
                    }
                });

                validRecentBookings.sort((a, b) => new Date(b.createdAt || b.showtimeStart) - new Date(a.createdAt || a.showtimeStart));
                setRecentBookings(validRecentBookings.slice(0, 6));

                setStats({
                    ongoingShowtimes: ongoingCount,
                    pendingTickets: pendingTicketsCount,
                    posTickets: todayTicketsCount
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu Staff Dashboard", error);
                toast.error("Không thể tải số liệu thống kê hiện tại!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    return (
        <div style={{ padding: '0px 20px', minHeight: '100%', background: '#f8f9fa' }}>
            {/* HER0 HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px', borderBottom: '2px solid #e9ecef', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', margin: '0 0 5px 0', color: '#1f2937', fontWeight: '800' }}>
                        👋 Xin chào, <span style={{ color: '#3b82f6' }}>Nhân viên</span>
                    </h1>
                    <p style={{ margin: 0, color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={16} /> Hôm nay: {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', fontFamily: 'monospace', letterSpacing: '-1px' }}>
                        {currentTime.toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* METRICS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ca chiếu đang diễn ra</p>
                        <h2 style={{ margin: 0, fontSize: '36px', color: '#111827', fontWeight: '800' }}>{isLoading ? '...' : stats.ongoingShowtimes}</h2>
                    </div>
                    <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '50%', color: '#3b82f6' }}>
                        <MonitorPlay size={32} strokeWidth={2.5} />
                    </div>
                </div>
                
                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vé chờ soát (Hôm nay)</p>
                        <h2 style={{ margin: 0, fontSize: '36px', color: '#111827', fontWeight: '800' }}>{isLoading ? '...' : stats.pendingTickets}</h2>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '50%', color: '#10b981' }}>
                        <TicketCheck size={32} strokeWidth={2.5} />
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <div>
                        <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổng vé bán (Hôm nay)</p>
                        <h2 style={{ margin: 0, fontSize: '36px', color: '#111827', fontWeight: '800' }}>{isLoading ? '...' : stats.posTickets}</h2>
                    </div>
                    <div style={{ background: '#fdf4ff', padding: '16px', borderRadius: '50%', color: '#d946ef' }}>
                        <Store size={32} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '25px' }}>
                
                {/* RECENT BOOKINGS TABLE */}
                <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, color: '#111827', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Film size={20} color="#6b7280" /> Giao dịch vé gần đây
                        </h3>
                        <Link to="/staff/bookings" style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            Xem tất cả <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f9fafb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Khách hàng</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Phim</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Phòng / Ghế</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Tổng tiền</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Đang tải dữ liệu...</td></tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Chưa có giao dịch nào gần đây.</td></tr>
                                ) : (
                                    recentBookings.map((bk, idx) => (
                                        <tr key={bk.id} style={{ borderBottom: idx !== recentBookings.length - 1 ? '1px solid #f3f4f6' : 'none', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='#f9fafb'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                                        {bk.customerName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: '600', color: '#111827', fontSize: '14px' }}>{bk.customerName || 'Khách vãng lai'}</p>
                                                        <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>ID: #{bk.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', color: '#111827', fontWeight: '500', fontSize: '14px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {bk.movieTitle || 'N/A'}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>P. {bk.roomName}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{bk.seats?.join(', ')}</p>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: '600', color: '#059669', fontSize: '14px' }}>
                                                {formatCurrency(bk.totalAmount)}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600',
                                                    background: bk.status === 'PAID' ? '#dcfce7' : bk.status === 'COMPLETED' ? '#f3e8ff' : '#fef9c3',
                                                    color: bk.status === 'PAID' ? '#166534' : bk.status === 'COMPLETED' ? '#6b21a8' : '#854d0e'
                                                }}>
                                                    {bk.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    {/* UPCOMING SHOWTIMES */}
                    <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', padding: '24px' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#111827', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={20} color="#f59e0b" /> Suất chiếu sắp tới
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {isLoading ? (
                                <div style={{ color: '#6b7280', fontSize: '14px' }}>Đang tải...</div>
                            ) : upcomingShowtimes.length === 0 ? (
                                <div style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '20px 0', background: '#f9fafb', borderRadius: '8px' }}>Không có suất chiếu nào sắp tới trong hôm nay.</div>
                            ) : upcomingShowtimes.map(st => (
                                <div key={st.id} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', textAlign: 'center', minWidth: '60px' }}>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{formatTime(st.startTime)}</div>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.movie?.title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                                            <MapPin size={12} /> Phòng {st.room?.name} &bull; {st.availableSeats !== undefined ? `${st.availableSeats} ghế trống` : '---'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* QUICK ACTIONS / TASKS */}
                    <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '24px', color: '#fff' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#e0e7ff' }}>
                            <CheckCircle2 size={20} color="#818cf8" /> Thao tác nhanh
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link to="/staff/bookings" style={{ textDecoration: 'none' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}><TicketCheck size={20} color="#fff" /></div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>Soát vé khách hàng</div>
                                        <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>Quét mã QR hoặc check-in tay</div>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/staff/pos" style={{ textDecoration: 'none' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px' }}><Store size={20} color="#fff" /></div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '15px' }}>Bán vé tại Quầy</div>
                                        <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '2px' }}>Hỗ trợ khách mua vé trực tiếp</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StaffDashboard;