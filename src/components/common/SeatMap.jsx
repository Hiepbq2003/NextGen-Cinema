import React, { useEffect, useState } from 'react';
import SeatApi from '../../services/api/SeatApi';
import '../../asset/style/SeatMapStyle.css';

const SeatMap = ({ showtimeId, onSeatsSelected }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        fetchSeats();
    }, [showtimeId]);

    const fetchSeats = async () => {
        try {
            setLoading(true);
            const data = await SeatApi.getSeatsByShowtime(showtimeId);
            setSeats(data.seats);
            setMovieTitle(data.movieTitle);
            setRoomName(data.roomName);
        } catch (err) {
            setError('Không thể tải sơ đồ ghế: ,' + err);
        } finally {
            setLoading(false);
        }
    };

    // Nhóm ghế theo hàng
    const seatsByRow = seats.reduce((acc, seat) => {
        const row = seat.rowName;
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    const sortedRows = Object.keys(seatsByRow).sort();

    const handleSeatClick = (seat) => {
        if (seat.status !== 'AVAILABLE') return;

        const isSelected = selectedSeats.some(s => s.id === seat.id);
        let newSelected;
        if (isSelected) {
            newSelected = selectedSeats.filter(s => s.id !== seat.id);
        } else {
            newSelected = [...selectedSeats, seat];
        }
        setSelectedSeats(newSelected);
        if (onSeatsSelected) {
            onSeatsSelected(newSelected);
        }
    };

    const getSeatClass = (seat) => {
        let baseClass = 'seat';

        // trạng thái ghế
        if (seat.status === 'AVAILABLE') baseClass += ' available';
        else if (seat.status === 'RESERVED') baseClass += ' reserved';
        else if (seat.status === 'BOOKED') baseClass += ' booked';

        // luôn giữ loại ghế
        if (seat.seatType === 'VIP') baseClass += ' vip';
        else if (seat.seatType === 'COUPLE') baseClass += ' couple';

        // nếu chọn
        if (selectedSeats.some(s => s.id === seat.id)) {
            baseClass += ' selected';
        }

        return baseClass;
    };

    if (loading) return <div>Đang tải sơ đồ ghế...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="seat-map-container">
            <h2>{movieTitle} - {roomName}</h2>
            <div className="screen">MÀN HÌNH</div>
            <div className="seat-legend">

                <div className="legend-item">
                    <span className="seat-demo available"></span>
                    Ghế thường
                </div>

                <div className="legend-item">
                    <span className="seat-demo vip"></span>
                    Ghế VIP
                </div>

                <div className="legend-item">
                    <span className="seat-demo couple"></span>
                    Ghế đôi
                </div>

                <div className="legend-item">
                    <span className="seat-demo selected"></span>
                    Ghế đã chọn
                </div>

                <div className="legend-item">
                    <span className="seat-demo reserved"></span>
                    Đang giữ
                </div>

                <div className="legend-item">
                    <span className="seat-demo booked"></span>
                    Đã đặt
                </div>

            </div>
            <div className="seats-wrapper">
                {sortedRows.map(row => (
                    <div key={row} className="seat-row">
                        <span className="row-label">{row}</span>
                        <div className="seats-in-row">
                            {seatsByRow[row]
                                .sort((a, b) => a.seatNumber - b.seatNumber)
                                .map(seat => (
                                    <div
                                        key={seat.id}
                                        className={getSeatClass(seat)}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.seatNumber}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatMap;