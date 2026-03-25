import React from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import BookingApi from "../../services/api/BookingApi.jsx";

const QrPayment = () => {

    const [params] = useSearchParams();
    const bookingId = params.get("bookingId");

    const navigate = useNavigate();

    const handlePay = async () => {
        try {
            const response = await BookingApi.confirmBooking(bookingId);

            navigate("/booking-detail", {
                state: { booking: response }
            });

        } catch (e) {
            alert("Thanh toán thất bại: " + e.message);
        }
    };

    const handleCancel = async () => {
        if (window.confirm('Bạn có chắc muốn hủy đơn đặt vé này?')) {
            try {
                await BookingApi.cancelBooking(bookingId);
                alert('Đã hủy đơn thành công');
                navigate('/movies');
            } catch (error) {
                alert('Hủy đơn thất bại: ' + error.message);
            }
        }
    };

    return (
        <div style={{textAlign:"center", marginTop:"100px"}}>
            <h2>💰 Thanh toán cho vé xem phim</h2>

            <p>Mã đơn: {bookingId}</p>

            <br/>

            <button
                onClick={handlePay}
                style={{
                    padding:"12px 25px",
                    background:"#2ecc71",
                    border:"none",
                    color:"#fff",
                    borderRadius:"8px",
                    cursor:"pointer"
                }}
            >
                Thanh toán
            </button>

            <button
                onClick={handleCancel}
                style={{
                    padding:"12px 25px",
                    background:"#e74c3c",
                    border:"none",
                    color:"#fff",
                    borderRadius:"8px",
                    cursor:"pointer"
                }}
            >
                Hủy đơn
            </button>
        </div>
    );
};

export default QrPayment;