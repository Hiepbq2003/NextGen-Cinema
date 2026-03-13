import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveMovies, getShowtimesByMovie } from "../../services/api/MovieApi";
import { toast } from 'react-toastify';
import MovieCard from '../common/MovieCard';
import '../../asset/style/MovieSection.css';

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
                        return { ...movie, hasShowtimes: Array.isArray(showtimes) && showtimes.length > 0 };
                    } catch { return { ...movie, hasShowtimes: false }; }
                });
                const results = await Promise.all(checkShowtimesPromises);
                const validMovies = results.filter(m => m.hasShowtimes)
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                setMovies(validMovies.slice(0, 20));
            } catch (error) {
                toast.error("Không thể tải danh sách phim");
            } finally { setIsLoading(false); }
        };
        fetchMovies();
    }, []);

    if (isLoading) return <div className="loader-container">Đang tải phim...</div>;

    return (
        <section className="home-section">
            <div className="section-header-standard">
                <h2 className="section-title-main">PHIM ĐANG CHIẾU</h2>
                <span className="section-view-all" onClick={() => navigate('/movies')}>Xem tất cả {'>'}</span>
            </div>

            {movies.length === 0 ? (
                <div className="empty-state">Hiện tại chưa có phim nào được xếp lịch chiếu.</div>
            ) : (
                <div className="movie-grid-layout">
                    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                </div>
            )}
        </section>
    );
};

export default MovieSection;