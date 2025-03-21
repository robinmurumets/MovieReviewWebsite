import "./css/App.css";
import Favorite from "./pages/Favorites";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <MovieProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;