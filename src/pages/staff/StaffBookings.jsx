import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient';
import '../../asset/style/StaffBookings.css';

const StaffBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [qrCodeInput, setQrCodeInput] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await AxiosClient.get('/admin/bookings');
            const data = res.data || res;
            const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
            setBookings(sortedData);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đơn vé!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickCheckIn = async (e) => {
        e.preventDefault();
        if (!qrCodeInput.trim()) return toast.warning("Vui lòng nhập mã vé!");
        try {
            await AxiosClient.patch(`/admin/tickets/check-in/${qrCodeInput.trim()}`);
            toast.success("✅ Soát vé thành công!");
            setQrCodeInput('');
            
            const res = await AxiosClient.get('/admin/bookings');
            const data = res.data || res;
            const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
            setBookings(sortedData);
            
            if (selectedBooking) {
                const updatedBooking = sortedData.find(b => b.id === selectedBooking.id);
                if (updatedBooking) setSelectedBooking(updatedBooking);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Mã vé không hợp lệ hoặc đã dùng!");
        }
    };

    const handleCheckInSingleTicket = async (ticketQrCode, seatName) => {
        if (window.confirm(`Xác nhận soát vé cho ghế [${seatName}]?`)) {
            try {
                await AxiosClient.patch(`/admin/tickets/check-in/${ticketQrCode}`);
                toast.success(`Đã soát vé ghế ${seatName}!`);
                
                const res = await AxiosClient.get('/admin/bookings');
                const data = res.data || res;
                const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
                setBookings(sortedData);
                
                const updatedBooking = sortedData.find(b => b.id === selectedBooking.id);
                if (updatedBooking) {
                    setSelectedBooking(updatedBooking);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Soát vé thất bại!");
            }
        }
    };

    // --- LOGIC HỦY VÉ: Cập nhật lại UI sau khi API chạy (Soft Delete) ---
    const handleCancelSingleTicket = async (ticketQrCode, seatName) => {
        if (window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn HỦY vé của ghế [${seatName}]? Ghế này sẽ bị hủy khỏi đơn và giải phóng chỗ.`)) {
            try {
                await AxiosClient.put(`/admin/tickets/cancel/${ticketQrCode}`);
                toast.success(`Đã hủy vé ghế ${seatName} thành công!`);
                
                const res = await AxiosClient.get('/admin/bookings');
                const data = res.data || res;
                const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
                setBookings(sortedData);
                
                const updatedBooking = sortedData.find(b => b.id === selectedBooking.id);
                if (updatedBooking) {
                    setSelectedBooking(updatedBooking);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Hủy vé thất bại!");
            }
        }
    };

    const handleApplyFilter = () => {
        setAppliedSearch(searchInput);
        setCurrentPage(1);
    };

    const filteredBookings = bookings.filter((b) => {
        const matchSearch =
            b.customerName?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
            b.email?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
            b.id?.toString() === appliedSearch;
        const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="staff-bookings-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>🎟️ Quầy Soát Vé</h2>
                <button className="staff-btn staff-btn-primary" onClick={fetchBookings}>
                    🔄 Làm mới
                </button>
            </div>

            <div className="staff-filter-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <form onSubmit={handleQuickCheckIn} style={{ display: 'flex', gap: '12px', width: '100%', alignItems: 'flex-end' }}>
                    <div className="staff-filter-group" style={{ flex: 1 }}>
                        <label style={{ color: '#166534' }}>⚡ SOÁT VÉ NHANH BẰNG MÃ VÉ / MÃ QR</label>
                        <input
                            className="staff-input"
                            type="text"
                            placeholder="Dùng máy quét QR hoặc nhập mã vé vào đây..."
                            value={qrCodeInput}
                            onChange={(e) => setQrCodeInput(e.target.value)}
                            style={{ borderColor: '#86efac' }}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="staff-btn staff-btn-success" style={{ height: '46px', padding: '0 24px' }}>
                        XÁC NHẬN SOÁT VÉ
                    </button>
                </form>
            </div>

            <div className="staff-filter-card">
                <div className="staff-filter-group" style={{ flex: 2 }}>
                    <label>Tra cứu Đơn hàng (Khách / Mã đơn / Email)</label>
                    <input
                        className="staff-input"
                        type="text"
                        placeholder="Nhập tên, email hoặc mã đơn..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
                    />
                </div>
                <div className="staff-filter-group" style={{ flex: 1 }}>
                    <label>Trạng thái đơn</label>
                    <select
                        className="staff-input"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chưa thanh toán</option>
                        <option value="PAID">Chờ duyệt</option>
                        <option value="COMPLETED">Đã duyệt</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
                <div className="staff-filter-group" style={{ justifyContent: 'flex-end' }}>
                    <button className="staff-btn staff-btn-primary" onClick={handleApplyFilter} style={{ height: '46px' }}>
                        🔍 LỌC DỮ LIỆU
                    </button>
                </div>
            </div>

            <div className="staff-table-card">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Khách hàng</th>
                            <th>Phim & Suất chiếu</th>
                            <th>Các ghế</th>
                            <th>Trạng thái</th>
                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</td></tr>
                        ) : paginatedBookings.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Không tìm thấy đơn vé nào!</td></tr>
                        ) : (
                            paginatedBookings.map((b) => (
                                <tr key={b.id}>
                                    <td><strong>#{b.id}</strong></td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{b.customerName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{b.email}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '600', color: '#3b82f6' }}>{b.movieTitle}</div>
                                        <div style={{ fontSize: '13px' }}>
                                            {b.showtimeStart ? new Date(b.showtimeStart).toLocaleString('vi-VN') : ''}
                                        </div>
                                    </td>
                                    <td>
                                        {/* ----- XỬ LÝ GẠCH NGANG CÁC GHẾ ĐÃ HỦY TẠI ĐÂY ----- */}
                                        <span style={{ background: '#fef2f2', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                                            {b.tickets?.length > 0 ? (
                                                b.tickets.map((t, index) => (
                                                    <span key={t.id} style={{
                                                        color: t.isCancelled ? '#94a3b8' : '#ef4444', 
                                                        textDecoration: t.isCancelled ? 'line-through' : 'none',
                                                        marginRight: '4px'
                                                    }}>
                                                        {t.seatName}{index < b.tickets.length - 1 ? ',' : ''}
                                                    </span>
                                                ))
                                            ) : 'Chưa xếp ghế'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`staff-badge ${(b.status || 'PENDING').toLowerCase()}`}>
                                            {b.status === 'PAID' ? 'Chờ soát vé' : b.status === 'COMPLETED' ? 'Đã duyệt' : b.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ TT'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className="staff-btn staff-btn-primary" onClick={() => setSelectedBooking(b)}>
                                            Chi tiết vé
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedBooking && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '650px', maxWidth: '95%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0 }}>Chi tiết đơn vé #{selectedBooking.id}</h3>
                        <p style={{ color: '#475569', marginBottom: '16px' }}>Khách hàng: <strong>{selectedBooking.customerName}</strong></p>
                        
                        <table className="staff-table" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '16px' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th>Ghế</th>
                                    <th>Mã vé (QR)</th>
                                    <th>Trạng thái</th>
                                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBooking.tickets?.map(t => (
                                    <tr key={t.id} style={{ opacity: t.isCancelled ? 0.6 : 1, background: t.isCancelled ? '#f8fafc' : 'transparent' }}>
                                        <td>
                                            <strong style={{ 
                                                color: t.isCancelled ? '#94a3b8' : '#ef4444', 
                                                textDecoration: t.isCancelled ? 'line-through' : 'none' 
                                            }}>
                                                {t.seatName}
                                            </strong>
                                        </td>
                                        <td>
                                            <small style={{ 
                                                color: '#64748b', 
                                                textDecoration: t.isCancelled ? 'line-through' : 'none' 
                                            }}>
                                                {t.qrCode?.substring(0, 13)}...
                                            </small>
                                        </td>
                                        <td>
                                            {/* ----- XỬ LÝ BADGE TRẠNG THÁI TRONG MODAL ----- */}
                                            {t.isCancelled ? (
                                                <span className="staff-badge" style={{ background: '#e2e8f0', color: '#475569', border: '1px solid #cbd5e1' }}>Đã hủy vé</span>
                                            ) : t.checkInStatus ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span className="staff-badge completed" style={{ width: 'fit-content' }}>Đã vào rạp</span>
                                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                                        ⏱️ {t.checkInTime ? new Date(t.checkInTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Chưa rõ'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="staff-badge pending">Chưa dùng</span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {/* ----- ẨN NÚT THAO TÁC NẾU VÉ ĐÃ HỦY HOẶC ĐÃ SOÁT ----- */}
                                            {!t.checkInStatus && !t.isCancelled && selectedBooking.status !== 'CANCELLED' && (
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                    <button className="staff-btn staff-btn-success" style={{ padding: '6px 10px', fontSize: '12px' }}
                                                        onClick={() => handleCheckInSingleTicket(t.qrCode, t.seatName)}>
                                                        ✅ Cho vào
                                                    </button>
                                                    
                                                    <button className="staff-btn staff-btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }}
                                                        onClick={() => handleCancelSingleTicket(t.qrCode, t.seatName)}>
                                                        ❌ Hủy vé
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ textAlign: 'right', marginTop: '16px' }}>
                            <button className="staff-btn" style={{ background: '#e2e8f0', color: '#334155' }} onClick={() => setSelectedBooking(null)}>
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <div className="staff-pagination">
                    <button className="staff-page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Trang trước</button>
                    <span className="staff-page-info">Trang {currentPage} / {totalPages}</span>
                    <button className="staff-page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Trang tiếp</button>
                </div>
            )}
        </div>
    );
};

export default StaffBookings;