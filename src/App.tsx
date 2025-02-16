import { Routes, Route } from "react-router-dom";

import HomePage from "@/pages/index";
import MovieDetailPage from "@/pages/movie/[id]";
import FavoritesPage from "@/pages/favorites";
import SearchPage from "@/pages/search";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<MovieDetailPage />} path="/movie/:id" />
        <Route element={<FavoritesPage />} path="/favorites" />
        <Route element={<SearchPage />} path="/search" />
      </Routes>
    </FavoritesProvider>
  );
}
