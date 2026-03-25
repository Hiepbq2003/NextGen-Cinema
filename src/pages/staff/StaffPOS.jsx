import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient';
import '../../asset/style/SeatMapStyle.css';

const StaffPOS = () => {
    const [step, setStep] = useState(1);
    
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [seats, setSeats] = useState([]);
    
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    const [customerName, setCustomerName] = useState('Khách vãng lai');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // BƯỚC 1: Lấy danh sách phim đang chiếu khi vào trang
    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await AxiosClient.get('/movies/public');
            const data = res.data || res;
            setMovies(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Không thể tải danh sách phim!");
        }
    };

    // BƯỚC 2: Chọn phim -> Lấy suất chiếu
    const handleSelectMovie = async (movie) => {
        setSelectedMovie(movie);
        try {
            const res = await AxiosClient.get(`/showtimes/public/${movie.id}`);
            const data = res.data || res;
            setShowtimes(Array.isArray(data) ? data : []);
            setStep(2);
        } catch (error) {
            toast.error("Lỗi khi tải lịch chiếu!");
        }
    };

    // BƯỚC 3: Chọn suất chiếu -> Lấy sơ đồ ghế
    const handleSelectShowtime = async (st) => {
        setSelectedShowtime(st);
        try {
            const res = await AxiosClient.get(`/seats/public/showtime/${st.id}`); 
            const data = res.data || res;
            const seatsData = Array.isArray(data) ? data : (data?.seats || []);
            setSeats(seatsData);
            setStep(3);
        } catch (error) {
            toast.error("Lỗi khi tải sơ đồ ghế!");
        }
    };

    // Chọn / Bỏ chọn ghế
    const toggleSeat = async (seat) => {
        if (seat.status !== 'AVAILABLE' && !(seat.status === 'RESERVED' && selectedSeats.some(s => s.id === seat.id))) return;
        
        try {
            await AxiosClient.post('/seats/toggle-hold', {
                showtimeId: selectedShowtime.id,
                seatId: seat.id
            });

            if (selectedSeats.find(s => s.id === seat.id)) {
                setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
                seat.status = 'AVAILABLE';
            } else {
                setSelectedSeats([...selectedSeats, seat]);
                seat.status = 'RESERVED';
            }
            setSeats([...seats]);
        } catch (error) {
            toast.error("Không thể giữ ghế: " + (error.response?.data?.message || error.message));
            handleSelectShowtime(selectedShowtime); // Lấy lại sơ đồ ghế
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

    const getSeatClass = (seat) => {
        let baseClass = 'seat';

        if (seat.status === 'AVAILABLE') baseClass += ' available';
        else if (seat.status === 'RESERVED') baseClass += ' reserved';
        else if (seat.status === 'BOOKED') baseClass += ' booked';

        if (seat.seatType === 'VIP') baseClass += ' vip';
        else if (seat.seatType === 'COUPLE') baseClass += ' couple';

        if (selectedSeats.some(s => s.id === seat.id)) {
            baseClass += ' selected';
        }

        return baseClass;
    };

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

    // BƯỚC 4: THANH TOÁN 
    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 ghế!"); return;
        }

        setIsLoading(true);
        try {
  
            const bookingRequest = {
                showtimeId: selectedShowtime.id,
                seatIds: selectedSeats.map(s => s.id),
                paymentMethod: "CASH"
            };
            
            // Reservation was already done per seat click
            const createRes = await AxiosClient.post('/bookings', bookingRequest);
            const bookingId = createRes.data?.bookingId || createRes.bookingId || createRes.data?.id || createRes.id;

            await AxiosClient.post(`/bookings/${bookingId}/confirm`);

            await AxiosClient.put(`/admin/bookings/${bookingId}/check-in`);

            toast.success("Thanh toán thành công! Đang in vé...");
            
            setTimeout(() => {
                window.print();
                handleResetPOS();
            }, 500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Thanh toán thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPOS = () => {
        setStep(1);
        setSelectedMovie(null);
        setSelectedShowtime(null);
        setSelectedSeats([]);
        setCustomerName('Khách vãng lai');
        setCustomerPhone('');
        fetchMovies();
    };

    const formatVND = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="admin-page" style={{ padding: '0 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-header-row" style={{ paddingBottom: '10px', marginBottom: '15px' }}>
                <h2>🍿 Bán vé tại quầy (POS)</h2>
                {step > 1 && (
                    <button onClick={handleResetPOS} style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        ↩ Hủy & Làm lại
                    </button>
                )}
            </div>

            {/* BƯỚC 1: CHỌN PHIM */}
            {step === 1 && (
                <div>
                    <h3 style={{ color: '#555' }}>1. Chọn phim khách muốn xem</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px' }}>
                        {movies.length === 0 ? <p>Không có phim nào đang chiếu.</p> : movies.map(m => (
                            <div key={m.id} onClick={() => handleSelectMovie(m)} style={{ width: '160px', cursor: 'pointer', transition: 'transform 0.2s', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <img src={m.posterUrl} alt={m.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                <div style={{ padding: '10px', textAlign: 'center' }}>
                                    <strong style={{ fontSize: '14px', color: '#333' }}>{m.title}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* BƯỚC 2: CHỌN SUẤT CHIẾU */}
            {step === 2 && (
                <div>
                    <h3 style={{ color: '#555' }}>2. Chọn suất chiếu - <span style={{ color: '#007bff' }}>{selectedMovie?.title}</span></h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px' }}>
                        {showtimes.length === 0 ? <p>Phim này hiện chưa có suất chiếu.</p> : showtimes.map(st => (
                            <button key={st.id} onClick={() => handleSelectShowtime(st)} style={{ padding: '15px 25px', background: '#fff', border: '2px solid #007bff', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#007bff' }}>
                                ⏰ {new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                <br/>
                                <small style={{ color: '#666', fontWeight: 'normal' }}>{new Date(st.startTime).toLocaleDateString('vi-VN')}</small>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* BƯỚC 3 & 4: CHỌN GHẾ VÀ THANH TOÁN (Chia 2 cột) */}
            {step === 3 && (
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, textAlign: 'center' }}>MÀN HÌNH</h3>
                        <div style={{ width: '80%', height: '5px', background: '#ccc', margin: '0 auto 30px auto', borderRadius: '5px', boxShadow: '0 5px 10px rgba(0,0,0,0.1)' }}></div>
                        
                        <div className="seat-legend" style={{ margin: '20px 0' }}>
                            <div className="legend-item"><span className="seat-demo available"></span>Ghế thường</div>
                            <div className="legend-item"><span className="seat-demo vip"></span>Ghế VIP</div>
                            <div className="legend-item"><span className="seat-demo couple"></span>Ghế đôi</div>
                            <div className="legend-item"><span className="seat-demo selected"></span>Đã chọn</div>
                            <div className="legend-item"><span className="seat-demo reserved"></span>Đang giữ</div>
                            <div className="legend-item"><span className="seat-demo booked"></span>Đã đặt</div>
                        </div>

                        <div className="seats-wrapper" style={{ paddingBottom: '20px' }}>
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
                                                    onClick={() => toggleSeat(seat)}
                                                >
                                                    {seat.seatNumber}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>🧾 Hóa đơn</h3>
                        
                        <p><strong>Phim:</strong> <span style={{ color: '#007bff' }}>{selectedMovie?.title}</span></p>
                        <p><strong>Suất chiếu:</strong> {new Date(selectedShowtime?.startTime).toLocaleString('vi-VN')}</p>
                        <p><strong>Ghế chọn:</strong> {selectedSeats.map(s => s.rowName + s.seatNumber).join(', ') || 'Chưa chọn'}</p>
                        
                        <div style={{ margin: '20px 0' }}>
                            <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Tên Khách Hàng (Tùy chọn):</label>
                            <input 
                                className="form-input" 
                                value={customerName} 
                                onChange={(e) => setCustomerName(e.target.value)} 
                                style={{ width: '100%', boxSizing: 'border-box', marginTop: '5px' }} 
                            />
                        </div>

                        <div style={{ borderTop: '2px dashed #eee', paddingTop: '15px', marginTop: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px' }}>
                                <span>Tổng tiền:</span>
                                <strong style={{ color: '#d92d20', fontSize: '24px' }}>{formatVND(totalPrice)}</strong>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout} 
                            disabled={isLoading || selectedSeats.length === 0}
                            style={{ width: '100%', padding: '15px', background: selectedSeats.length > 0 ? '#28a745' : '#ccc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginTop: '20px', cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed' }}
                        >
                            {isLoading ? 'Đang xử lý...' : '💰 THU TIỀN & IN VÉ'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPOS;