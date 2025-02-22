function Movie({movie}) {

    function onFavClick() {
        alert('Added to favorites!');
    }

  return (
    <div className="movie-card">
        <div className="movie-poster">
            <img src={movie.poster} alt={movie.title} />
            <div className="movie-overlay">
                <button className="fav-btn" onClick={onFavClick}>❤️</button>
            </div>
        </div>
        
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.year}</p>
        </div>
    </div>
  );
}

export default Movie;