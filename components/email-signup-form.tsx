"use client";

import { useState } from "react";

const statusCopy = {
  idle: "Get launch updates",
  loading: "Sending...",
  success: "You are on the list",
  error: "Try again in a moment",
};

export default function EmailSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<keyof typeof statusCopy>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      setStatus("success");
      setMessage(data.message ?? "We will be in touch.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Try again soon.");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-3xl border border-black/10 bg-white/80 p-4"
    >
      <label className="text-xs uppercase tracking-[0.3em] text-black/60">
        Drop updates
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="flex-1 rounded-full border border-black/20 bg-white px-4 py-3 text-sm text-black/80 placeholder:text-black/40 focus:border-black/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-ember px-6 py-3 text-xs uppercase tracking-[0.3em] text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {statusCopy[status]}
        </button>
      </div>
      {message ? (
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">
          {message}
        </p>
      ) : null}
    </form>
  );
}
