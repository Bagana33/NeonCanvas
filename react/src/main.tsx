import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import { FlagsProvider } from './contexts/FlagsContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FlagsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FlagsProvider>
  </React.StrictMode>
)
