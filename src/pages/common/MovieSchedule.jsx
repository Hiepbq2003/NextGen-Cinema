import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieApi from '../../services/api/MovieApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../asset/style/MovieScheduleStyle.css';

const MovieSchedule = () => {
    const [movies, setMovies] = useState([]);
    const [showtimesByMovie, setShowtimesByMovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Lấy danh sách phim đang chiếu
            const moviesData = await MovieApi.getOngoingMovies();
            setMovies(moviesData);

            // Lấy suất chiếu cho từng phim
            const promises = moviesData.map(movie =>
                MovieApi.getShowtimesByMovie(movie.id).catch(() => [])
            );
            const results = await Promise.all(promises);

            // Xây dựng object showtimesByMovie: { movieId: [showtimes] }
            const showtimesMap = {};
            moviesData.forEach((movie, index) => {
                showtimesMap[movie.id] = results[index] || [];
            });
            setShowtimesByMovie(showtimesMap);

            // Tính các ngày có suất chiếu
            const allDates = new Set();
            results.flat().forEach(showtime => {
                if (showtime?.startTime) {
                    const date = showtime.startTime.split('T')[0];
                    allDates.add(date);
                }
            });
            const sortedDates = Array.from(allDates).sort();
            setAvailableDates(sortedDates);
            if (sortedDates.length > 0) setSelectedDate(sortedDates[0]);

        } catch (err) {
            console.error('Lỗi khi tải lịch chiếu:', err);
            setError('Không thể tải lịch chiếu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        return new Date(dateTimeString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}`;
    };

    const getWeekday = (dateString) => {
        const date = new Date(dateString);
        const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return weekdays[date.getDay()];
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="schedule-container">
            <h2 className="schedule-title">🎬 Lịch chiếu phim</h2>

            {/* Thanh chọn ngày */}
            {availableDates.length > 0 && (
                <div className="date-tabs">
                    {availableDates.map(date => (
                        <button
                            key={date}
                            className={`date-tab ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            {formatDate(date)} <span className="weekday">{getWeekday(date)}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Danh sách phim trong ngày đã chọn */}
            {selectedDate && (
                <div className="movies-schedule">
                    {movies
                        .filter(movie => showtimesByMovie[movie.id]?.some(st => st.startTime?.startsWith(selectedDate)))
                        .map(movie => {
                            const showtimesOnDate = showtimesByMovie[movie.id]
                                .filter(st => st.startTime?.startsWith(selectedDate))
                                .sort((a, b) => a.startTime.localeCompare(b.startTime));

                            return (
                                <div key={movie.id} className="movie-schedule-item">
                                    <div className="movie-info">
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/80x120?text=No+Image'}
                                            className="movie-poster-small"
                                        />
                                        <div className="movie-details">
                                            <h3 className="movie-title-small">{movie.title}</h3>
                                            <p className="movie-duration">{movie.durationMinutes} phút</p>
                                        </div>
                                    </div>
                                    <div className="showtimes-list">
                                        {showtimesOnDate.map(showtime => (
                                            <button
                                                key={showtime.id}
                                                className="showtime-btn"
                                                onClick={() => navigate(`/movies/booking/${showtime.id}`)}
                                            >
                                                <span className="time">{formatTime(showtime.startTime)}</span>
                                                <span className="seats">{showtime.availableSeats} ghế</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

            {availableDates.length === 0 && (
                <div className="no-showtimes">
                    <p>Hiện chưa có lịch chiếu nào.</p>
                </div>
            )}
        </div>
    );
};

export default MovieSchedule;