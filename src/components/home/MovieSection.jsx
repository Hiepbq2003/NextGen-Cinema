// src/components/home/MovieSection.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveMovies } from "../../services/api/MovieApi";
import { toast } from 'react-toastify';
import "./MovieSection.css";

const MovieSection = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await getActiveMovies();
                const sortedMovies = data.sort((a, b) => 
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

    if (isLoading) return <div className="loader">Đang tải phim...</div>;

    return (
        <div className="movie-section">
            <div className="section-header">
                <h2>PHIM ĐANG CHIẾU</h2>
                <span className="view-all" onClick={() => navigate('/movies')}>Xem tất cả {'>'}</span>
            </div>

            <div className="movie-grid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
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
        </div>
    );
};

export default MovieSection;