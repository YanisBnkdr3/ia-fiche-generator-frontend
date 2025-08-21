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

  if (error) return <p className="quiz-error">{error}</p>;
  if (!quiz) return <p className="quiz-loading">Chargement du quiz…</p>;

  /* ---------- Écran Résultat ---------- */
  if (result) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-card">
          <h2 className="quiz-title">Résultat</h2>
          <p className="quiz-score">
            Score : <b>{result.score}</b> / {result.total}
          </p>

          <h3 className="quiz-subtitle">Détail des réponses</h3>
          <div className="quiz-report">
            {result.report.map((r, i) => (
              <div
                key={i}
                className={`quiz-report-item ${r.is_correct ? "ok" : "ko"}`}
              >
                {r.type === "mcq" ? (
                  <>
                    <p className="q-text">
                      <b>Q{r.q_index + 1}.</b> {r.question}
                    </p>
                    <ul className="choices">
                      {r.choices.map((c, idx) => {
                        const isCorrect = idx === r.correct_index;
                        const isSelected = idx === r.selected_index;
                        return (
                          <li
                            key={idx}
                            className={[
                              "choice",
                              isSelected ? "selected" : "",
                              isCorrect ? "correct" : "",
                            ].join(" ")}
                          >
                            <span className="bullet" aria-hidden />
                            <span className="choice-label">{c}</span>
                            {isCorrect && <span className="badge">✅</span>}
                            {isSelected && !isCorrect && (
                              <span className="badge">👉</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    {!r.is_correct && (
                      <p className="explain-warn">
                        Réponse correcte : choix #{r.correct_index + 1}
                      </p>
                    )}
                    {r.explanation && (
                      <p className="explain-note">ℹ️ {r.explanation}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="q-text">
                      <b>Q{r.q_index + 1}.</b> {r.statement}
                    </p>
                    <p className="tf-line">
                      Ta réponse :{" "}
                      <span className="tf-chip">{String(r.selected_bool)}</span>
                    </p>
                    <p className="tf-line">
                      Bonne réponse :{" "}
                      <span className="tf-chip">{String(r.correct_bool)}</span>{" "}
                      {r.is_correct ? "✅" : "❌"}
                    </p>
                    {r.explanation && (
                      <p className="explain-note">ℹ️ {r.explanation}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <style>{styles}</style>
      </div>
    );
  }

  /* ---------- Écran Réponse ---------- */
  return (
    <div className="quiz-wrap">
      <div className="quiz-card">
        <h2 className="quiz-title">Quiz (fiche {quiz.fiche_id})</h2>

        <div className="quiz-list">
          {quiz.questions.map((q, idx) => (
            <section key={idx} className="quiz-item">
              {q.type === "mcq" ? (
                <>
                  <p className="q-text">
                    <b>Q{idx + 1}.</b> {q.question}
                  </p>
                  <ul className="choices">
                    {q.choices.map((c, i) => {
                      const checked = answers[idx]?.selected_index === i;
                      return (
                        <li key={i}>
                          <label
                            className={`opt ${checked ? "checked" : ""}`}
                            htmlFor={`q${idx}-opt${i}`}
                          >
                            <input
                              id={`q${idx}-opt${i}`}
                              type="radio"
                              className="radio"
                              name={`q${idx}`}
                              checked={checked}
                              onChange={() => {
                                setAnswers((prev) => {
                                  const next = [...prev];
                                  next[idx] = {
                                    q_index: idx,
                                    selected_index: i,
                                  };
                                  return next;
                                });
                              }}
                            />
                            <span className="opt-mark" aria-hidden />
                            <span className="opt-label">{c}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <p className="q-text">
                    <b>Q{idx + 1}.</b> {q.statement}
                  </p>
                  <div className="tf-group">
                    <label
                      className={`opt ${
                        answers[idx]?.selected_bool === true ? "checked" : ""
                      }`}
                      htmlFor={`q${idx}-true`}
                    >
                      <input
                        id={`q${idx}-true`}
                        type="radio"
                        className="radio"
                        name={`q${idx}`}
                        checked={answers[idx]?.selected_bool === true}
                        onChange={() => {
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = { q_index: idx, selected_bool: true };
                            return next;
                          });
                        }}
                      />
                      <span className="opt-mark" aria-hidden />
                      <span className="opt-label">Vrai</span>
                    </label>

                    <label
                      className={`opt ${
                        answers[idx]?.selected_bool === false ? "checked" : ""
                      }`}
                      htmlFor={`q${idx}-false`}
                    >
                      <input
                        id={`q${idx}-false`}
                        type="radio"
                        className="radio"
                        name={`q${idx}`}
                        checked={answers[idx]?.selected_bool === false}
                        onChange={() => {
                          setAnswers((prev) => {
                            const next = [...prev];
                            next[idx] = { q_index: idx, selected_bool: false };
                            return next;
                          });
                        }}
                      />
                      <span className="opt-mark" aria-hidden />
                      <span className="opt-label">Faux</span>
                    </label>
                  </div>
                </>
              )}
            </section>
          ))}
        </div>

        <div className="submit-row">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`btn ${canSubmit ? "btn-primary" : "btn-disabled"}`}
          >
            ✅ Soumettre
          </button>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
}

/* ---------------- CSS (même thème que App.jsx, responsive mobile iPhone) ---------------- */
const styles = `
.quiz-wrap {
  padding: 10px 0 0;
}
.quiz-card {
  background: var(--panel);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: clamp(14px, 2vw, 16px);
  padding: clamp(14px, 2.2vw, 18px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}
.quiz-title {
  margin: 0 0 8px;
  font-size: clamp(1.15rem, 3.8vw, 1.35rem);
}
.quiz-subtitle {
  margin: 18px 0 10px;
  color: var(--muted);
  font-size: clamp(1rem, 3.2vw, 1.05rem);
}
.quiz-score {
  margin: 4px 0 0;
}

.quiz-list { display: grid; gap: 14px; margin-top: 10px; }
.quiz-item {
  background: rgba(17,24,39,.55);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 14px;
  padding: clamp(12px, 2vw, 14px);
}
.q-text {
  margin: 0 0 8px;
  line-height: 1.4;
  font-size: clamp(1rem, 3.6vw, 1.05rem);
}

/* Options / radios stylées */
.choices { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.opt {
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.06);
  background: rgba(255,255,255,.02);
  cursor: pointer;
  min-height: 44px;               /* tap target */
  transition: transform .12s ease, background .2s ease, border-color .2s ease;
}
.opt:hover { transform: translateY(-1px); background: rgba(255,255,255,.04); }
.opt.checked { border-color: rgba(124,58,237,.35); background: rgba(124,58,237,.10); }
.opt-label { font-size: clamp(.97rem, 3.2vw, 1rem); }
.radio { position: absolute; opacity: 0; pointer-events: none; }
.opt-mark {
  width: 20px; height: 20px; border-radius: 999px;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.55);
  background: transparent;
  transition: box-shadow .2s ease, background .2s ease;
}
.opt.checked .opt-mark {
  box-shadow: inset 0 0 0 6px rgba(124,58,237,.9);
  background: rgba(124,58,237,.35);
}

/* True/False group */
.tf-group { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.tf-chip {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 2px 8px; border-radius: 999px;
  background: rgba(124,58,237,.12);
  border: 1px solid rgba(124,58,237,.35);
}

/* Report */
.quiz-report { display: grid; gap: 12px; margin-top: 10px; }
.quiz-report-item {
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px;
  padding: 12px;
  background: rgba(17,24,39,.55);
}
.quiz-report-item.ok { background: linear-gradient(180deg, rgba(16,185,129,.18), rgba(17,24,39,.55)); }
.quiz-report-item.ko { background: linear-gradient(180deg, rgba(239,68,68,.18), rgba(17,24,39,.55)); }

.choices .choice {
  display:flex; align-items:center; gap:10px;
  padding: 8px 10px; border-radius: 10px;
}
.choices .choice .bullet {
  width: 8px; height: 8px; border-radius: 999px;
  background: rgba(255,255,255,.45);
}
.choices .choice.selected { background: rgba(255,255,255,.04); }
.choices .choice.correct .bullet { background: #34d399; } /* vert */

.explain-warn { color: #fca5a5; margin: 6px 0 0; }
.explain-note { color: var(--muted); margin: 6px 0 0; font-size: .92rem; }
.badge { margin-left: auto; opacity: .9; }

/* Submit */
.submit-row { margin-top: 14px; display: flex; justify-content: center; }
.btn { 
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding: 12px 16px; border-radius: 14px; font-weight: 600; text-decoration:none;
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease; outline: none;
  min-height: 44px;
}
.btn-primary {
  background: linear-gradient(180deg, var(--primary), var(--primary-600));
  box-shadow: 0 10px 28px rgba(124, 58, 237, .35);
  color: #fff;
}
.btn-primary:hover { transform: translateY(-1px); }
.btn-disabled {
  background: rgba(255,255,255,.08); color: #b9c0cc; cursor: not-allowed;
  border: 1px solid rgba(255,255,255,.06);
}

/* States */
.quiz-error { color: #ffb4b4; }
.quiz-loading { color: var(--muted); }

/* Responsive fine-tuning */
@media (max-width: 520px) {
  .tf-group { grid-template-columns: 1fr; }     /* Vrai/Faux en pile sur petits écrans */
  .opt { grid-template-columns: 22px 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .opt:hover, .btn:hover { transform: none; }
}
`;
