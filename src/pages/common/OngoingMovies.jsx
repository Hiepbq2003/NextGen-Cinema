import React, {useEffect, useState} from 'react';
import MovieApi from '../../services/api/MovieApi' ;
import MovieCard from '../../components/common/MovieCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../asset/style/OngoingMoviesStyle.css';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const data = await MovieApi.getOngoingMovies();
            setMovies(data);
            setError(null);
        } catch (err) {
            console.error('Lỗi khi tải phim:', err);
            setError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner/>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button
                    onClick={fetchMovies}
                    className="retry-button"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="section-title">
                <h1>Phim đang chiếu</h1>
                <div className="title-underline"></div>
            </div>

            {movies.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Hiện không có phim nào đang chiếu.</p>
            ) : (
                <div className="movie-grid">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;