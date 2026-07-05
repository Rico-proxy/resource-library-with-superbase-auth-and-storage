import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LandingBanner } from '@/components/pages/Landing/LandingBanner'
import { LandingCategoriesSection } from '@/components/pages/Landing/LandingCategoriesSection'
import { LandingFaqSection } from '@/components/pages/Landing/LandingFaqSection'
import { LandingFeaturedResourcesSection } from '@/components/pages/Landing/LandingFeaturedResourcesSection'
import { LandingOverviewSection } from '@/components/pages/Landing/LandingOverviewSection'
import { LandingQuickActionsSection } from '@/components/pages/Landing/LandingQuickActionsSection'
import { LandingTrustRowSection } from '@/components/pages/Landing/LandingTrustRowSection'
import { LandingUploadCtaSection } from '@/components/pages/Landing/LandingUploadCtaSection'
import { listCommunityDocumentsByCategory } from '@/lib/storage'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

const emptyDocumentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]> = {
  educational: [],
  literature: [],
  history: [],
  'business-career': [],
}

export function LandingPage() {
  const [documentsByCategory, setDocumentsByCategory] =
    useState<Record<ResourceCategorySlug, ResourceDocument[]>>(emptyDocumentsByCategory)
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDocuments = async () => {
      setIsLoadingDocuments(true)
      try {
        const grouped = await listCommunityDocumentsByCategory()
        if (isMounted) {
          setDocumentsByCategory(grouped)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Unable to load featured resources.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingDocuments(false)
        }
      }
    }

    loadDocuments()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div data-read-aloud="page" className="relative overflow-hidden">
      <div className="-z-10 absolute inset-0 pointer-events-none hero-spotlight" />
      <div className="-z-10 absolute inset-0 hero-grid opacity-40 pointer-events-none" />

      <LandingBanner />

      <main className="flex flex-col gap-[5rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full max-w-6xl">
        <LandingOverviewSection documentsByCategory={documentsByCategory} isLoading={isLoadingDocuments} />
        <LandingTrustRowSection />
        <LandingQuickActionsSection />
        <LandingCategoriesSection />
        <LandingFeaturedResourcesSection documentsByCategory={documentsByCategory} isLoading={isLoadingDocuments} />
        <LandingFaqSection />
        <LandingUploadCtaSection />
      </main>
    </div>
  )
}
