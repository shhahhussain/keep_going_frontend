import React, { useState } from "react";

interface LoginProps {
  setToken: (token: string) => void;
}

export default function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload: Record<string, string> = { email, password };
    if (mode === "signup") payload.companySlug = companySlug;

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const { token } = await res.json();
      localStorage.setItem("token", token);
      setToken(token);
    } catch (e) {
      setError("Auth failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded-2xl space-y-4"
    >
      <h1 className="text-xl font-bold text-center">
        {mode === "login" ? "Login" : "Signup"}
      </h1>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {mode === "signup" && (
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Company Slug"
          value={companySlug}
          onChange={(e) => setCompanySlug(e.target.value)}
        />
      )}
      <button className="w-full bg-black text-white py-2 rounded">
        {mode === "login" ? "Login" : "Signup"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="text-sm text-gray-600 underline w-full"
      >
        {mode === "login"
          ? "Need an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </form>
  );
}
