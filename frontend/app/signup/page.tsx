"use client";

import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

    const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setSuccess("");
        return;
    }

    setSuccess("Account created successfully.");
    setError("");
    }

    return (
  <main>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
    />

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
    />

    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Password"
    />

    <button type="submit">
      Create Account
    </button>
  </form>

  {error && <p>{error}</p>}
  {success && <p>{success}</p>}
</main>
);
}
