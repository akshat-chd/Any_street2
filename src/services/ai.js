const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8787';

export async function askAnyStreetAI(payload) {
  const response = await fetch(`${AI_API_BASE_URL}/api/ai/assistant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'The AI assistant is unavailable right now.');
  }

  return response.json();
}
