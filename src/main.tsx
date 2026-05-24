import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import App from './App'
import { GuestAuthBootstrap } from './components/GuestAuthBootstrap'
import { convex } from './lib/convex'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <GuestAuthBootstrap />
        <App />
      </BrowserRouter>
    </ConvexAuthProvider>
  </StrictMode>,
)
