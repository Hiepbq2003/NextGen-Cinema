import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingApi from '../../services/api/BookingApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../asset/style/MyTicketsStyle.css';

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateString) => {
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

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'UPCOMING') return booking.status === 'PAID';
        if (activeTab === 'PAST') return booking.status === 'COMPLETED';
        if (activeTab === 'CANCELLED') return booking.status === 'CANCELLED';
        return true;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="my-tickets-container">
            <h2 className="my-tickets-title">Vé Của Tôi</h2>

            <div className="ticket-tabs">
                <button className={`ticket-tab ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
                    Tất cả
                </button>
                <button className={`ticket-tab ${activeTab === 'UPCOMING' ? 'active' : ''}`} onClick={() => setActiveTab('UPCOMING')}>
                    Sắp chiếu
                </button>
                <button className={`ticket-tab ${activeTab === 'PAST' ? 'active' : ''}`} onClick={() => setActiveTab('PAST')}>
                    Đã xem
                </button>
                <button className={`ticket-tab ${activeTab === 'CANCELLED' ? 'active' : ''}`} onClick={() => setActiveTab('CANCELLED')}>
                    Đã hủy
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
                                        <span className="info-value">{formatTime(booking.showtimeStart)}</span>
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
                                            {booking.seats?.join(', ') || 'Đang cập nhật'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ticket-right">
                 
                                <div className="qr-placeholder">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking.id}`} 
                                        alt="QR Code" 
                                    />
                                </div>
                                <div className="info-item" style={{ textAlign: 'center', marginBottom: '10px' }}>
                                    <span className="info-label">Mã Đơn</span>
                                    <span className="info-value">#{booking.id}</span>
                                </div>
                                <div className={`ticket-status status-${booking.status}`}>
                                    {translateStatus(booking.status)}
                                </div>
                                <div style={{marginTop: '10px', fontSize: '14px', fontWeight: 'bold', color: '#e50914' ,textAlign: 'center'}}>
                                    {formatCurrency(booking.totalAmount)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;