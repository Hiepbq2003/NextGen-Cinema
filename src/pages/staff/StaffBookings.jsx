import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient'; 

const StaffBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // States cho Tìm kiếm và Lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // States cho Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBookings();
    }, []);

    // 1. Tải danh sách tất cả các đơn vé
    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            // Gọi API lấy danh sách vé (Staff & Admin có quyền truy cập)
            const res = await AxiosClient.get('/admin/bookings'); 
            
            // Xử lý dữ liệu trả về 
            const data = res.data || res;
            
            // Sắp xếp vé mới nhất lên đầu
            const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => b.id - a.id);
            setBookings(sortedData);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đơn vé!");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Hàm xử lý Check-in (Soát vé)
    const handleCheckIn = async (booking) => {
        if (window.confirm(`Xác nhận khách hàng [${booking.customerName}] đã đến rạp và nhận vé?`)) {
            try {
                // Dùng ID của đơn vé (hoặc mã Code nếu có) để check-in
                const codeToCheckIn = booking.ticketCode || booking.id; 
                
                await AxiosClient.patch(`/admin/tickets/check-in/${codeToCheckIn}`);
                toast.success("Check-in thành công! Vé đã chuyển sang trạng thái ĐÃ SỬ DỤNG.");
                fetchBookings(); // Tải lại bảng
            } catch (error) {
                toast.error(error.response?.data?.message || "Check-in thất bại!");
            }
        }
    };

    // 3. Hàm xử lý Hủy đơn & Giải phóng ghế
    const handleCancel = async (id) => {
        if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn HỦY đơn vé này? Hệ thống sẽ giải phóng ghế ngay lập tức.")) {
            try {
                // Gọi API PUT /admin/bookings/{id}/cancel
                await AxiosClient.put(`/admin/bookings/${id}/cancel`);
                toast.success("Đã hủy đơn vé và giải phóng ghế thành công!");
                fetchBookings();
            } catch (error) {
                toast.error(error.response?.data?.message || "Hủy vé thất bại!");
            }
        }
    };

    // --- LOGIC LỌC & TÌM KIẾM ---
    const filteredBookings = bookings.filter((b) => {
        // Tìm theo Tên khách, Số điện thoại, hoặc ID đơn
        const matchSearch = 
            b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.customerPhone?.includes(searchTerm) ||
            b.id?.toString().includes(searchTerm);
            
        // Lọc theo Trạng thái
        const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;

        return matchSearch && matchStatus;
    });

    // --- LOGIC PHÂN TRANG ---
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset về trang 1 nếu đổi từ khóa tìm kiếm hoặc bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

    return (
        <div className="admin-page" style={{ padding: '20px' }}>
            <div className="admin-header-row" style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h2>🎟️ Quầy Soát Vé & Quản Lý Đơn</h2>
                <button className="btn-add" onClick={fetchBookings} style={{ backgroundColor: '#17a2b8' }}>
                    🔄 Làm mới dữ liệu
                </button>
            </div>

            {/* THANH TÌM KIẾM VÀ LỌC */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555' }}>Tìm kiếm Khách hàng / Mã vé:</label>
                    <input 
                        type="text" 
                        placeholder="Nhập tên, SĐT hoặc ID đơn vé..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontWeight: 'bold', fontSize: '13px', color: '#555' }}>Trạng thái đơn:</label>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' }}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ thanh toán</option>
                        <option value="CONFIRMED">Đã thanh toán (Chờ soát vé)</option>
                        <option value="COMPLETED">Đã sử dụng (Đã xem)</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <table className="admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f4f6f9' }}>
                        <tr>
                            <th style={{ padding: '12px 15px' }}>Mã Đơn</th>
                            <th style={{ padding: '12px 15px' }}>Khách hàng</th>
                            <th style={{ padding: '12px 15px' }}>Phim & Suất chiếu</th>
                            <th style={{ padding: '12px 15px' }}>Ghế</th>
                            <th style={{ padding: '12px 15px' }}>Tổng tiền</th>
                            <th style={{ padding: '12px 15px' }}>Trạng thái</th>
                            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</td></tr>
                        ) : paginatedBookings.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Không tìm thấy đơn vé nào phù hợp!</td></tr>
                        ) : (
                            paginatedBookings.map((b) => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px 15px' }}><strong>#{b.id}</strong></td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div><strong>{b.customerName}</strong></div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{b.customerPhone}</div>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#007bff' }}>{b.movieTitle || 'Tên phim'}</div>
                                        <div style={{ fontSize: '12px' }}>
                                            {b.showtime ? new Date(b.showtime).toLocaleString('vi-VN') : 'Giờ chiếu'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 15px', color: '#d92d20', fontWeight: 'bold' }}>
                                        {b.seatNames || 'A1, A2'}
                                    </td>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{formatVND(b.totalPrice)}</td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <span className={`status-badge ${(b.status || 'PENDING').toLowerCase()}`}>
                                            {b.status === 'CONFIRMED' ? 'Chờ soát vé' : 
                                             b.status === 'COMPLETED' ? 'Đã sử dụng' : 
                                             b.status === 'CANCELLED' ? 'Đã hủy' : 'Chờ TT'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            {/* Nút CHECK-IN (Chỉ hiện khi vé đã thanh toán xong) */}
                                            {b.status === 'CONFIRMED' && (
                                                <button 
                                                    onClick={() => handleCheckIn(b)}
                                                    style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    ✅ Soát vé
                                                </button>
                                            )}

                                            {/* Nút HỦY (Chỉ hiện khi vé chưa bị hủy hoặc chưa xem) */}
                                            {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                                                <button 
                                                    onClick={() => handleCancel(b.id)}
                                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ĐIỀU KHIỂN PHÂN TRANG */}
            {!isLoading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Trang trước
                    </button>
                    <span style={{ fontWeight: 'bold' }}>Trang {currentPage} / {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #ccc', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Trang tiếp
                    </button>
                </div>
            )}
        </div>
    );
};

export default StaffBookings;