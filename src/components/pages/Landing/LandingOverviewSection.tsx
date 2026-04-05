import { Download, LogIn, Search, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ResourceCategorySlug, ResourceDocument } from '@/types/resources'

type LandingOverviewSectionProps = {
  documentsByCategory: Record<ResourceCategorySlug, ResourceDocument[]>
  isLoading: boolean
}

export function LandingOverviewSection({ documentsByCategory, isLoading }: LandingOverviewSectionProps) {
  const allDocuments = Object.values(documentsByCategory).flat()
  const totalFiles = allDocuments.length
  const contributors = new Set(allDocuments.map((document) => document.author)).size
  const activeCategories = Object.values(documentsByCategory).filter((documents) => documents.length > 0).length

  const quickStats = [
    { label: 'Total Files', value: isLoading ? '...' : String(totalFiles) },
    { label: 'Contributors', value: isLoading ? '...' : String(contributors) },
    { label: 'Active Categories', value: isLoading ? '...' : String(activeCategories) },
  ]

  return (
    <section className="gap-4 grid lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="bg-card/95 border-border/70">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Start by browsing documents, then sign in to download and upload resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3 grid sm:grid-cols-2">
          <article className="bg-background p-4 border border-border rounded-xl">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">1. Browse Documents</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Open the Resources page and check books, notes, and past questions by category.
            </p>
          </article>
          <article className="bg-background p-4 border border-border rounded-xl">
            <LogIn className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">2. Create Account / Login</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              When you find a file you need, sign up or log in to unlock downloads and preview access.
            </p>
          </article>
          <article className="bg-background p-4 border border-border rounded-xl">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">3. Download and Study</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Download files you need for classes, assignments, and exam preparation.
            </p>
          </article>
          <article className="bg-background p-4 border border-border rounded-xl">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">4. Upload to Help Others</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Share your own PDFs and notes so other students can learn from your materials.
            </p>
          </article>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-card via-card to-secondary/30 border-primary/25">
        <CardHeader>
          <CardTitle className="text-lg">Library Highlights</CardTitle>
          <CardDescription>Student activity overview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-background/90 shadow-sm p-4 border border-border rounded-xl">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">{stat.label}</p>
              <p className="mt-1 font-semibold text-foreground text-2xl">{stat.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
