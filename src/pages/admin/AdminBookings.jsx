import { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../../services/api/BookingApi.jsx';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaUser, FaFilm, FaDoorOpen, FaClock, FaSearch, FaFilter, FaInfoCircle } from 'react-icons/fa';
import '../../asset/style/AdminBooking.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getAllBookings();
            const sortedData = (Array.isArray(res) ? res : []).sort((a, b) => b.id - a.id);
            setBookings(sortedData);
        } catch (error) {
            toast.error("Không thể tải danh sách đặt vé");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn hủy đơn vé này không? Toàn bộ ghế sẽ được giải phóng cho khách khác.")) {
            try {
                await cancelBooking(id);
                toast.success("Hủy đơn đặt vé thành công!");
                fetchBookings();
                if (isModalOpen) setIsModalOpen(false);
            } catch (error) {
                toast.error(error.response?.data?.message || "Không thể hủy đơn vé này");
            }
        }
    };

    const filteredBookings = bookings.filter((b) => {
        const matchSearch = 
            b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.id?.toString().includes(searchTerm);
            
        const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'PAID': 
            case 'CONFIRMED': return 'ab-badge ab-badge-scheduled';
            case 'COMPLETED': return 'ab-badge ab-badge-active';
            case 'CANCELLED': return 'ab-badge ab-badge-cancelled';
            case 'PENDING': return 'ab-badge ab-badge-upcoming';
            default: return 'ab-badge';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PAID': 
            case 'CONFIRMED': return 'Đã thanh toán';
            case 'COMPLETED': return 'Đã sử dụng';
            case 'CANCELLED': return 'Đã hủy';
            case 'PENDING': return 'Chờ thanh toán';
            default: return status;
        }
    };

    return (
        <div className="ab-page">
   
            <div className="ab-header">
                <div>
                    <h2 className="ab-title">
                        <FaTicketAlt color="#3b82f6" /> Quản lý Đơn Đặt Vé
                    </h2>
                    <p className="ab-desc">Quản lý, tra cứu và xử lý các giao dịch mua vé của khách hàng.</p>
                </div>
                <button className="ab-refresh-btn" onClick={fetchBookings}>
                    🔄 Làm mới dữ liệu
                </button>
            </div>

            <div className="ab-filter-card">
                <div className="ab-filter-group" style={{ flex: 2, minWidth: '250px' }}>
                    <label>Tra cứu giao dịch</label>
                    <div className="ab-input-wrapper">
                        <FaSearch className="ab-input-icon" />
                        <input 
                            type="text" 
                            className="ab-input"
                            placeholder="Nhập tên khách hàng, email hoặc mã đơn (#ID)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="ab-filter-group" style={{ flex: 1, minWidth: '200px' }}>
                    <label>Trạng thái đơn</label>
                    <div className="ab-input-wrapper">
                        <FaFilter className="ab-input-icon" />
                        <select 
                            className="ab-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ thanh toán</option>
                            <option value="PAID">Đã thanh toán (Chờ soát vé)</option>
                            <option value="COMPLETED">Đã sử dụng</option>
                            <option value="CANCELLED">Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="ab-table-card">
                <div className="ab-table-wrapper">
                    <table className="ab-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách hàng</th>
                                <th>Phim & Suất chiếu</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                                        <FaTicketAlt size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                        <div style={{ fontSize: '16px', fontWeight: '500' }}>Không tìm thấy đơn vé nào phù hợp!</div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedBookings.map(b => (
                                    <tr key={b.id}>
                                        <td><span className="ab-order-id">#{b.id}</span></td>
                                        <td>
                                            <div className="ab-customer-name">{b.customerName}</div>
                                            <div className="ab-customer-email">{b.email}</div>
                                        </td>
                                        <td>
                                            <div className="ab-movie-title">{b.movieTitle}</div>
                                            <div className="ab-movie-info">
                                                <span><FaDoorOpen color="#94a3b8" /> {b.roomName}</span>
                                                <span><FaClock color="#94a3b8" /> {new Date(b.showtimeStart).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="ab-total-amount">{b.totalAmount.toLocaleString()} đ</span>
                                        </td>
                                        <td>
                                            <span className={getStatusClass(b.status)}>
                                                {getStatusText(b.status)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="ab-action-btn" onClick={() => handleViewDetails(b)}>
                                                <FaInfoCircle /> Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <span style={{ fontSize: '14px', color: '#64748b' }}>
                            Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> - <b>{Math.min(currentPage * itemsPerPage, filteredBookings.length)}</b> trong tổng số <b>{filteredBookings.length}</b> đơn
                        </span>
                        
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '6px 12px', background: currentPage === 1 ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                            >
                                Trước
                            </button>
                            
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                    style={{
                                        padding: '6px 12px',
                                        background: currentPage === page ? '#3b82f6' : (page === '...' ? 'transparent' : '#fff'),
                                        color: currentPage === page ? '#fff' : (page === '...' ? '#94a3b8' : '#475569'),
                                        border: page === '...' ? 'none' : (currentPage === page ? '1px solid #3b82f6' : '1px solid #cbd5e1'),
                                        borderRadius: '6px',
                                        fontWeight: currentPage === page ? 'bold' : '600',
                                        cursor: page === '...' ? 'default' : 'pointer',
                                        fontSize: '13px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '6px 12px', background: currentPage === totalPages ? '#f1f5f9' : '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#475569', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' }}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CHI TIẾT ĐƠN HÀNG */}
            {isModalOpen && selectedBooking && (
                <div className="ab-modal-overlay">
                    <div className="ab-modal-content">
                        
                        <div className="ab-modal-header">
                            <h3>Biên lai thanh toán <span className="ab-modal-id">#{selectedBooking.id}</span></h3>
                            <button className="ab-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        
                        <div className="ab-modal-body">
                            <div className="ab-modal-customer">
                                <div className="ab-modal-avatar"><FaUser size={22} /></div>
                                <div>
                                    <div className="ab-modal-cus-name">{selectedBooking.customerName}</div>
                                    <div className="ab-modal-cus-email">{selectedBooking.email}</div>
                                </div>
                            </div>

                            <div className="ab-modal-movie">
                                <div className="ab-modal-movie-title">
                                    <div className="ab-modal-movie-icon"><FaFilm size={16} /></div>
                                    <span>{selectedBooking.movieTitle}</span>
                                </div>
                                <div className="ab-modal-movie-details">
                                    <span><FaDoorOpen color="#3b82f6" /> <b>{selectedBooking.roomName}</b></span>
                                    <span><FaClock color="#f59e0b" /> <b>{new Date(selectedBooking.showtimeStart).toLocaleString('vi-VN')}</b></span>
                                </div>
                            </div>

                            <div>
                                <div className="ab-modal-seats-title">DANH SÁCH GHẾ ĐẶT ({selectedBooking.seats?.length || 0})</div>
                                <div className="ab-modal-seats-list">
                                    {selectedBooking.seats && selectedBooking.seats.length > 0 ? (
                                        selectedBooking.seats.map(s => (
                                            <span key={s} className="ab-modal-seat-tag">{s}</span>
                                        ))
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có thông tin ghế</span>
                                    )}
                                </div>
                            </div>

                            <div className="ab-modal-divider"></div>

                            <div className="ab-modal-summary">
                                <div>
                                    <div className="ab-summary-date">
                                        Ngày tạo: <b>{new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}</b>
                                    </div>
                                    <div className="ab-summary-status">
                                        Trạng thái: <span className={getStatusClass(selectedBooking.status)}>{getStatusText(selectedBooking.status)}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="ab-summary-total-title">TỔNG THANH TOÁN</div>
                                    <h2 className="ab-summary-total-price">
                                        {selectedBooking.totalAmount.toLocaleString()} <span style={{ fontSize: '16px' }}>VNĐ</span>
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div className="ab-modal-footer">
                            <button className="ab-btn-close" onClick={() => setIsModalOpen(false)}>Đóng</button>
                            
                            {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
                                <button className="ab-btn-danger" onClick={() => handleCancelBooking(selectedBooking.id)}>
                                    Hủy Đơn Vé Này
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;