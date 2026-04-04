import { Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function LandingUploadCtaSection() {
  return (
    <section
      id="upload"
      className="rounded-2xl border border-primary/30 bg-primary px-6 py-8 text-primary-foreground sm:px-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Share your materials with other students</h2>
          <p className="mt-2 max-w-2xl text-sm text-primary-foreground/90 sm:text-base">
            Upload class notes, project guides, and textbook summaries to support collaborative learning.
          </p>
        </div>
        <Link to="/upload">
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Upload PDF
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
