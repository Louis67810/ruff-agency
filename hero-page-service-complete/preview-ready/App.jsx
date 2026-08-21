import React from "react";
import HeroContent from "./HeroContent.jsx";

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.error) {
      return (
        <pre className="preview-error">
          {`Erreur React dans la preview:\n\n${this.state.error?.stack || this.state.error?.message || String(this.state.error)}`}
        </pre>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <PreviewErrorBoundary>
      <HeroContent />
    </PreviewErrorBoundary>
  );
}
