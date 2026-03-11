import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../asset/style/BookingDetailStyle.css';

const BookingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    if (!booking) {
        navigate('/home');
        return null;
    }

    const { bookingId, totalAmount, createdAt, tickets } = booking;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className="booking-success-container">
            <div className="success-header">
                <h1>🎉 Đặt vé thành công!</h1>
                <p>Mã đặt vé: <strong>{bookingId}</strong></p>
                <p>Ngày đặt: {formatDate(createdAt)}</p>
                <p>Tổng tiền: <strong>{totalAmount.toLocaleString()}đ</strong></p>
                <p>Trạng thái: <span className="status-pending">Chờ thanh toán</span></p>
            </div>

            <div className="tickets-section">
                <h2>🎫 Thông tin vé</h2>
                <div className="tickets-grid">
                    {tickets.map(ticket => (
                        <div key={ticket.ticketId} className="ticket-card">
                            <div className="ticket-info">
                                <p><strong>Ghế:</strong> {ticket.seatName}</p>
                                <p><strong>Giá:</strong> {ticket.price.toLocaleString()}đ</p>
                            </div>
                            <div className="qr-code">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qrCode}`}
                                    alt={`QR code cho ghế ${ticket.seatName}`}
                                />
                                <p className="qr-note">Mã vé: {ticket.qrCode}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="action-buttons">
                <button onClick={() => navigate('/home')} className="home-btn">
                    🏠 Về trang chủ
                </button>
                <button onClick={() => navigate('/profile')} className="profile-btn">
                    📋 Xem lịch sử đặt vé
                </button>
            </div>
        </div>
    );
};

export default BookingDetail;