import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LandingBanner } from '@/components/pages/Landing/LandingBanner'
import { LandingCategoriesSection } from '@/components/pages/Landing/LandingCategoriesSection'
import { LandingFeaturedResourcesSection } from '@/components/pages/Landing/LandingFeaturedResourcesSection'
import { LandingOverviewSection } from '@/components/pages/Landing/LandingOverviewSection'
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
    <div className="relative overflow-hidden">
      <div className="hero-spotlight pointer-events-none absolute inset-0 -z-10" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <LandingBanner />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <LandingOverviewSection documentsByCategory={documentsByCategory} isLoading={isLoadingDocuments} />
        <LandingCategoriesSection />
        <LandingFeaturedResourcesSection documentsByCategory={documentsByCategory} isLoading={isLoadingDocuments} />
        <LandingUploadCtaSection />
      </main>
    </div>
  )
}
