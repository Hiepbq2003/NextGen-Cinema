import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient';

const StaffDashboard = () => {
    const [stats, setStats] = useState({
        ongoingShowtimes: 0,
        pendingTickets: 0,
        posTickets: 0
    });
    const [isLoading, setIsLoading] = useState(true);

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

                // 1. Ca chiếu đang diễn ra: status là NOW_SHOWING (nếu có) hoặc đang trong khoảng start-endTime
                let ongoingCount = 0;
                showtimes.forEach(st => {
                    if (st.status === 'NOW_SHOWING') {
                        ongoingCount++;
                    } else if (!st.status || st.status === 'SCHEDULED') {
                        const start = new Date(st.startTime);
                        const end = new Date(st.endTime);
                        if (now >= start && now <= end) {
                            ongoingCount++;
                        }
                    }
                });

                // 2. Vé chờ soát hôm nay (Đã thanh toán PAID nhưng chưa vào)
                let pendingTicketsCount = 0;
                let posTicketsCount = 0;

                bookings.forEach(b => {
                    const stTime = new Date(b.showtimeStart);
                    const isToday = stTime >= todayStart && stTime <= todayEnd;

                    if (isToday) {
                        // Tính vé chờ soát
                        if (b.status === 'PAID') {
                            const uncheckTickets = (b.tickets || []).filter(t => !t.checkInStatus && !t.isCancelled);
                            pendingTicketsCount += uncheckTickets.length;
                        }

                        // Tính lượng vé mua tại quầy hôm nay (CASH)
                        if (b.paymentMethod === 'CASH') {
                            const validTickets = (b.tickets || []).filter(t => !t.isCancelled);
                            posTicketsCount += validTickets.length;
                        }
                    }
                });

                setStats({
                    ongoingShowtimes: ongoingCount,
                    pendingTickets: pendingTicketsCount,
                    posTickets: posTicketsCount
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

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2>👋 Xin chào, Nhân viên!</h2>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #17a2b8' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Ca chiếu đang diễn ra</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>
                        {isLoading ? '...' : stats.ongoingShowtimes}
                    </h1>
                </div>
                
                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #28a745' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Vé chờ soát hôm nay</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>
                        {isLoading ? '...' : stats.pendingTickets}
                    </h1>
                </div>

                <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #ffc107' }}>
                    <h3 style={{ color: '#666', margin: 0 }}>Vé quầy (Hôm nay)</h3>
                    <h1 style={{ margin: '10px 0 0', fontSize: '30px' }}>
                        {isLoading ? '...' : stats.posTickets}
                    </h1>
                </div>
            </div>
            
            <div style={{ marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3>Nhiệm vụ cần làm</h3>
                <p>1. Hỗ trợ khách hàng check-in vé qua mã đơn tại <b>Quầy Soát Vé</b>.</p>
                <p>2. Xử lý đặt vé trực tiếp cho khách Walk-in tại <b>Bán vé tại quầy (POS)</b>.</p>
                <p>3. Giải quyết khiếu nại hoặc hủy đơn nếu có sự cố phòng chiếu.</p>
            </div>
        </div>
    );
};

export default StaffDashboard;