import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMap from "../../components/common/SeatMap.jsx";
import BookingApi from '../../services/api/BookingApi';
import SeatApi from '../../services/api/SeatApi';
import VoucherModal from "../../components/common/VoucherModal.jsx";
import '../../asset/style/SeatSelectionStyle.css';
import VoucherApi from "../../services/api/VoucherApi.jsx";
import {getAuth} from "../../utils/Auth.jsx";

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loginAlertOpen, setLoginAlertOpen] = useState(false);
    const navigate = useNavigate();

    const fetchVouchers = async () => {
        try {
            const data = await VoucherApi.getActiveVoucher();
            setVouchers(data);
        } catch (err) {
            console.error('Lỗi khi tải voucher:', err);
        }
    };

    // Lấy danh sách voucher
    useEffect(() => {
        fetchVouchers();
    }, []);

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const finalPrice = appliedVoucher ? totalPrice - appliedVoucher.discountAmount : totalPrice;

    const handleSeatsSelected = (seats) => {
        setSelectedSeats(seats);
    };

    const handleApplyVoucher = (voucher) => {
        // Tính số tiền giảm
        let discount = totalPrice * voucher.discountPercent / 100;
        if (discount > voucher.maxDiscountAmount) discount = voucher.maxDiscountAmount;
        setAppliedVoucher({ ...voucher, discountAmount: discount });
        setVoucherModalOpen(false);
    };

    const handlePayment = async () => {
        if (!getAuth()?.token) {
            setLoginAlertOpen(true);
            return;
        }
        try {
            await SeatApi.reserveSeats(parseInt(showtimeId), selectedSeats.map(s => s.id));

            // Tạo booking
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
            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Quay lại
            </button>
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
                        <button onClick={() => setVoucherModalOpen(true)}>
                            Chọn voucher
                        </button>

                        {appliedVoucher && (
                            <div className="applied-voucher">
                                <p>
                                    Đã áp dụng: {appliedVoucher.code} -
                                    giảm {appliedVoucher.discountAmount.toLocaleString()}đ
                                </p>

                                <button
                                    className="remove-voucher-btn"
                                    onClick={() => setAppliedVoucher(null)}
                                >
                                    Bỏ chọn
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="total">
                        <p>Tổng tiền: {totalPrice.toLocaleString()}đ</p>
                        {appliedVoucher && (
                            <p>Thành tiền: <strong>{finalPrice.toLocaleString()}đ</strong></p>
                        )}
                    </div>
                    <button
                        className="payment-btn"
                        disabled={selectedSeats.length === 0}
                        onClick={handlePayment}
                    >
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
                        <h3>Thông báo</h3>
                        <p>Hãy đăng nhập hoặc đăng ký trước khi thanh toán.</p>

                        <div className="alert-actions">
                            <button onClick={() => setLoginAlertOpen(false)}>
                                OK
                            </button>
                        </div>

                        <span
                            className="alert-close"
                            onClick={() => setLoginAlertOpen(false)}
                        >
                ✕
            </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;