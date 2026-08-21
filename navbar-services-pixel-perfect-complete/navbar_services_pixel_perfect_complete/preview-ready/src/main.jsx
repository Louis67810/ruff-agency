import React from "react";
import { createRoot } from "react-dom/client";
import NavBar from "../NavBar.jsx";
import "../tokens.css";
import "../NavBar.css";

window.addEventListener("error", e => { const p=document.createElement("pre"); p.style="color:#b00020;background:#fff;padding:24px;white-space:pre-wrap"; p.textContent="Erreur React/Vite : "+(e.error?.stack||e.message); document.body.prepend(p); });
window.addEventListener("unhandledrejection", e => { const p=document.createElement("pre"); p.style="color:#b00020;background:#fff;padding:24px;white-space:pre-wrap"; p.textContent="Erreur : "+(e.reason?.stack||e.reason); document.body.prepend(p); });

function App(){ return <><NavBar/><main style={{minHeight:1400,background:"linear-gradient(#fafafa,#f3f5fb)",padding:"72px 24px",fontFamily:"Inter, sans-serif",color:"#121a2e"}}><div style={{maxWidth:1000,margin:"0 auto"}}><h1 style={{fontFamily:"Plus Jakarta Sans, sans-serif",fontSize:48,margin:0}}>Zone de preview</h1><p>Redimensionne la fenêtre pour tester desktop / tablette / mobile. Sur desktop, survole « Services ». Sur mobile, ouvre le burger.</p></div></main></>; }
createRoot(document.getElementById("root")).render(<App/>);
