import '../../asset/style/MovieCardStyle.css';
import {useNavigate} from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const { id, title, posterUrl, durationMinutes } = movie;
    const navigate = useNavigate();

    return (
        <div className="movie-card">
            <div className="poster-wrapper">
                <img
                    src={posterUrl}
                    alt={title}
                    onError={(e) => {
                        e.target.src = 'https://png.pngtree.com/template/20220118/ourmid/pngtree-movie-poster-background-psd-template-image_811769.jpg';
                    }}
                />

                <div className="badge-hot">
                    HOT
                </div>
            </div>

            <div className="movie-info">
                <h3
                    className="movie-title-click"
                    onClick={() => navigate(`/movies/${id}`)}
                >
                    {title}
                </h3>

                <p>Thời lượng: {durationMinutes} phút</p>

                <button
                    className="btn-book"
                    onClick={() => navigate(`/movies/${id}`)}
                >
                    🎟 MUA VÉ
                </button>
            </div>
        </div>
    );
};

export default MovieCard;