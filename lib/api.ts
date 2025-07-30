const API_BASE = "http://localhost:5000";

export async function startReminders({
  phone_number,
  messages,
  interval,
  brutal_mode,
  brutal_messages,
}: {
  phone_number: string;
  messages: string[];
  interval: number;
  brutal_mode: boolean;
  brutal_messages?: string[];
}) {
  const res = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone_number,
      messages,
      interval,
      brutal_mode,
      brutal_messages,
    }),
  });
  return res.json();
}

export async function stopReminders(phone_number: string) {
  const res = await fetch(`${API_BASE}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number }),
  });
  return res.json();
}

export async function markDone(phone_number: string) {
  const res = await fetch(`${API_BASE}/done`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number }),
  });
  return res.json();
}

export async function getStatus(phone_number: string) {
  const res = await fetch(`${API_BASE}/status?phone_number=${encodeURIComponent(phone_number)}`);
  return res.json();
} 