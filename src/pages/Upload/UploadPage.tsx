import { UploadBenefitsSection } from '@/components/pages/Upload/UploadBenefitsSection'
import { UploadHeroSection } from '@/components/pages/Upload/UploadHeroSection'

export function UploadPage() {
  return (
    <div data-read-aloud="page" className="relative overflow-hidden">
      <div className="hero-spotlight pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <UploadHeroSection />
      </main>

      <UploadBenefitsSection />
    </div>
  )
}
