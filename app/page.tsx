"use client"

import React, { useState, useEffect } from "react";
import Login from "@/components/auth/Login";
import MainApp from "@/components/MainApp";

export default function App() {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  useEffect(() => {
    if (!token) localStorage.removeItem("token");
  }, [token]);

  return token ? (
    <MainApp token={token} setToken={setToken} />
  ) : (
    <Login setToken={setToken} />
  );
}
