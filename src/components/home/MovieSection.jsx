import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveMovies, getShowtimesByMovie } from "../../services/api/MovieApi"; // Import thêm hàm getShowtimes
import { toast } from 'react-toastify';
import "./MovieSection.css";

const MovieSection = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const activeMovies = await getActiveMovies();
                
                const checkShowtimesPromises = activeMovies.map(async (movie) => {
                    try {
                        const showtimes = await getShowtimesByMovie(movie.id);
              
                        return { 
                            ...movie, 
                            hasShowtimes: Array.isArray(showtimes) && showtimes.length > 0 
                        };
                    } catch (error) {
                        return { ...movie, hasShowtimes: false };
                    }
                });

                const moviesWithShowtimesData = await Promise.all(checkShowtimesPromises);
                
                const validMovies = moviesWithShowtimesData.filter(m => m.hasShowtimes);

                const sortedMovies = validMovies.sort((a, b) => 
                    new Date(b.releaseDate) - new Date(a.releaseDate)
                );
                
                setMovies(sortedMovies.slice(0, 10));
            } catch (error) {
                toast.error("Không thể tải danh sách phim");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (isLoading) return <div className="loader" style={{ textAlign: 'center', padding: '50px' }}>Đang tải phim...</div>;

    return (
        <div className="movie-section">
            <div className="section-header">
                <h2>PHIM ĐANG CHIẾU</h2>
                <span className="view-all" onClick={() => navigate('/movies')}>Xem tất cả {'>'}</span>
            </div>

            {movies.length === 0 && !isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', background: '#f8f9fa', borderRadius: '10px' }}>
                    Hiện tại chưa có phim nào được xếp lịch chiếu hôm nay.
                </div>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (

                        <div key={movie.id} className="movie-card" onClick={() => navigate(`/movies/${movie.id}`)}>
                            <div className="poster-wrapper">
                                <img src={movie.posterUrl} alt={movie.title} />
                                <div className="movie-overlay">
                                    <button className="btn-buy-ticket">MUA VÉ</button>
                                </div>
                            </div>
                            <div className="movie-info">
                                <h4 title={movie.title}>{movie.title}</h4>
                                <p className="movie-meta">
                                    <span>⏱ {movie.durationMinutes} phút</span>
                                    <span className="release-year">📅 {new Date(movie.releaseDate).getFullYear()}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieSection;