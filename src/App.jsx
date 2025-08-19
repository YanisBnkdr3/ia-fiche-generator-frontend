import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import FichePage from "./pages/FichePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import FichesListPage from "./pages/FichesListPage.jsx";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        padding: "16px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "#2F5249",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            fontFamily: "'Pacifico', cursive",
            color: "#E3DE61",
            textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
          }}
        >
          📚 Générateur de fiches
        </h1>

        {/* MENU BURGER (visible seulement sur mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#fff",
            cursor: "pointer",
          }}
          className="menu-btn"
        >
          ☰
        </button>

        {/* NAVIGATION */}
        <nav
          style={{
            display: "flex",
            gap: "20px",
          }}
          className="nav-desktop"
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              color: isActive ? "#E3DE61" : "#fff",
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              transition: "0.3s ease",
            })}
          >
            Upload
          </NavLink>
          <NavLink
            to="/fiches"
            style={({ isActive }) => ({
              color: isActive ? "#E3DE61" : "#fff",
              fontWeight: isActive ? "bold" : "normal",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: "8px",
              background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
              transition: "0.3s ease",
            })}
          >
            Mes fiches
          </NavLink>
        </nav>

        {/* NAVIGATION MOBILE */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "20px",
              background: "#2F5249",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            className="nav-mobile"
          >
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? "#E3DE61" : "#fff",
                fontWeight: isActive ? "bold" : "normal",
                textDecoration: "none",
              })}
            >
              Upload
            </NavLink>
            <NavLink
              to="/fiches"
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? "#E3DE61" : "#fff",
                fontWeight: isActive ? "bold" : "normal",
                textDecoration: "none",
              })}
            >
              Mes fiches
            </NavLink>
          </div>
        )}
      </header>

      {/* CONTENU */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/fiche/:ficheId" element={<FichePage />} />
          <Route path="/quiz/:ficheId" element={<QuizPage />} />
          <Route path="/fiches" element={<FichesListPage />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "30px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} Yanis Benkeder – Tous droits réservés
      </footer>

      {/* CSS RESPONSIVE */}
      <style>
        {`
          @media (max-width: 768px) {
            .nav-desktop {
              display: none !important;
            }
            .menu-btn {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
}
