import React from "react";
import { createRoot } from "react-dom/client";
import Footer from "./Footer.jsx";
import "./Footer.css";

class PreviewErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={error:null}; }
  static getDerivedStateFromError(error){ return {error}; }
  render(){ if(this.state.error) return <pre style={{padding:24,color:"#b00020",whiteSpace:"pre-wrap"}}>Erreur React : {String(this.state.error?.stack || this.state.error)}</pre>; return this.props.children; }
}

createRoot(document.getElementById("root")).render(<PreviewErrorBoundary><Footer /></PreviewErrorBoundary>);
