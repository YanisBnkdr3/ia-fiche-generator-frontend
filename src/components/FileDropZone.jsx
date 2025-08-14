import { useCallback } from "react";

export default function FileDropzone({ onPick, onDropFile }) {
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) onDropFile(file);
    },
    [onDropFile]
  );

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{
        border: "2px dashed #ccc",
        borderRadius: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p>Glisse un PDF/DOCX/TXT ici ou</p>
      <button type="button" onClick={onPick}>
        Choisir un fichier
      </button>
    </div>
  );
}
