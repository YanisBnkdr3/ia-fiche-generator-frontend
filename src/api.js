const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ia-fiche-generator-backend.onrender.com";
const USER_ID = "test-user-1"; // remplacé par JWT plus tard

export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(
    `${BASE}/upload?user_id=${encodeURIComponent(USER_ID)}`,
    {
      method: "POST",
      body: form,
    }
  );
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}) ${txt}`);
  }
  return res.json();
}

export async function fetchMyFiches({ skip = 0, limit = 20 } = {}) {
  const url = new URL(`${BASE}/fiches/me`);
  url.searchParams.set("user_id", USER_ID);
  url.searchParams.set("skip", skip);
  url.searchParams.set("limit", limit);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch fiches failed (${res.status})`);
  return res.json();
}

export async function fetchQuizByFiche(ficheId) {
  const url = new URL(`${BASE}/quizzes/by-fiche/${ficheId}`);
  url.searchParams.set("user_id", USER_ID);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch quiz failed (${res.status})`);
  return res.json();
}

export async function submitQuizResult({
  quiz_id,
  fiche_id,
  answers,
  startedAt,
}) {
  const res = await fetch(
    `${BASE}/quiz-results?user_id=${encodeURIComponent(USER_ID)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiz_id, fiche_id, answers, startedAt }),
    }
  );
  if (!res.ok) throw new Error(`Submit result failed (${res.status})`);
  return res.json();
}
