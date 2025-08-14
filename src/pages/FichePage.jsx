import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { fetchMyFiches } from "../api.js";
import SummaryCard from "../components/SummaryCard.jsx";
import KeywordsChips from "../components/KeywordsChips.jsx";

export default function FichePage() {
  const { ficheId } = useParams();
  const location = useLocation();
  const initial = location.state?.initial;
  const [fiche, setFiche] = useState(null);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setFiche({
        _id: ficheId,
        summary: initial.summary,
        keywords: initial.keywords,
        filename: initial.filename,
        createdAt: new Date().toISOString(),
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMyFiches()
      .then((data) => {
        const found = data.items.find((x) => x._id === ficheId);
        if (!found) throw new Error("Fiche introuvable");
        setFiche(found);
      })
      .catch((e) => setError(e.message || "Erreur chargement fiche"))
      .finally(() => setLoading(false));
  }, [ficheId, initial]);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!fiche) return <p>Fiche introuvable.</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Fiche : {fiche.filename || fiche._id}</h2>
      <SummaryCard summary={fiche.summary} />
      <KeywordsChips keywords={fiche.keywords || []} />
      <div>
        <Link to={`/quiz/${ficheId}`} className="btn">
          ▶️ Jouer le quiz
        </Link>
      </div>
    </div>
  );
}
