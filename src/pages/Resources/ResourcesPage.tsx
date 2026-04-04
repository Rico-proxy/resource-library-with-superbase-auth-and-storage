import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { AllCategoriesGridSection } from '@/components/pages/Resources/AllCategoriesGridSection'
import { CategoryCarouselSection } from '@/components/pages/Resources/CategoryCarouselSection'
import { DocumentCarouselSection } from '@/components/pages/Resources/DocumentCarouselSection'
import { resourceCategories } from '@/data/resources/resources-data'
import { listCommunityDocumentsByCategory } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

type ResourceTab = 'overview' | 'categories'
type SortOption = 'recent' | 'title'
type FileTypeFilter = 'all' | 'PDF'
type CategoryFilter = 'all' | ResourceCategorySlug
const carouselTitleClassName = 'text-xl sm:text-2xl'
const emptyStateText = 'No file under this category for now.'

const emptyDocumentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]> = {
  educational: [],
  literature: [],
  history: [],
  'business-career': [],
}

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceTab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [fileType, setFileType] = useState<FileTypeFilter>('all')
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

  const applyDocumentFilters = (documents: ResourceDocument[]): ResourceDocument[] => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = documents.filter((document) => {
      const byQuery =
        query.length === 0 ||
        document.title.toLowerCase().includes(query) ||
        document.author.toLowerCase().includes(query)
      const byType = fileType === 'all' || document.format.toUpperCase() === fileType
      return byQuery && byType
    })

    const sorted = [...filtered]
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      sorted.sort((a, b) => {
        const aTime = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0
        const bTime = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0
        return bTime - aTime
      })
    }

    return sorted
  }

  const overviewSections = useMemo(
    () => {
      const categories =
        selectedCategory === 'all'
          ? resourceCategories
          : resourceCategories.filter((category) => category.slug === selectedCategory)

      return categories.map((category) => ({
        title: `Trending in ${category.name}`,
        viewMoreHref: `/resources/${category.slug}`,
        documents: applyDocumentFilters(documentsByCategory[category.slug] ?? []),
      }))
    },
    [selectedCategory, searchQuery, sortBy, fileType, documentsByCategory],
  )

  const recommendedDocuments = useMemo(() => {
    const base = selectedCategory === 'all'
      ? resourceCategories.flatMap((category) => documentsByCategory[category.slug] ?? [])
      : documentsByCategory[selectedCategory] ?? []
    return applyDocumentFilters(base)
  }, [selectedCategory, searchQuery, sortBy, fileType, documentsByCategory])

  const filteredCategories = useMemo(() => {
    const byCategory =
      selectedCategory === 'all'
        ? resourceCategories
        : resourceCategories.filter((category) => category.slug === selectedCategory)

    const query = searchQuery.trim().toLowerCase()
    if (!query) return byCategory

    return byCategory.filter((category) => {
      return (
        category.name.toLowerCase().includes(query) ||
        category.shortDescription.toLowerCase().includes(query) ||
        category.intro.toLowerCase().includes(query)
      )
    })
  }, [selectedCategory, searchQuery])

  return (
    <div id="top" className="relative overflow-hidden">
      <div className="hero-spotlight pointer-events-none absolute inset-0 -z-10" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground">Documents</h1>
            <p className="text-muted-foreground text-lg">Get started with the community&apos;s uploads.</p>
            {isLoadingDocuments ? <p className="text-muted-foreground text-sm">Loading files...</p> : null}
          </div>

          <div className="border-border/70 border-b">
            <div className="flex items-center gap-6 pb-2">
              {(['overview', 'categories'] as const).map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'h-auto rounded-none px-0 pb-2 text-lg font-medium capitalize transition-colors',
                    activeTab === tab
                      ? 'border-foreground border-b-2 text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          <section className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr]">
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title or author..."
              />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort documents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Sort: Most Recent</SelectItem>
                  <SelectItem value="title">Sort: Title A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Select value={fileType} onValueChange={(value) => setFileType(value as FileTypeFilter)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">File Type: All</SelectItem>
                  <SelectItem value="PDF">File Type: PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  'rounded-full transition-colors',
                  selectedCategory === 'all'
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/40',
                )}
              >
                All Categories
              </Button>
              {resourceCategories.map((category) => (
                <Button
                  key={category.slug}
                  type="button"
                  size="sm"
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    'rounded-full transition-colors',
                    selectedCategory === category.slug
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/40',
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </section>
        </section>

        {activeTab === 'overview' ? (
          <>
            <DocumentCarouselSection
              title="Documents recommended for you"
              documents={recommendedDocuments}
              titleClassName={carouselTitleClassName}
              emptyMessage={emptyStateText}
            />
            <CategoryCarouselSection categories={filteredCategories} />
            {overviewSections.map((section) => (
              <DocumentCarouselSection
                key={section.title}
                title={section.title}
                documents={section.documents}
                viewMoreHref={section.viewMoreHref}
                titleClassName={carouselTitleClassName}
                emptyMessage={emptyStateText}
              />
            ))}
          </>
        ) : (
          <AllCategoriesGridSection categories={filteredCategories} />
        )}
      </main>
    </div>
  )
}
