import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { AccessibilityProvider } from '@/components/shared/AccessibilityProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
      <Toaster />
    </AccessibilityProvider>
  </StrictMode>,
)
