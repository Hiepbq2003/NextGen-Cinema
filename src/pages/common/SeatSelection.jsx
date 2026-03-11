import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SeatMap from "../../components/common/SeatMap.jsx";
import BookingApi from '../../services/api/BookingApi';
import SeatApi from '../../services/api/SeatApi';
import VoucherModal from "../../components/common/VoucherModal.jsx";
import '../../asset/style/SeatSelectionStyle.css';
import VoucherApi from "../../services/api/VoucherApi.jsx";
import { getAuth } from "../../utils/Auth.jsx";

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
            alert(`Mã ${appliedVoucher.code} yêu cầu đơn tối thiểu ${appliedVoucher.minOrderValue.toLocaleString()}đ`);
            return;
        }

        try {
            await SeatApi.reserveSeats(parseInt(showtimeId), selectedSeats.map(s => s.id));
            const request = {
                showtimeId: parseInt(showtimeId),
                seatIds: selectedSeats.map(s => s.id),
                voucherId: appliedVoucher?.id
            };
            const response = await BookingApi.createBooking(request);
            navigate('/payment', { state: { booking: response } });
        } catch (error) {
            alert('Đặt vé thất bại: ' + error.message);
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
                        <p>Số ghế đã chọn: {selectedSeats.length}</p>
                        <ul>
                            {selectedSeats.map(seat => (
                                <li key={seat.id}>
                                    {seat.rowName}{seat.seatNumber} - {seat.price.toLocaleString()}đ
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="voucher-section">
                        <button onClick={() => setVoucherModalOpen(true)}>Chọn voucher</button>
                        {appliedVoucher && (
                            <div className="applied-voucher">
                                <p>
                                    Đã áp dụng: <strong>{appliedVoucher.code}</strong> 
                                    {totalPrice < appliedVoucher.minOrderValue ? (
                                        <span style={{color: 'red', display: 'block', fontSize: '12px', marginTop: '5px'}}>
                                            (Chưa đủ điều kiện: tối thiểu {appliedVoucher.minOrderValue.toLocaleString()}đ)
                                        </span>
                                    ) : (
                                        <span> - giảm {discountAmount.toLocaleString()}đ</span>
                                    )}
                                </p>
                                <button className="remove-voucher-btn" onClick={() => setAppliedVoucher(null)}>Bỏ chọn</button>
                            </div>
                        )}
                    </div>
                    <div className="total">
                        <p>Tổng tiền: {totalPrice.toLocaleString()}đ</p>
                        {appliedVoucher && discountAmount > 0 && (
                            <p>Thành tiền: <strong>{finalPrice.toLocaleString()}đ</strong></p>
                        )}
                    </div>
                    <button className="payment-btn" disabled={selectedSeats.length === 0} onClick={handlePayment}>
                        Thanh toán
                    </button>
                </div>
                <VoucherModal
                    isOpen={voucherModalOpen}
                    onClose={() => setVoucherModalOpen(false)}
                    onApply={handleApplyVoucher}
                    vouchers={vouchers}
                    selectedVoucher={appliedVoucher}
                />
            </div>

            {loginAlertOpen && (
                <div className="custom-alert-overlay">
                    <div className="custom-alert-box">
                        <h3>Yêu cầu đăng nhập</h3>
                        <p>Vui lòng đăng nhập để thực hiện thanh toán và giữ ghế.</p>
                        <div className="alert-actions">
                            <button className="btn-confirm" onClick={handleConfirmLogin}>Đăng nhập</button>
                            <button className="btn-cancel" onClick={() => setLoginAlertOpen(false)}>Hủy</button>
                        </div>
                        <span className="alert-close" onClick={() => setLoginAlertOpen(false)}>✕</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;