import { Download, Search, Upload } from 'lucide-react'
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
          <CardDescription>Simple actions for students to share and access study materials.</CardDescription>
        </CardHeader>
        <CardContent className="gap-3 grid sm:grid-cols-3">
          <article className="bg-background p-4 border border-border rounded-xl">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">Upload</h3>
            <p className="mt-1 text-muted-foreground text-sm">Add textbooks, notes, and revision guides.</p>
          </article>
          <article className="bg-background p-4 border border-border rounded-xl">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">Search</h3>
            <p className="mt-1 text-muted-foreground text-sm">Find resources by course code or title.</p>
          </article>
          <article className="bg-background p-4 border border-border rounded-xl">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="mt-3 font-medium">Download</h3>
            <p className="mt-1 text-muted-foreground text-sm">Get PDFs instantly for class and exam prep.</p>
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
