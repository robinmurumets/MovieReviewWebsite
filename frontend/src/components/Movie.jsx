import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";

function Movie({ movie, isFlipped, onCardClick }) {

  const { isFavorite, addFavorite, removeFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);

  function onFavClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }

  return (
    <div className={`movie-card ${isFlipped ? "flipped" : ""}`} onClick={onCardClick}>
      <div className="movie-card-inner">
        <div className="movie-card-front">
          <div className="movie-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-overlay">
              <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavClick}>
                ♥
              </button>
            </div>
          </div>
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
          </div>
        </div>

        <div className="movie-card-back">
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
            <p>Rating: {movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Movie;