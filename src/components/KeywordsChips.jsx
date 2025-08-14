export default function KeywordsChips({ keywords = [] }) {
  if (!keywords.length) return null;
  return (
    <div>
      <h3>🔑 Mots-clés</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {keywords.map((k, i) => (
          <span
            key={i}
            style={{
              padding: "6px 10px",
              border: "1px solid #ddd",
              borderRadius: 999,
            }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
