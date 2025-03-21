import { useState } from 'react';
import '../css/Favorites.css';
import { useMovieContext } from '../contexts/MovieContext';
import Movie from '../components/Movie';

function Favorite() {
  const { favorites } = useMovieContext();
  const [flippedMovieId, setFlippedMovieId] = useState(null);

  const handleFlip = (movieId) => {
    setFlippedMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  if (favorites.length > 0) {
    return (
      <div className="favorite">
        <h1>Favorite Movies</h1>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <Movie
              key={movie.id}
              movie={movie}
              isFlipped={flippedMovieId === movie.id}
              onCardClick={() => handleFlip(movie.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorite-empty">
      <h1>No favorites Yet</h1>
      <h2>
        Click on the heart icon on a movie to add it to your favorites
      </h2>
    </div>
  );
}

export default Favorite;