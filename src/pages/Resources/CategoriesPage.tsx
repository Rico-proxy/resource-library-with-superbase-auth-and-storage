import { useEffect, useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DocumentCarouselSection } from '@/components/pages/Resources/DocumentCarouselSection'
import { getCategoryBySlug } from '@/data/resources/resources-data'
import { listCommunityDocumentsByCategory } from '@/lib/storage'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

const emptyStateText = 'No file under this category for now.'

const emptyDocumentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]> = {
  educational: [],
  literature: [],
  history: [],
  'business-career': [],
}

export function CategoriesPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const category = getCategoryBySlug(categorySlug ?? '')
  const categoryKey = (category?.slug ?? 'educational') as ResourceCategorySlug
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
          toast.error(error instanceof Error ? error.message : 'Unable to load files from storage.')
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

  const categoryDocuments = useMemo(() => documentsByCategory[categoryKey] ?? [], [documentsByCategory, categoryKey])

  const recommendedDocuments = useMemo(() => {
    const selected = categoryDocuments.filter((_, index) => index % 3 === 0).slice(0, 10)
    return selected.length > 0 ? selected : categoryDocuments.slice(0, 10)
  }, [categoryDocuments])

  const aboutCategoryDocuments = useMemo(() => {
    const selected = categoryDocuments.filter((_, index) => index % 3 === 1).slice(0, 10)
    return selected.length > 0 ? selected : categoryDocuments.slice(0, 10)
  }, [categoryDocuments])

  const recentlyAddedDocuments = useMemo(() => {
    const selected = categoryDocuments.filter((_, index) => index % 3 === 2).slice(0, 10)
    return selected.length > 0 ? selected : categoryDocuments.slice(0, 10)
  }, [categoryDocuments])

  if (!category) {
    return <Navigate to="/resources" replace />
  }

  return (
    <div id="top" className="relative overflow-hidden">
      <div className="hero-spotlight pointer-events-none absolute inset-0 -z-10" />

      <main className="flex flex-col gap-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full max-w-7xl">
        <section className="space-y-5">
          <p className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <Link to="/resources#top" className="hover:text-foreground transition-colors">
              Documents
            </Link>{' '}
            <ChevronRight className="w-4 h-4" /> {category.name}
          </p>

          <div className="space-y-3">
            <h1 className="font-semibold text-foreground text-3xl text-balance tracking-tight">
              {category.headline}
            </h1>
            <p className="max-w-4xl text-muted-foreground text-lg sm:text-xl">{category.intro}</p>
            {isLoadingDocuments ? <p className="text-muted-foreground text-sm">Loading files...</p> : null}
          </div>
        </section>

        <DocumentCarouselSection
          title="Documents recommended for you"
          documents={recommendedDocuments}
          titleClassName="text-xl sm:text-2xl"
          emptyMessage={emptyStateText}
        />
        <DocumentCarouselSection
          title={`Documents About ${category.name}`}
          documents={aboutCategoryDocuments}
          titleClassName="text-xl sm:text-2xl"
          emptyMessage={emptyStateText}
        />
        <DocumentCarouselSection
          title="Recently Added"
          documents={recentlyAddedDocuments}
          titleClassName="text-xl sm:text-2xl"
          emptyMessage={emptyStateText}
        />

        <section className="space-y-4">
          <h2 className="font-semibold text-foreground text-4xl tracking-tight">About {category.name}</h2>
          <p className="max-w-5xl text-muted-foreground text-lg leading-relaxed">{category.about}</p>
        </section>
      </main>
    </div>
  )
}
