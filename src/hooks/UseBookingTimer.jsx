import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingApi from '../services/api/BookingApi';

const TIMER_KEY = 'bookingTimer';
const EXPIRY_KEY = 'bookingExpiry';

export const useBookingTimer = (bookingId, onExpire) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!bookingId) return;

        const storedBooking = localStorage.getItem(TIMER_KEY);
        const storedExpiry = localStorage.getItem(EXPIRY_KEY);

        let expiry = storedExpiry ? parseInt(storedExpiry) : null;

        if (!expiry || storedBooking !== bookingId.toString()) {
            expiry = Date.now() + 5 * 60 * 1000;

            localStorage.setItem(EXPIRY_KEY, expiry.toString());
            localStorage.setItem(TIMER_KEY, bookingId.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                // Hết giờ
                clearInterval(interval);
                localStorage.removeItem(TIMER_KEY);
                localStorage.removeItem(EXPIRY_KEY);

                // Gọi API hủy đơn
                BookingApi.cancelBooking(bookingId)
                    .then(() => {
                        alert('Thời gian thanh toán đã hết. Đơn hàng bị hủy.');
                        navigate('/movies');
                    })
                    .catch(err => {
                        console.error('Lỗi khi hủy đơn tự động:', err);
                        alert('Đã xảy ra lỗi khi hủy đơn. Vui lòng thử lại.');
                        navigate('/movies');
                    });
                if (onExpire) onExpire();
            }
        };

        updateTimer(); // chạy ngay
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [bookingId, navigate, onExpire]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return { timeLeft, formatTime };
};