const API_URL = "http://127.0.0.1:8000";

export const api = {

  // ── Matches ──────────────────────────────
  getMatches: async () => {
    const res = await fetch(`${API_URL}/api/matches`);
    return res.json();
  },

  getStandings: async () => {
  const res = await fetch(`${API_URL}/api/matches/standings`);
  return res.json();
},

  // ── Teams ────────────────────────────────
  getTeams: async () => {
    const res = await fetch(`${API_URL}/api/teams`);
    return res.json();
  },

  // ── Travel ───────────────────────────────
  getCities: async () => {
    const res = await fetch(`${API_URL}/api/travel/cities`);
    return res.json();
  },

  estimateBudget: async (data: {
    origin_city: string;
    destination_city: string;
    nb_persons: number;
    nb_nights: number;
  }) => {
    const res = await fetch(`${API_URL}/api/travel/budget`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── Chat ─────────────────────────────────
  chat: async (
  message: string,
  sessionId: string | undefined,
  onChunk: (text: string) => void
): Promise<{ session_id: string; intent: string }> => {
  const res = await fetch(`${API_URL}/api/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!res.body) throw new Error("Pas de flux de réponse");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalSessionId = sessionId || "";
  let finalIntent = "chat";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // garde la ligne incomplète pour le prochain tour

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.response) onChunk(parsed.response);
        if (parsed.session_id) finalSessionId = parsed.session_id;
        if (parsed.intent) finalIntent = parsed.intent;
      } catch {
        // ligne incomplète, on ignore silencieusement
      }
    }
  }

  return { session_id: finalSessionId, intent: finalIntent };
},
};