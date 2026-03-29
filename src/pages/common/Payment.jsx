import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingApi from '../../services/api/BookingApi';
import '../../asset/style/PaymentStyle.css';
import { useEffect } from 'react';
import {useBookingTimer} from "@/hooks/UseBookingTimer.jsx";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking = location.state?.booking;
    const { timeLeft, formatTime } = useBookingTimer(booking?.bookingId);

    useEffect(() => {
        if (!booking) {
            navigate('/home');
        }
    }, [booking, navigate]);

    useEffect(() => {

        if (!booking) return;

        const interval = setInterval(async () => {

            try {
                const updated = await BookingApi.getBookingById(booking.bookingId);

                if (updated.status === "PAID") {

                    clearInterval(interval);
                    localStorage.removeItem('bookingTimer');
                    localStorage.removeItem('bookingExpiry');
                    navigate('/booking-detail', {
                        state: { booking: updated }
                    });

                }

            } catch (e) {
                console.error(e);
            }

        }, 3000);

        return () => clearInterval(interval);

    }, [booking, navigate]);

    if (!booking) {
        return null; 
    }

    const handleCancel = async () => {
        if (window.confirm('Bạn có chắc muốn hủy đơn đặt vé này?')) {
            try {
                await BookingApi.cancelBooking(booking.bookingId);
                localStorage.removeItem('bookingTimer');
                localStorage.removeItem('bookingExpiry');
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
            {timeLeft !== null && (
                <p className="timer">⏳ Thời gian còn lại: {formatTime(timeLeft)}</p>
            )}
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