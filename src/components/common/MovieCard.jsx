import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaTicketAlt } from 'react-icons/fa';
import '../../asset/style/MovieCardStyle.css';

const MovieCard = ({ movie }) => {
    const { id, title, posterUrl, durationMinutes } = movie;
    const navigate = useNavigate();

    return (
        <div className="movie-card-v2" onClick={() => navigate(`/movies/${id}`)}>
            <div className="poster-container">
                <img
                    src={posterUrl}
                    alt={title}
                    className="main-poster"
                    onError={(e) => {
                        e.target.src = 'https://png.pngtree.com/template/20220118/ourmid/pngtree-movie-poster-background-psd-template-image_811769.jpg';
                    }}
                />
                <div className="poster-overlay">
                    <button className="quick-book-btn">
                        <FaTicketAlt /> MUA VÉ NGAY
                    </button>
                </div>
                <div className="hot-tag">HOT</div>
            </div>

            <div className="movie-details">
                <h3 className="movie-title">{title}</h3>
                <div className="movie-meta">
                    <span><FaClock /> {durationMinutes} phút</span>
                    <span className="category-tag">2D / Digital</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;