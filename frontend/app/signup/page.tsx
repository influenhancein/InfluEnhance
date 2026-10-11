"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ThemeToggle from "../theme-toggle";

type SignupResponse = {
  message?: string;
};

export default function SignupPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        },
      );
      const result = (await response.json()) as SignupResponse;
      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        setMessage(result.message ?? "The signup request could not be completed.");
      }
    } catch {
      setMessage("Could not reach the signup service. Make sure the backend is running.");
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

      <section className="loginCard" aria-labelledby="signup-title">
        <p className="eyebrow">JOIN INFLUENHANCE</p>
        <h1 id="signup-title">Create your account</h1>
        <p className="loginIntro">Start growing your influence today.</p>

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
            autoComplete="new-password"
            id="password"
            minLength={8}
            name="password"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}"
            placeholder="Create a strong password"
            required
            title="Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
            type="password"
          />
          <p className="passwordHint">
            At least 8 characters, with uppercase and lowercase letters, a number, and a special character.
          </p>

          <button className="primaryButton loginSubmit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {message && <p className="loginMessage" role="status">{message}</p>}
        <p className="loginNote">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
