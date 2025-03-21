import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (token) {
      console.log("[MovieContext] Loading favorites with token:", token);
      fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("[MovieContext] Favorites loaded:", data);
          setFavorites(data);
        })
        .catch((err) =>
          console.error("[MovieContext] Failed to load favorites:", err)
        );
    } else {
      setFavorites([]);
    }
  }, [token]);

  const addFavorite = async (movie) => {
    console.log("[MovieContext] addFavorite triggered for movie:", movie);
    if (!token) {
      alert("Please login to add favorites");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });
      const data = await res.json();
      console.log("[MovieContext] addFavorite response:", res.ok, data);
      if (res.ok) {
        setFavorites((prev) => [...prev, data]);
      } else {
        alert(data.error || "Failed to add favorite");
      }
    } catch (error) {
      console.error("[MovieContext] Error adding favorite:", error);
    }
  };

  const removeFavorite = async (movieId) => {
    console.log("[MovieContext] removeFavorite triggered for movieId:", movieId);
    if (!token) {
      alert("Please login to remove favorites");
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[MovieContext] removeFavorite response:", res.ok);
      if (res.ok) {
        setFavorites((prev) =>
          prev.filter((movie) => String(movie.id) !== String(movieId))
        );
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to remove favorite");
      }
    } catch (error) {
      console.error("[MovieContext] Error removing favorite:", error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(
      (movie) => String(movie.id) === String(movieId)
    );
  };

  const login = (newToken) => {
    console.log("[MovieContext] Logging in with token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    console.log("[MovieContext] Logging out");
    localStorage.removeItem("token");
    setToken(null);
    setFavorites([]);
    alert("Logged out successfully");
  };

  const value = {
    token,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    login,
    logout,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};