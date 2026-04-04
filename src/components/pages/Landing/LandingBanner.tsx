import { ArrowRight, BookOpen, Sparkles, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const bannerImage = '/assets/images/bannerimage.jpg'

export function LandingBanner() {
  return (
    <section className="relative w-full overflow-hidden border-y border-border/60 shadow-lg">
      <img
        src={bannerImage}
        alt="Students studying together"
        className="h-[440px] w-full object-cover object-center sm:h-[500px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/35" />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-primary-foreground">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" />
              Student Resource Hub
            </span>

            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Everything students need to learn better in one library.
            </h1>

            <p className="mt-3 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
              Discover textbooks, lecture notes, and past questions. Upload useful PDFs and help your
              classmates succeed.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1">
                <BookOpen className="h-3.5 w-3.5" />
                Course Materials
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1">
                <Upload className="h-3.5 w-3.5" />
                PDF Uploads
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/resources">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Browse Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  size="lg"
                  className="border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20"
                >
                  Upload a PDF
                  <Upload className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
