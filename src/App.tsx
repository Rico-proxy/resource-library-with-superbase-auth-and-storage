import { LandingPage } from '@/pages/Landing/LandingPage'
import { UploadPage } from '@/pages/Upload/UploadPage'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { SignupPage } from '@/pages/Auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/Auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/Auth/ResetPasswordPage'
import { ResourcesPage } from '@/pages/Resources/ResourcesPage'
import { CategoriesPage } from '@/pages/Resources/CategoriesPage'
import { DocumentPreviewPage } from '@/pages/Resources/DocumentPreviewPage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BaseLayout } from '@/layouts/BaseLayout'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { AccessibilityPanel } from '@/components/shared/AccessibilityPanel'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AccessibilityPanel />
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/preview" element={<DocumentPreviewPage />} />
          <Route path="/resources/:categorySlug" element={<CategoriesPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
