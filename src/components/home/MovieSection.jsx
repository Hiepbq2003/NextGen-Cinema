import "./MovieSection.css";

const movies = [
  { id: 1, title: "Movie 1", image: "https://via.placeholder.com/250x350" },
  { id: 2, title: "Movie 2", image: "https://via.placeholder.com/250x350" },
  { id: 3, title: "Movie 3", image: "https://via.placeholder.com/250x350" },
  { id: 4, title: "Movie 4", image: "https://via.placeholder.com/250x350" },
  { id: 5, title: "Movie 5", image: "https://via.placeholder.com/250x350" },
];

const MovieSection = () => {
  return (
    <div className="movie-section">
      <h2>PHIM ĐANG CHIẾU</h2>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img src={movie.image} alt={movie.title} />
            <h4>{movie.title}</h4>
            <button>MUA VÉ</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSection;