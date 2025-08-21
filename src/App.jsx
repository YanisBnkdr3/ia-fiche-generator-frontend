import { useState, useEffect } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import UploadPage from "./pages/UploadPage.jsx";
import FichePage from "./pages/FichePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import FichesListPage from "./pages/FichesListPage.jsx";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Fermer le menu mobile à chaque navigation (meilleure UX mobile)
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="app">
      {/* ===== HEADER / HERO ===== */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="brand">
          <button
            className="menu-btn"
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>

          <div className="logo" role="img" aria-label="Générateur de fiches">
            <span className="logo-mark">✨</span>
            <span className="logo-text">Générateur de fiches</span>
          </div>

          <nav className="nav-desktop" aria-label="Navigation principale">
            <NavLink to="/" end className="nav-link">
              Upload
            </NavLink>
            <NavLink to="/fiches" className="nav-link">
              Mes fiches
            </NavLink>
          </nav>
        </div>

        <div className="hero-content">
          <h1>Crée tes fiches & génère un quiz en 1 clic</h1>
          <p>
            Téléverse un PDF/DOCX/TXT et obtiens un résumé propre, des mots-clés
            et un quiz pour réviser efficacement. Simple, rapide, gratuit.
          </p>

          <div className="cta-row">
            <NavLink to="/" end className="btn btn-primary">
              🚀 Commencer maintenant
            </NavLink>
            <NavLink to="/fiches" className="btn btn-ghost">
              Voir mes fiches
            </NavLink>
          </div>
        </div>

        {/* NAV MOBILE */}
        <div className={`nav-mobile ${menuOpen ? "open" : ""}`} role="menu">
          <NavLink to="/" end className="nav-mobile-link">
            Upload
          </NavLink>
          <NavLink to="/fiches" className="nav-mobile-link">
            Mes fiches
          </NavLink>
        </div>
      </header>

      {/* ===== MAIN CARD ===== */}
      <main className="shell">
        <div className="card">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/fiche/:ficheId" element={<FichePage />} />
            <Route path="/quiz/:ficheId" element={<QuizPage />} />
            <Route path="/fiches" element={<FichesListPage />} />
          </Routes>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        © {new Date().getFullYear()} Yanis Benkeder — Tous droits réservés
      </footer>

      {/* ===== STYLES ===== */}
      <style>{`
        /* ---------------- Base & iOS-friendly resets ---------------- */
        :root{
          --safe-top: env(safe-area-inset-top, 0px);
          --safe-right: env(safe-area-inset-right, 0px);
          --safe-bottom: env(safe-area-inset-bottom, 0px);
          --safe-left: env(safe-area-inset-left, 0px);
        }
        html, body, #root { height: 100%; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; overflow-x: hidden; }
        * { box-sizing: border-box; }
        a { color: inherit; }
        /* Désactive l'effet bleu iOS au tap */
        * { -webkit-tap-highlight-color: rgba(0,0,0,0); }

        /* ---------------- Thème (inchangé) ---------------- */
        .app {
          --bg: #0b0f19;            /* fond */
          --panel: #111827;         /* cartes */
          --muted: #9aa4b2;         /* texte secondaire */
          --text: #e5e7eb;          /* texte principal */
          --primary: #7c3aed;       /* violet (accent) */
          --primary-600: #6d28d9;
          --primary-700: #5b21b6;
          --ring: rgba(124, 58, 237, 0.55);

          min-height: 100vh;
          /* iOS 100vh fix: utiliser nouveaux viewport units quand dispo */
          min-height: 100svh;
          background: radial-gradient(1200px 800px at 20% -10%, #1b1f34 0%, transparent 60%),
                      radial-gradient(900px 600px at 100% 0%, #1c1232 0%, transparent 55%),
                      var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }
        @supports (height: 100dvh) {
          .app { min-height: 100dvh; } /* Android Chrome & iOS 16+ */
        }

        /* ---------------- HERO ---------------- */
        .hero {
          position: relative;
          padding: calc(20px + var(--safe-top)) 20px 40px 20px;
          overflow: clip;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hero-bg {
          position: absolute;
          inset: -20% -10% auto -10%;
          height: 340px;
          background:
            radial-gradient(600px 300px at 10% 0%, rgba(124,58,237,.35), transparent 60%),
            radial-gradient(600px 300px at 90% -10%, rgba(59,130,246,.25), transparent 60%);
          filter: blur(30px);
          pointer-events: none;
        }

        .brand {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-mark {
          display: inline-grid;
          place-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), #3b82f6);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.35);
          user-select: none;
        }
        .logo-text { font-weight: 700; letter-spacing: .2px; }

        /* Bouton burger : zone cliquable confortable (iOS recommande 44x44px) */
        .menu-btn {
          display: none;
          background: transparent;
          border: 0;
          color: var(--text);
          font-size: 1.6rem;
          line-height: 1;
          cursor: pointer;
          padding: 10px;           /* augmente la zone cible */
          min-width: 44px; min-height: 44px;
          border-radius: 10px;
        }
        .menu-btn:active { background: rgba(255,255,255,0.06); }

        .nav-desktop { display: flex; gap: 14px; }
        .nav-link {
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text);
          opacity: .92;
          transition: transform .15s ease, background .2s ease, outline-color .2s ease;
          min-height: 40px; display:inline-flex; align-items:center;
        }
        .nav-link.active,
        .nav-link[aria-current="page"] {
          background: rgba(124,58,237,0.12);
          outline: 1px solid rgba(124,58,237,0.25);
          color: #fff;
        }
        .nav-link:hover { transform: translateY(-1px); }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 32px auto 0;
          text-align: center;
          padding: 0 12px;
        }
        .hero-content h1 {
          font-size: clamp(1.5rem, 4.8vw, 2.6rem);
          line-height: 1.15;
          margin: 0 0 10px;
          letter-spacing: .2px;
        }
        .hero-content p {
          color: var(--muted);
          font-size: clamp(.95rem, 3.5vw, 1.05rem);
          margin: 0 auto;
          max-width: 720px;
        }

        .cta-row {
          margin-top: 18px;
          display: inline-flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
          outline: none;
          min-height: 44px;             /* tap target iOS */
        }
        .btn:focus-visible { box-shadow: 0 0 0 4px var(--ring); }
        .btn-primary {
          background: linear-gradient(180deg, var(--primary), var(--primary-600));
          box-shadow: 0 10px 28px rgba(124, 58, 237, .35);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          background: linear-gradient(180deg, var(--primary-600), var(--primary-700));
          box-shadow: 0 12px 32px rgba(124, 58, 237, .45);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

        /* ---------------- NAV MOBILE (en dehors du flux pour éviter les sauts) ---------------- */
        .nav-mobile {
          position: absolute;
          top: calc(56px + var(--safe-top));
          right: max(12px, var(--safe-right));
          background: #0f1424;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 10px;
          display: none;                 /* par défaut caché */
          flex-direction: column;
          gap: 6px;
          z-index: 5;
          box-shadow: 0 12px 40px rgba(0,0,0,0.45);
          width: min(80vw, 280px);
          -webkit-overflow-scrolling: touch;
        }
        .nav-mobile.open { display: flex; }
        .nav-mobile-link {
          color: var(--text);
          text-decoration: none;
          padding: 12px 12px;
          border-radius: 10px;
          min-height: 44px; display:flex; align-items:center;
        }
        .nav-mobile-link:active,
        .nav-mobile-link:hover {
          background: rgba(124,58,237,0.12);
          outline: 1px solid rgba(124,58,237,0.25);
        }

        /* ---------------- SHELL / CARD ---------------- */
        .shell {
          max-width: 1100px;
          margin: 22px auto 0;
          padding: 0 clamp(12px, 4vw, 16px) calc(40px + var(--safe-bottom));
        }
        .card {
          background: var(--panel);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: clamp(14px, 2vw, 16px);
          padding: clamp(14px, 2.2vw, 18px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          backdrop-filter: saturate(120%) blur(4px);
          -webkit-backdrop-filter: saturate(120%) blur(4px); /* iOS Safari */
        }

        /* ---------------- FOOTER ---------------- */
        .footer {
          text-align: center;
          color: var(--muted);
          font-size: .92rem;
          padding: 18px 12px calc(40px + var(--safe-bottom));
        }

        /* ---------------- ACCESSIBILITÉ & ANIMATIONS ---------------- */
        @media (prefers-reduced-motion: reduce) {
          .nav-link:hover, .btn:hover { transform: none; }
          .btn, .nav-link { transition: none; }
        }

        /* ---------------- RESPONSIVE ---------------- */
        @media (max-width: 920px) {
          .brand { padding-right: max(0px, var(--safe-right)); }
        }
        @media (max-width: 880px) {
          .nav-desktop { display: none; }
          .menu-btn { display: inline-block; }
          .brand { justify-content: space-between; }
        }
        @media (max-width: 390px) { /* iPhone mini */
          .logo-text { font-size: .96rem; }
          .logo-mark { width: 32px; height: 32px; }
          .cta-row { gap: 8px; }
        }
      `}</style>
    </div>
  );
}
