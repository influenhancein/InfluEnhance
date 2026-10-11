"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toggle";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const getStartedHref = isAuthenticated === false ? "/login" : "#features";

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    fetch(`${apiUrl}/api/session`, { credentials: "include" })
      .then((response) => response.json())
      .then((result: { authenticated?: boolean }) => {
        setIsAuthenticated(result.authenticated === true);
      })
      .catch((error: unknown) => {
        console.error("Could not check the current login session:", error);
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <main className="page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Influ<span>Enhance</span>
        </div>

        <div className="navActions">
          <ThemeToggle />
          <Link className="navButton" href={getStartedHref}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="heroContent">
          <p className="eyebrow">WELCOME TO INFLUENHANCE</p>

          <h1>
            Enhance your
            <span> influence.</span>
          </h1>

          <p className="subtitle">
            Grow your presence, connect with the right people, and turn your
            influence into meaningful opportunities.
          </p>

          <div className="buttons">
            <Link className="primaryButton" href={getStartedHref}>Get Started</Link>
            <button className="secondaryButton">Learn More</button>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardCircle">✦</div>
          <h2>InfluEnhance</h2>
          <p>Grow. Connect. Enhance.</p>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="feature">
          <div className="icon">↗</div>
          <h3>Grow</h3>
          <p>
            Build your presence and reach a wider audience.
          </p>
        </div>

        <div className="feature">
          <div className="icon">◎</div>
          <h3>Connect</h3>
          <p>
            Connect with people, creators, and opportunities.
          </p>
        </div>

        <div className="feature">
          <div className="icon">✦</div>
          <h3>Enhance</h3>
          <p>
            Turn your influence into meaningful results.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <p className="eyebrow">READY TO GET STARTED?</p>
        <h2>Take your influence to the next level.</h2>
        <Link className="primaryButton" href={getStartedHref}>Get Started</Link>
      </section>

      <footer>
        © 2026 InfluEnhance. All rights reserved.
      </footer>
    </main>
  );
}