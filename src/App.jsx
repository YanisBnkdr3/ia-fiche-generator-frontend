import { NavLink, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import FichePage from "./pages/FichePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import FichesListPage from "./pages/FichesListPage.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>📚 Générateur de fiches</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <NavLink to="/" end>
            Upload
          </NavLink>
          <NavLink to="/fiches">Mes fiches</NavLink>
        </nav>
      </header>
      <hr />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/fiche/:ficheId" element={<FichePage />} />
        <Route path="/quiz/:ficheId" element={<QuizPage />} />
        <Route path="/fiches" element={<FichesListPage />} />
      </Routes>
    </div>
  );
}
