import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchQuizByFiche, submitQuizResult } from "../api.js";

export default function QuizPage() {
  const { ficheId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuizByFiche(ficheId)
      .then((q) => {
        setQuiz(q);
        const init = q.questions.map((qq, idx) =>
          qq.type === "mcq"
            ? { q_index: idx, selected_index: null }
            : { q_index: idx, selected_bool: null }
        );
        setAnswers(init);
      })
      .catch((e) => setError(e.message || "Erreur chargement quiz"));
  }, [ficheId]);

  const canSubmit = useMemo(() => {
    if (!quiz) return false;
    return answers.every(
      (a) => a.selected_index !== null || a.selected_bool !== null
    );
  }, [answers, quiz]);

  async function onSubmit() {
    try {
      const payload = {
        quiz_id: quiz._id,
        fiche_id: quiz.fiche_id,
        answers,
        startedAt: new Date().toISOString(),
      };
      const r = await submitQuizResult(payload);
      setResult(r);
    } catch (e) {
      setError(e.message || "Erreur soumission");
    }
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!quiz) return <p>Chargement du quiz…</p>;

  // Affichage du rapport détaillé après soumission
  if (result) {
    return (
      <div className="result-container">
        <h2>Résultat</h2>
        <p>
          Score : <b>{result.score}</b> / {result.total}
        </p>

        <h3>Détail des réponses</h3>
        {result.report.map((r, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 12,
              background: r.is_correct ? "#ecffec" : "#ffecec",
            }}
          >
            {r.type === "mcq" ? (
              <>
                <p>
                  <b>Q{r.q_index + 1}.</b> {r.question}
                </p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {r.choices.map((c, idx) => {
                    const isCorrect = idx === r.correct_index;
                    const isSelected = idx === r.selected_index;
                    return (
                      <li
                        key={idx}
                        style={{
                          margin: "4px 0",
                          fontWeight: isSelected ? "600" : "400",
                          textDecoration: isCorrect ? "underline" : "none",
                        }}
                      >
                        {isSelected ? "👉 " : ""}
                        {c}
                        {isCorrect ? " ✅" : ""}
                      </li>
                    );
                  })}
                </ul>
                {!r.is_correct && (
                  <p style={{ color: "#c00" }}>
                    Réponse correcte : choix #{r.correct_index + 1}
                  </p>
                )}
                {r.explanation && (
                  <p style={{ fontSize: 13, color: "#666" }}>
                    ℹ️ {r.explanation}
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  <b>Q{r.q_index + 1}.</b> {r.statement}
                </p>
                <p>Ta réponse : {String(r.selected_bool)}</p>
                <p>
                  Bonne réponse : {String(r.correct_bool)}{" "}
                  {r.is_correct ? "✅" : "❌"}
                </p>
                {r.explanation && (
                  <p style={{ fontSize: 13, color: "#666" }}>
                    ℹ️ {r.explanation}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Écran pour répondre
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Quiz (fiche {quiz.fiche_id})</h2>
      {quiz.questions.map((q, idx) => (
        <div
          key={idx}
          style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}
        >
          {q.type === "mcq" ? (
            <>
              <p>
                <b>Q{idx + 1}.</b> {q.question}
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {q.choices.map((c, i) => {
                  const checked = answers[idx]?.selected_index === i;
                  return (
                    <li key={i} style={{ margin: "6px 0" }}>
                      <label style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          name={`q${idx}`}
                          checked={checked}
                          onChange={() => {
                            setAnswers((prev) => {
                              const next = [...prev];
                              next[idx] = { q_index: idx, selected_index: i };
                              return next;
                            });
                          }}
                        />{" "}
                        {c}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <p>
                <b>Q{idx + 1}.</b> {q.statement}
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <label>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={answers[idx]?.selected_bool === true}
                    onChange={() => {
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[idx] = { q_index: idx, selected_bool: true };
                        return next;
                      });
                    }}
                  />{" "}
                  Vrai
                </label>
                <label>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={answers[idx]?.selected_bool === false}
                    onChange={() => {
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[idx] = { q_index: idx, selected_bool: false };
                        return next;
                      });
                    }}
                  />{" "}
                  Faux
                </label>
              </div>
            </>
          )}
        </div>
      ))}
      <button onClick={onSubmit} disabled={!canSubmit}>
        ✅ Soumettre
      </button>
    </div>
  );
}
