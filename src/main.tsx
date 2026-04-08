import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TournamentProvider } from './context/TournamentContext'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TournamentProvider>
      <App />
    </TournamentProvider>
  </StrictMode>,
)
