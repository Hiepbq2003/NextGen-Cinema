import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosClient from '../../services/api/AxiosClient';

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
            const res = await AxiosClient.get(`/seats/showtime/${st.id}`); 
            const data = res.data || res;
            setSeats(Array.isArray(data) ? data : []);
            setStep(3);
        } catch (error) {
            toast.error("Lỗi khi tải sơ đồ ghế!");
        }
    };

    // Chọn / Bỏ chọn ghế
    const toggleSeat = (seat) => {
        if (seat.status !== 'AVAILABLE') return;
        
        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const totalPrice = selectedSeats.length * (selectedShowtime?.basePrice || 0);

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
            
            const createRes = await AxiosClient.post('/bookings', bookingRequest);
            const bookingId = createRes.data?.id || createRes.id;

            await AxiosClient.post(`/bookings/${bookingId}/confirm`);

            await AxiosClient.patch(`/admin/tickets/check-in/${bookingId}`);

            toast.success("Thanh toán thành công! Vui lòng in vé cho khách.");
            
            handleResetPOS();
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
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px' }}>
                            {seats.map(seat => {
                                const isSelected = selectedSeats.some(s => s.id === seat.id);
                                const isBooked = seat.status !== 'AVAILABLE';
                                
                                let bgColor = '#f8f9fa';
                                let borderColor = '#ccc';
                                let color = '#333';

                                if (isBooked) { bgColor = '#dc3545'; borderColor = '#dc3545'; color = '#fff'; }
                                else if (isSelected) { bgColor = '#28a745'; borderColor = '#28a745'; color = '#fff'; }

                                return (
                                    <button 
                                        key={seat.id} 
                                        onClick={() => toggleSeat(seat)}
                                        disabled={isBooked}
                                        style={{ padding: '10px 0', border: `1px solid ${borderColor}`, background: bgColor, color: color, borderRadius: '5px', cursor: isBooked ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                                    >
                                        {seat.rowName}{seat.seatNumber}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '13px' }}>
                            <span><b style={{ display:'inline-block', width:15, height:15, background:'#f8f9fa', border:'1px solid #ccc' }}></b> Ghế trống</span>
                            <span><b style={{ display:'inline-block', width:15, height:15, background:'#28a745' }}></b> Đang chọn</span>
                            <span><b style={{ display:'inline-block', width:15, height:15, background:'#dc3545' }}></b> Đã bán</span>
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