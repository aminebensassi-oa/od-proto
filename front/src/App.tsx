import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import FavoritesPage from "./pages/favorites";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<FavoritesPage />} path="/favorites" />
    </Routes>
  );
}

export default App;
