import Movie from "../components/Movie";
import { useState, useEffect } from "react";
import { searchMovies, getMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flippedMovieId, setFlippedMovieId] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.log(error);
        setError("An error occurred. Please try again later");
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleSeatch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = (movieId) => {
    setFlippedMovieId((prevId) => (prevId === movieId ? null : movieId));
  };

  return (
    <div className="home">
      <form onSubmit={handleSeatch} className="search-form">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="seatch-btn">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <Movie
              key={movie.id}
              movie={movie}
              isFlipped={flippedMovieId === movie.id}
              onCardClick={() => handleFlip(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;