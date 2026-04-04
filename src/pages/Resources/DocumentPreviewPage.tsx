import { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { resourceCategories } from '@/data/resources/resources-data'
import { listCommunityDocumentsByCategory } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

const emptyDocumentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]> = {
  educational: [],
  literature: [],
  history: [],
  'business-career': [],
}

export function DocumentPreviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documentsByCategory, setDocumentsByCategory] =
    useState<Record<ResourceCategorySlug, ResourceDocument[]>>(emptyDocumentsByCategory)

  const docPath = searchParams.get('doc') ? decodeURIComponent(searchParams.get('doc') as string) : ''

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        if (isMounted) {
          toast.error(error.message)
          setIsAuthenticated(false)
        }
        return
      }

      if (!data.session) {
        if (isMounted) {
          setIsAuthenticated(false)
        }
        return
      }

      if (isMounted) {
        setIsAuthenticated(true)
      }

      try {
        const grouped = await listCommunityDocumentsByCategory()
        if (isMounted) {
          setDocumentsByCategory(grouped)
        }
      } catch (storageError) {
        if (isMounted) {
          toast.error(storageError instanceof Error ? storageError.message : 'Unable to load document preview.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const allDocuments = useMemo(() => Object.values(documentsByCategory).flat(), [documentsByCategory])

  const activeDocument = useMemo(() => {
    if (!docPath) return null
    return allDocuments.find((document) => (document.storagePath ?? document.id) === docPath) ?? null
  }, [allDocuments, docPath])

  const activeCategory = useMemo(() => {
    if (!activeDocument) return null
    return (
      resourceCategories.find((category) =>
        (documentsByCategory[category.slug] ?? []).some(
          (document) => (document.storagePath ?? document.id) === (activeDocument.storagePath ?? activeDocument.id),
        ),
      ) ?? null
    )
  }, [activeDocument, documentsByCategory])

  const relatedDocuments = useMemo(() => {
    const source = activeCategory ? documentsByCategory[activeCategory.slug] ?? [] : allDocuments
    return source
      .filter((document) => (document.storagePath ?? document.id) !== (activeDocument?.storagePath ?? activeDocument?.id))
      .slice(0, 8)
  }, [documentsByCategory, activeCategory, activeDocument, allDocuments])

  if (isAuthenticated === false) {
    return <Navigate to="/login#top" replace />
  }

  if (!docPath) {
    return <Navigate to="/resources#top" replace />
  }

  if (!isLoading && !activeDocument) {
    return <Navigate to="/resources#top" replace />
  }

  const previewUrl = activeDocument?.downloadUrl
    ? `${activeDocument.downloadUrl}#toolbar=1&navpanes=0&view=FitH`
    : null

  return (
    <div id="top" className="relative overflow-hidden">
      <div className="hero-spotlight pointer-events-none absolute inset-0 -z-10" />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1400px]">
        <div className="gap-4 grid lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          <Card className="bg-card/95 h-fit border-border/70">
            <CardContent className="space-y-4 p-4">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">
                {activeDocument?.format ?? 'PDF'} Document
              </p>
              <h1 className="font-semibold text-2xl leading-tight">{activeDocument?.title ?? 'Loading document...'}</h1>
              <p className="text-muted-foreground text-sm">
                Added by {activeDocument?.author ?? 'Resource Library'}
              </p>
              <p className="text-muted-foreground text-sm">
                Category: {activeCategory?.name ?? 'General'}
              </p>

              <div className="gap-2 grid">
                {activeDocument?.downloadUrl ? (
                  <a href={activeDocument.downloadUrl} target="_blank" rel="noreferrer">
                    <Button className="w-full">
                      <Download className="mr-2 w-4 h-4" />
                      Download
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full">
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/95 border-border/70 overflow-hidden">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 p-3 border-border/70 border-b">
              <div className="flex items-center gap-2">
                {activeDocument?.downloadUrl ? (
                  <a href={activeDocument.downloadUrl} target="_blank" rel="noreferrer">
                    <Button size="sm">
                      <Download className="mr-2 w-4 h-4" />
                      Download
                    </Button>
                  </a>
                ) : (
                  <Button size="sm" disabled>
                    <Download className="mr-2 w-4 h-4" />
                    Download
                  </Button>
                )}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>

            <div className="bg-muted/35 h-[75vh]">
              {previewUrl ? (
                <iframe src={previewUrl} title={activeDocument?.title ?? 'Document preview'} className="w-full h-full" />
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground text-sm">
                  Preview not available for this file.
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-card/95 h-fit border-border/70">
            <CardContent className="p-4">
              <h2 className="font-semibold text-base">You might also like</h2>
              <div className="space-y-3 mt-3">
                {relatedDocuments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No related files yet.</p>
                ) : (
                  relatedDocuments.map((document) => (
                    <Link
                      key={document.id}
                      to={`/resources/preview?doc=${encodeURIComponent(document.storagePath ?? document.id)}#top`}
                      className="flex items-start gap-3 hover:bg-muted/40 p-2 rounded-lg transition-colors"
                    >
                      <div className="bg-muted mt-0.5 rounded-md w-10 h-12 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{document.title}</p>
                        <p className="text-muted-foreground text-xs">{document.author}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
