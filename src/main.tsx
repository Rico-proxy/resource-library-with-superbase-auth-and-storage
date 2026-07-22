import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner'
import { AccessibilityProvider } from '@/components/shared/AccessibilityProvider'
import { Analytics } from "@vercel/analytics/next"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
      <Analytics />
      <Toaster />
    </AccessibilityProvider>
  </StrictMode>,
)
