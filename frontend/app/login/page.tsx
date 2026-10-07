"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import ThemeToggle from "../theme-toggle";

type LoginResponse = {
  message?: string;
};

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        },
      );
      const result = (await response.json()) as LoginResponse;
      setMessage(result.message ?? "The login request could not be completed.");
    } catch {
      setMessage("Could not reach the login service. Make sure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="loginPage">
      <header className="loginHeader">
        <Link className="logo" href="/">
          Influ<span>Enhance</span>
        </Link>
        <div className="navActions">
          <ThemeToggle />
          <Link className="backLink" href="/">Back to home</Link>
        </div>
      </header>

      <section className="loginCard" aria-labelledby="login-title">
        <p className="eyebrow">WELCOME BACK</p>
        <h1 id="login-title">Log in to your account</h1>
        <p className="loginIntro">Continue growing your influence.</p>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            type="password"
          />

          <button className="primaryButton loginSubmit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Connecting..." : "Log in"}
          </button>
        </form>

        {message && <p className="loginMessage" role="status">{message}</p>}
        <p className="loginNote">
          New to InfluEnhance? <Link href="/">Explore the platform</Link>
        </p>
      </section>
    </main>
  );
}
