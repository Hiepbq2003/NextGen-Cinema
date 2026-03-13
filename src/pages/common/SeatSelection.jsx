import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SeatMap from "../../components/common/SeatMap.jsx";
import BookingApi from '../../services/api/BookingApi';
import SeatApi from '../../services/api/SeatApi';
import VoucherModal from "../../components/common/VoucherModal.jsx";
import '../../asset/style/SeatSelectionStyle.css';
import VoucherApi from "../../services/api/VoucherApi.jsx";
import { getAuth } from "../../utils/Auth.jsx";
import { toast } from 'react-toastify';

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loginAlertOpen, setLoginAlertOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedData = sessionStorage.getItem(`pending_booking_${showtimeId}`);
        if (savedData) {
            const { seats, voucher } = JSON.parse(savedData);
            setSelectedSeats(seats || []);
            setAppliedVoucher(voucher || null);
            sessionStorage.removeItem(`pending_booking_${showtimeId}`);
        }
    }, [showtimeId]);

    const fetchVouchers = async () => {
        try {
            const data = await VoucherApi.getActiveVoucher();
            setVouchers(data);
        } catch (err) {
            console.error('Lỗi khi tải voucher:', err);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    }, [selectedSeats]);

    const discountAmount = useMemo(() => {
        if (!appliedVoucher) return 0;
        if (totalPrice < appliedVoucher.minOrderValue) return 0;
        let discount = (totalPrice * appliedVoucher.discountPercent) / 100;
        if (discount > appliedVoucher.maxDiscountAmount) {
            discount = appliedVoucher.maxDiscountAmount;
        }
        return discount;
    }, [appliedVoucher, totalPrice]);

    const finalPrice = totalPrice - discountAmount;

    const handleSeatsSelected = (seats) => {
        setSelectedSeats(seats);
    };

    const handleApplyVoucher = (voucher) => {
        if (totalPrice < voucher.minOrderValue) {
            toast.warning(`Đơn hàng chưa đủ tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để áp dụng mã này`);
        }
        setAppliedVoucher(voucher);
        setVoucherModalOpen(false);
    };

    const handleConfirmLogin = () => {
        const bookingData = {
            seats: selectedSeats,
            voucher: appliedVoucher
        };
        sessionStorage.setItem(`pending_booking_${showtimeId}`, JSON.stringify(bookingData));
        navigate('/login', { state: { from: location.pathname } });
    };

    const handlePayment = async () => {
        if (!getAuth()?.token) {
            setLoginAlertOpen(true);
            return;
        }

        if (appliedVoucher && totalPrice < appliedVoucher.minOrderValue) {
            toast.error(`Mã ${appliedVoucher.code} yêu cầu đơn tối thiểu ${appliedVoucher.minOrderValue.toLocaleString()}đ`);
            return;
        }

        try {
            // Bước 1: Giữ ghế tạm thời
            await SeatApi.reserveSeats(parseInt(showtimeId), selectedSeats.map(s => s.id));

            // Bước 2: Tạo đơn hàng
            const request = {
                showtimeId: parseInt(showtimeId),
                seatIds: selectedSeats.map(s => s.id),
                voucherId: appliedVoucher?.id
            };
            const response = await BookingApi.createBooking(request);

            toast.success("Đang chuyển đến trang thanh toán...");
            navigate('/payment', { state: { booking: response } });
        } catch (error) {
            toast.error(error.message || 'Đặt vé thất bại, vui lòng thử lại');
        }
    };

    return (
        <div className="seat-selection-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button>
            <div className="seat-selection-page">
                <div className="seat-section">
                    <SeatMap showtimeId={showtimeId} onSeatsSelected={handleSeatsSelected} />
                </div>
                <div className="booking-summary">
                    <h3>Thông tin đặt vé</h3>
                    <div className="selected-seats">
                        <p>Số ghế đã chọn: <strong>{selectedSeats.length}</strong></p>
                        <ul>
                            {selectedSeats.map(seat => (
                                <li key={seat.id}>
                                    {seat.rowName}{seat.seatNumber} - <span className="price-tag">{seat.price.toLocaleString()}đ</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="voucher-section">
                        <button className="btn-secondary" onClick={() => setVoucherModalOpen(true)}>
                            {appliedVoucher ? "Thay đổi Voucher" : "Chọn Voucher giảm giá"}
                        </button>
                        {appliedVoucher && (
                            <div className="applied-voucher">
                                <div>
                                    <p>Mã: <strong>{appliedVoucher.code}</strong></p>
                                    {totalPrice < appliedVoucher.minOrderValue ? (
                                        <span className="error-text">Chưa đủ điều kiện</span>
                                    ) : (
                                        <span className="success-text">- giảm {discountAmount.toLocaleString()}đ</span>
                                    )}
                                </div>
                                <button className="remove-voucher-btn" onClick={() => setAppliedVoucher(null)}>✕</button>
                            </div>
                        )}
                    </div>
                    <div className="total-container">
                        <div className="total-row">
                            <span>Tạm tính:</span>
                            <span>{totalPrice.toLocaleString()}đ</span>
                        </div>
                        {appliedVoucher && discountAmount > 0 && (
                            <div className="total-row discount">
                                <span>Giảm giá:</span>
                                <span>-{discountAmount.toLocaleString()}đ</span>
                            </div>
                        )}
                        <div className="total-row final">
                            <span>Thành tiền:</span>
                            <strong>{finalPrice.toLocaleString()}đ</strong>
                        </div>
                    </div>
                    <button
                        className="payment-btn"
                        disabled={selectedSeats.length === 0}
                        onClick={handlePayment}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>

            <VoucherModal
                isOpen={voucherModalOpen}
                onClose={() => setVoucherModalOpen(false)}
                onApply={handleApplyVoucher}
                vouchers={vouchers}
                selectedVoucher={appliedVoucher}
                totalPrice={totalPrice}
            />

            {loginAlertOpen && (
                <div className="custom-alert-overlay">
                    <div className="custom-alert-box">
                        <h3>Yêu cầu đăng nhập</h3>
                        <p>Bạn cần đăng nhập để thực hiện đặt vé và thanh toán.</p>
                        <div className="alert-actions">
                            <button className="btn-confirm" onClick={handleConfirmLogin}>Đăng nhập ngay</button>
                            <button className="btn-cancel" onClick={() => setLoginAlertOpen(false)}>Quay lại</button>
                        </div>
                        <span className="alert-close" onClick={() => setLoginAlertOpen(false)}>✕</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;