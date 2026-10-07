"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const storageKey = "influenhance-theme";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("influenhance-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("influenhance-theme-change", callback);
  };
}

function getThemeSnapshot(): Theme {
  return window.localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
    window.dispatchEvent(new Event("influenhance-theme-change"));
  }

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="themeToggle"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
