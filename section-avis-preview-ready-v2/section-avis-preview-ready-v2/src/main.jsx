import React from 'react'
import ReactDOM from 'react-dom/client'
import './tokens.css'
import './SectionAvis.css'
import './preview.css'

const rootElement = document.getElementById('root')
const statusElement = document.getElementById('boot-status')

function formatError(error) {
  if (!error) return 'Erreur inconnue.'
  return error.stack || error.message || String(error)
}

function showFatal(error) {
  console.error(error)
  if (statusElement) {
    statusElement.className = 'preview-error'
    statusElement.innerHTML = `
      <strong>La preview React a rencontre une erreur.</strong>
      <span>Copie le texte ci-dessous et envoie-le moi :</span>
      <pre></pre>
    `
    statusElement.querySelector('pre').textContent = formatError(error)
  }
}

window.addEventListener('error', (event) => {
  if (event.error) showFatal(event.error)
})
window.addEventListener('unhandledrejection', (event) => {
  showFatal(event.reason)
})

try {
  const { default: App } = await import('./App.jsx')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  requestAnimationFrame(() => statusElement?.remove())
} catch (error) {
  showFatal(error)
}
