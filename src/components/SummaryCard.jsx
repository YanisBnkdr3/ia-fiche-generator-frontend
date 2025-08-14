export default function SummaryCard({ summary }) {
  if (!summary) return null;
  return (
    <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
      <h3>📝 Résumé</h3>
      <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{summary}</p>
    </div>
  );
}
