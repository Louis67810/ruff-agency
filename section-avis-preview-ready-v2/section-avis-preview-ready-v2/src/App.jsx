import React from 'react'
import SectionAvis from './SectionAvis.jsx'

class PreviewErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('SectionAvis preview error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="preview-error">
          <strong>Erreur dans le composant SectionAvis.</strong>
          <span>Copie ce message et envoie-le moi :</span>
          <pre>{this.state.error.stack || this.state.error.message || String(this.state.error)}</pre>
        </main>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <PreviewErrorBoundary>
      <SectionAvis />
    </PreviewErrorBoundary>
  )
}
