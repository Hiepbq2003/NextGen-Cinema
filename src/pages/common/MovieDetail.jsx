import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieApi from "../../services/api/MovieApi.jsx";
import "../../asset/style/MovieDetailStyle.css";

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchMovieAndShowtimes = async (movieId) => {
        try {
            setLoading(true);
            const [movieData, showtimesData] = await Promise.all([
                MovieApi.getMovieById(movieId),

                MovieApi.getShowtimesByMovie(movieId).catch(() => []) 
            ]);
            
            setMovie(movieData);

            setShowtimes(Array.isArray(showtimesData) ? showtimesData : []);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phim:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMovieAndShowtimes(id);
        }
    }, [id]);

    const groupedByDate = showtimes.reduce((groups, showtime) => {

        if (!showtime || !showtime.startTime) return groups;
        
        const date = showtime.startTime.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(showtime);
        return groups;
    }, {});


    const sortedDates = Object.keys(groupedByDate).sort();

    useEffect(() => {
        if (sortedDates.length > 0 && !selectedDate) {
            setSelectedDate(sortedDates[0]);
        }
    }, [sortedDates, selectedDate]);

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "";
        return new Date(dateTimeString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getWeekday = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return weekdays[date.getDay()];
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải thông tin phim...</div>;
    if (!movie) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy thông tin phim!</div>;

    return (
        <div className="movie-detail-container">
            <div className="movie-info-wrapper">
                <div className="movie-info-section">
                    <div className="movie-poster">
                        <img src={movie.posterUrl}
                             alt={movie.title}
                             onError={(e) => {
                                 e.target.src = 'https://png.pngtree.com/template/20220118/ourmid/pngtree-movie-poster-background-psd-template-image_811769.jpg';
                             }}
                        />
                    </div>

                    <div className="movie-content">
                        <h1 className="movie-title">{movie.title}</h1>
                        <p className="movie-description">
                            {movie.description}
                        </p>
                        <div className="movie-meta">
                            <p><strong>Thời lượng:</strong> {movie.durationMinutes} phút</p>
                            <p><strong>Khởi chiếu:</strong> {formatDate(movie.releaseDate)}</p>
                            <p><strong>Trạng thái:</strong> {movie.status === 'ONGOING' ? 'Đang chiếu' : 'Sắp chiếu'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ====== PHẦN ĐẶT VÉ ====== */}
            <div className="booking-section">
                <div className="booking-header">
                    <h2 className="booking-title">🎟 Đặt Vé</h2>
                    <p className="booking-subtitle">Chọn ngày và suất chiếu phù hợp với bạn</p>
                </div>

                {sortedDates.length > 0 ? (
                    <>
                        {/* Danh sách ngày chiếu */}
                        <div className="date-list" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            {sortedDates.map(date => {
                                const [year, month, day] = date.split('-');
                                return (
                                    <button
                                        key={date}
                                        className={`date-item ${selectedDate === date ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            padding: '10px 20px',
                                            border: selectedDate === date ? '2px solid #007bff' : '1px solid #ccc',
                                            backgroundColor: selectedDate === date ? '#e6f2ff' : '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {day}/{month} - {getWeekday(date)}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Suất chiếu trong ngày được chọn */}
                        <div className="showtime-section">
                            <h3 style={{ marginBottom: '15px' }}>2D Phụ đề</h3>
                            <div className="showtime-list" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {groupedByDate[selectedDate]?.map(showtime => (
                                    <button 
                                        key={showtime.id}
                                        className="showtime-item"
                                        // ĐIỀU HƯỚNG TỚI TRANG ĐẶT GHẾ
                                        onClick={() => navigate(`/movies/booking/${showtime.id}`)}
                                        style={{
                                            padding: '12px 24px',
                                            border: '1px solid #28a745',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8fff9',
                                            cursor: 'pointer',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div className="time" style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                                            {formatTime(showtime.startTime)}
                                        </div>
                                        <div className="seat" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                            {showtime.availableSeats} ghế trống
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '30px', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
                        <h4 style={{ color: '#dc3545' }}>Chưa có suất chiếu</h4>
                        <p>Bộ phim này hiện chưa được xếp lịch chiếu. Vui lòng quay lại sau!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;