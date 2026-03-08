import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingApi from '../../services/api/BookingApi';
import '../../asset/style/PaymentStyle.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;

    if (!booking) {
        navigate('/home');
        return null;
    }

    const handleCancel = async () => {
        if (window.confirm('Bạn có chắc muốn hủy đơn đặt vé này?')) {
            try {
                await BookingApi.cancelBooking(booking.bookingId);
                alert('Đã hủy đơn thành công');
                navigate('/movies');
            } catch (error) {
                alert('Hủy đơn thất bại: ' + error.message);
            }
        }
    };

    return (
        <div className="payment-simulation-container">
            <h2>💳 Thanh toán</h2>
            <p>Mã đặt vé: <strong>{booking.bookingId}</strong></p>
            <p>Tổng tiền: <strong>{booking.totalAmount.toLocaleString()}đ</strong></p>

            <div className="qr-payment">
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.origin}/qr-payment?bookingId=${booking.bookingId}`}
                    alt="QR Payment"
                />
                <p>Quét mã bằng điện thoại để thanh toán</p>
            </div>

            <div className="payment-actions">
                <button onClick={handleCancel} className="cancel-btn">
                    Hủy đơn
                </button>
            </div>
        </div>
    );
};

export default Payment;