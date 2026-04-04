import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { resourceCategories } from '@/data/resources/resources-data'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

type LandingFeaturedResourcesSectionProps = {
  documentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]>
  isLoading: boolean
}

export function LandingFeaturedResourcesSection({
  documentsByCategory,
  isLoading,
}: LandingFeaturedResourcesSectionProps) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        setIsAuthenticated(Boolean(data.session))
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const featuredResources = useMemo(() => {
    const categoryFirstPicks = resourceCategories
      .map((category) => {
        const document = documentsByCategory[category.slug][0]
        if (!document) return null
        return {
          id: `${category.slug}-${document.id}`,
          title: document.title,
          author: document.author,
          downloadUrl: document.downloadUrl,
          categoryName: category.name,
          categorySlug: category.slug,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))

    const additionalPicks = resourceCategories
      .flatMap((category) =>
        documentsByCategory[category.slug].map((document) => ({
          id: `${category.slug}-${document.id}`,
          title: document.title,
          author: document.author,
          downloadUrl: document.downloadUrl,
          categoryName: category.name,
          categorySlug: category.slug,
        })),
      )
      .filter((item) => !categoryFirstPicks.some((picked) => picked.id === item.id))

    return [...categoryFirstPicks, ...additionalPicks].slice(0, 6)
  }, [documentsByCategory])

  const visibleResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return featuredResources
    return featuredResources.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.author.toLowerCase().includes(query) ||
        resource.categoryName.toLowerCase().includes(query),
    )
  }, [featuredResources, searchQuery])

  const handleDownloadClick = async (downloadUrl?: string) => {
    const { data } = await supabase.auth.getSession()
    const authenticated = Boolean(data.session)

    if (!authenticated) {
      navigate('/login#top')
      return
    }

    if (!downloadUrl) return

    const anchor = window.document.createElement('a')
    anchor.href = downloadUrl
    anchor.target = '_blank'
    anchor.rel = 'noreferrer'
    window.document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  return (
    <section
      id="resources"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-secondary/35" />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Featured Resources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover high-demand materials uploaded by students.
          </p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search featured resources..."
          />
          <Button variant="secondary" size="sm" type="button">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground">
          Loading featured resources...
        </div>
      ) : null}

      {!isLoading && visibleResources.length === 0 ? (
        <div className="rounded-xl border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground">
          No featured files for now.
        </div>
      ) : null}

      <div className="grid gap-3">
        {visibleResources.map((resource) => (
          <Card key={resource.id} className="border-border bg-background/85">
            <CardContent className="flex flex-col gap-3 p-4 sm:min-h-[102px] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">Added by {resource.author}</p>
                  <Link
                    to={`/resources/${resource.categorySlug}#top`}
                    className="inline-flex text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {resource.categoryName}
                  </Link>
                </div>
              </div>
              <Button type="button" onClick={() => void handleDownloadClick(resource.downloadUrl)}>
                <Download className="mr-2 h-4 w-4" />
                {isAuthenticated ? 'Download File' : 'Login to Download'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
