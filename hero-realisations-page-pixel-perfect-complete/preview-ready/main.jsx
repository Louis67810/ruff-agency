import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function showError(error) {
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `<div style="font-family:Arial,sans-serif;padding:32px;color:#b00020;background:#fff;min-height:100vh"><h1 style="font-size:22px">Erreur de preview</h1><pre style="white-space:pre-wrap;line-height:1.5">${String(error?.stack || error?.message || error).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}</pre></div>`;
}

window.addEventListener("error", (event) => showError(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => showError(event.reason));

try {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  showError(error);
}
