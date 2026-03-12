import { useState, useEffect } from 'react';
import { getAllBookings, cancelBooking } from '../../services/api/BookingApi.jsx';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaUser, FaFilm, FaDoorOpen, FaClock, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import '../../asset/style/AdminLayoutStyle.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getAllBookings();
            setBookings(res);
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
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn vé này không? Ghế sẽ được giải phóng cho khách khác.")) {
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'PAID': return 'status-badge scheduled'; // Đã thanh toán (Xanh lá)
            case 'CANCELLED': return 'status-badge cancelled'; // Đã hủy (Đỏ/Gạch ngang)
            case 'PENDING': return 'status-badge upcoming'; // Chờ thanh toán (Vàng)
            default: return 'status-badge';
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header-row">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <FaTicketAlt color="#007bff" /> Quản lý Đặt vé
                </h2>
                {/* Đã bỏ nút "Làm mới" theo yêu cầu */}
            </div>

            <div className="admin-card" style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
                    <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                        <tr>
                            <th style={{ padding: '16px', color: '#495057' }}>Mã Đơn</th>
                            <th style={{ color: '#495057' }}>Khách hàng</th>
                            <th style={{ color: '#495057' }}>Phim / Phòng</th>
                            <th style={{ color: '#495057' }}>Thời gian chiếu</th>
                            <th style={{ color: '#495057' }}>Tổng tiền</th>
                            <th style={{ color: '#495057' }}>Trạng thái</th>
                            <th style={{ textAlign: 'center', color: '#495057' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.id} style={{ borderBottom: '1px solid #f1f3f5', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ background: '#eef2f5', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', color: '#333' }}>
                                        #{b.id}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '600', color: '#2b2b2b' }}>{b.customerName}</div>
                                    <div style={{ fontSize: '13px', color: '#868e96', marginTop: '4px' }}>{b.email}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '600', color: '#2b2b2b' }}>{b.movieTitle}</div>
                                    <div style={{ fontSize: '13px', color: '#007bff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaDoorOpen /> {b.roomName}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '14px', color: '#495057', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FaClock color="#adb5bd" /> {new Date(b.showtimeStart).toLocaleString('vi-VN')}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ color: '#d92d20', fontWeight: '700', fontSize: '15px' }}>
                                        {b.totalAmount.toLocaleString()} đ
                                    </span>
                                </td>
                                <td><span className={getStatusClass(b.status)}>{b.status}</span></td>
                                <td style={{ textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleViewDetails(b)}
                                        style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#bae6fd'}
                                        onMouseOut={(e) => e.currentTarget.style.background = '#e0f2fe'}
                                    >
                                        <FaInfoCircle /> Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {bookings.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#adb5bd' }}>
                        <FaTicketAlt size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                        <p style={{ fontSize: '16px', margin: 0 }}>Chưa có giao dịch đặt vé nào trong hệ thống.</p>
                    </div>
                )}
            </div>

            {/* MODAL CHI TIẾT ĐƠN HÀNG (DẠNG BIÊN LAI) */}
            {isModalOpen && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-container" style={{ maxWidth: '550px', padding: 0, overflow: 'hidden' }}>
                        
                        <div style={{ background: '#f8f9fa', padding: '20px 25px', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#343a40', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Biên lai vé <span style={{ color: '#e71a0f' }}>#{selectedBooking.id}</span>
                            </h3>
                            <button className="close-x" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '25px' }}>
                            {/* Khối Khách Hàng */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                                    <FaUser size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#212529' }}>{selectedBooking.customerName}</div>
                                    <div style={{ fontSize: '14px', color: '#6c757d' }}>{selectedBooking.email}</div>
                                </div>
                            </div>

                            {/* Khối Thông tin Suất chiếu */}
                            <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <FaFilm color="#e71a0f" size={18} />
                                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#343a40' }}>{selectedBooking.movieTitle}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#495057' }}>
                                    <FaDoorOpen color="#007bff" />
                                    <span>Phòng chiếu: <b>{selectedBooking.roomName}</b></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#495057' }}>
                                    <FaClock color="#fd7e14" />
                                    <span>Thời gian: <b>{new Date(selectedBooking.showtimeStart).toLocaleString('vi-VN')}</b></span>
                                </div>
                            </div>

                            {/* Khối Ghế ngồi */}
                            <div style={{ marginBottom: '25px' }}>
                                <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px', fontWeight: '600' }}>GHẾ ĐÃ ĐẶT</div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {selectedBooking.seats.map(s => (
                                        <span key={s} style={{ 
                                            background: '#fff', border: '2px solid #007bff', color: '#007bff', 
                                            padding: '6px 14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' 
                                        }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Đường gạch ngang nét đứt */}
                            <div style={{ borderTop: '2px dashed #dee2e6', margin: '20px 0' }}></div>

                            {/* Tổng kết tiền */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '6px' }}>
                                        Ngày tạo: {new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        Trạng thái: <span className={getStatusClass(selectedBooking.status)} style={{ margin: 0 }}>{selectedBooking.status}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                        <FaMoneyBillWave /> TỔNG CỘNG
                                    </div>
                                    <h2 style={{ margin: 0, color: '#d92d20', fontSize: '26px' }}>
                                        {selectedBooking.totalAmount.toLocaleString()} VNĐ
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Footer nút bấm */}
                        <div style={{ background: '#f8f9fa', padding: '15px 25px', borderTop: '1px solid #e9ecef', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Đóng lại</button>
                            
                            {selectedBooking.status !== 'CANCELLED' && (
                                <button 
                                    className="btn-delete" 
                                    onClick={() => handleCancelBooking(selectedBooking.id)}
                                    style={{ padding: '10px 20px', fontWeight: 'bold' }}
                                >
                                    Hủy Đơn Vé
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