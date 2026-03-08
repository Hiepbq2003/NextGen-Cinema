import React from "react";
import "../../asset/style/MovieDetailStyle.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieApi from "../../services/api/MovieApi.jsx";

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
                MovieApi.getShowtimesByMovie(movieId)
            ]);
            setMovie(movieData);
            setShowtimes(showtimesData);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMovieAndShowtimes(id);
        }
    }, [id]);

    // Nhóm suất chiếu theo ngày
    const groupedByDate = showtimes.reduce((groups, showtime) => {
        const date = showtime.startTime.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(showtime);
        return groups;
    }, {});

    // Sắp xếp các ngày tăng dần
    const sortedDates = Object.keys(groupedByDate).sort();

    // Đặt ngày được chọn mặc định là ngày đầu tiên
    useEffect(() => {
        if (sortedDates.length > 0 && !selectedDate) {
            setSelectedDate(sortedDates[0]);
        }
    }, [sortedDates, selectedDate]);

    const formatTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getWeekday = (dateString) => {
        const date = new Date(dateString);
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return weekdays[date.getDay()];
    };

    if (loading) return <div>Đang tải...</div>;
    if (!movie) return <div>Đang tải...</div>;

    return (
        <div className="movie-detail-container">

            {/* ====== PHẦN THÔNG TIN PHIM ====== */}
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
                            <p><strong>Ngày khởi chiếu:</strong> {formatDate(movie.releaseDate)}</p>
                            <p><strong>Trạng thái:</strong> {movie.status}</p>
                        </div>
                    </div>

                </div>
            </div>


            {/* PHẦN ĐẶT VÉ */}
            <div className="booking-section">
                <div className="booking-header">
                    <h2 className="booking-title">
                        🎟 Đặt Vé
                    </h2>
                    <p className="booking-subtitle">
                        Chọn ngày và suất chiếu phù hợp với bạn
                    </p>
                </div>

                {/* Danh sách ngày chiếu */}
                {sortedDates.length > 0 ? (
                    <>
                        <div className="date-list">
                            {sortedDates.map(date => {
                                const [year, month, day] = date.split('-');
                                return (
                                    <div
                                        key={date}
                                        className={`date-item ${selectedDate === date ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        {day}/{month} - {getWeekday(date)}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Suất chiếu trong ngày được chọn */}
                        <div className="showtime-section">
                            <h3>2D Phụ đề</h3>
                            <div className="showtime-list">
                                {groupedByDate[selectedDate]?.map(showtime => (
                                    <div key={showtime.id}
                                         className="showtime-item"
                                         onClick={() => navigate(`/movies/booking/${showtime.id}`)}
                                    >
                                        <div className="time">{formatTime(showtime.startTime)}</div>
                                        <div className="seat">
                                            {showtime.availableSeats} ghế trống
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Hiện chưa có suất chiếu nào.</p>
                )}
            </div>

        </div>
    );
};

export default MovieDetail;