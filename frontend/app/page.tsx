import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Home() {
  return (
    <main className="page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Influ<span>Enhance</span>
        </div>

        <div className="navActions">
          <ThemeToggle />
          <Link className="navButton" href="/login">Get Started</Link>
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
            <Link className="primaryButton" href="/login">Get Started</Link>
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
      <section className="features">
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
        <Link className="primaryButton" href="/login">Get Started</Link>
      </section>

      <footer>
        © 2026 InfluEnhance. All rights reserved.
      </footer>
    </main>
  );
}