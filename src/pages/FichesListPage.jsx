import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyFiches } from "../api.js";

export default function FichesListPage() {
  const [data, setData] = useState({ total: 0, items: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyFiches()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <h2>Mes fiches</h2>
      <ul>
        {data.items.map((f) => (
          <li key={f._id} style={{ marginBottom: 8 }}>
            <Link to={`/fiche/${f._id}`}>{f.source?.filename || f._id}</Link> —{" "}
            {f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}
          </li>
        ))}
      </ul>
      {data.total === 0 && <p>Aucune fiche pour le moment.</p>}
    </div>
  );
}
