import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../api.js";
import FileDropzone from "../components/FileDropZone.jsx";

export default function UploadPage() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleFile(file) {
    setLoading(true);
    setError("");
    setResp(null);
    try {
      const data = await uploadFile(file);
      setResp(data);
      if (data?.ficheId) {
        nav(`/fiche/${data.ficheId}`, { state: { initial: data } });
      }
    } catch (e) {
      setError(e.message || "Erreur upload");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <FileDropzone
        onPick={() => inputRef.current?.click()}
        onDropFile={handleFile}
      />
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {loading && <p>⏳ Traitement en cours…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {resp && (
        <details
          open
          style={{ background: "#f7f7f7", padding: 12, borderRadius: 8 }}
        >
          <summary>Réponse JSON (aperçu)</summary>
          <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>
            {JSON.stringify(resp, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
