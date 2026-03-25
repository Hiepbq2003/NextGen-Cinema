import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingApi from '../../services/api/BookingApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useBookingTimer } from '../../hooks/useBookingTimer';
import '../../asset/style/MyTicketsStyle.css';

const BookingItem = ({ booking, onCancel }) => {
    const { timeLeft, formatTime } = useBookingTimer(
        booking.status === 'PENDING' ? booking.id : null
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTimeOnly = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const translateStatus = (status) => {
        const statusMap = {
            'PENDING': 'Chờ thanh toán',
            'PAID': 'Đã thanh toán',
            'COMPLETED': 'Đã xem',
            'CANCELLED': 'Đã hủy'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="ticket-card" key={booking.id}>
            <div className="ticket-left">
                <h3 className="movie-title">{booking.movieTitle}</h3>
                <div className="ticket-info-grid">
                    <div className="info-item">
                        <span className="info-label">
                            <i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                            Ngày chiếu
                        </span>
                        <span className="info-value">{formatDate(booking.showtimeStart)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">
                            <i className="far fa-clock" style={{ marginRight: '5px' }}></i>
                            Giờ chiếu
                        </span>
                        <span className="info-value">{formatTimeOnly(booking.showtimeStart)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>
                            Phòng chiếu
                        </span>
                        <span className="info-value">{booking.roomName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">
                            <i className="fas fa-couch" style={{ marginRight: '5px' }}></i>
                            Ghế ngồi
                        </span>
                        <span className="info-value seats-highlight">
                            {booking.seats?.length > 0 ? booking.seats.join(', ') : 'Đang cập nhật'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="ticket-right">
                {/* QR Code chỉ hiển thị cho vé đã thanh toán hoặc đã xem */}
                {booking.status === 'PAID' || booking.status === 'COMPLETED' ? (
                    <div className="qr-placeholder">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking.id}`}
                            alt="QR Code"
                        />
                    </div>
                ) : booking.status === 'PENDING' && timeLeft !== null ? (
                    <div className="pending-timer">
                        <p className="timer-text">⏳ {formatTime(timeLeft)}</p>
                        <button
                            className="cancel-pending-btn"
                            onClick={() => onCancel(booking.id)}
                        >
                            Hủy đơn
                        </button>
                    </div>
                ) : (
                    <div className="qr-placeholder" style={{ background: '#f0f0f0', height: '100px', width: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Chờ thanh toán</span>
                    </div>
                )}

                <div className="info-item" style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <span className="info-label">Mã Đơn</span>
                    <span className="info-value">#{booking.id}</span>
                </div>

                <div className={`ticket-status status-${booking.status}`}>
                    {translateStatus(booking.status)}
                </div>

                <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold', color: '#e50914', textAlign: 'center' }}>
                    {formatCurrency(booking.totalAmount)}
                </div>
            </div>
        </div>
    );
};

const MyTickets = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await BookingApi.getMyBookings();
            setBookings(response || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách vé:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelPending = async (bookingId) => {
        if (window.confirm('Bạn có chắc muốn hủy đơn đặt vé này?')) {
            try {
                await BookingApi.cancelBooking(bookingId);
                alert('Đã hủy đơn thành công');
                // Refresh danh sách
                fetchMyBookings();
            } catch (error) {
                alert('Hủy đơn thất bại: ' + error.message);
            }
        }
    };

    // Lọc theo tab
    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PAID') return booking.status === 'PAID' || booking.status === 'COMPLETED';
        if (activeTab === 'PENDING') return booking.status === 'PENDING';
        return true;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="my-tickets-container">
            <h2 className="my-tickets-title">Vé Của Tôi</h2>

            <div className="ticket-tabs">
                <button
                    className={`ticket-tab ${activeTab === 'ALL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ALL')}
                >
                    Tất cả
                </button>
                <button
                    className={`ticket-tab ${activeTab === 'PAID' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PAID')}
                >
                    Đã thanh toán
                </button>
                <button
                    className={`ticket-tab ${activeTab === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setActiveTab('PENDING')}
                >
                    Chờ thanh toán
                </button>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-ticket-alt" style={{ fontSize: '64px', color: '#ccc', margin: '0 auto 15px', display: 'block' }}></i>
                    <h3>Bạn chưa có vé nào ở mục này</h3>
                    <p>Hãy đặt vé ngay để thưởng thức những bộ phim hấp dẫn nhé!</p>
                </div>
            ) : (
                <div className="ticket-list">
                    {filteredBookings.map((booking) => (
                        <BookingItem
                            key={booking.id}
                            booking={booking}
                            onCancel={handleCancelPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;