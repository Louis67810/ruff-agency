import React from "react";
import { createRoot } from "react-dom/client";
import StackSection3 from "./StackSection3.jsx";
import "./preview.css";

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="preview-error">
          <h1>Erreur dans la preview</h1>
          <pre>{String(this.state.error?.stack || this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener("error", (event) => {
  console.error("Preview error:", event.error || event.message);
});

createRoot(document.getElementById("root")).render(
  <PreviewErrorBoundary>
    <StackSection3 />
  </PreviewErrorBoundary>,
);
