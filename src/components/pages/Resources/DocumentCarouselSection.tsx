import { Link } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { ResourceDocument } from '@/types/resources'
import { ResourceDocumentCard } from '@/components/pages/Resources/ResourceDocumentCard'
import { cn } from '@/lib/cn'

type DocumentCarouselSectionProps = {
  title: string
  documents: ResourceDocument[]
  viewMoreHref?: string
  titleClassName?: string
  emptyMessage?: string
}

export function DocumentCarouselSection({
  title,
  documents,
  viewMoreHref,
  titleClassName,
  emptyMessage,
}: DocumentCarouselSectionProps) {
  const viewMoreTo =
    viewMoreHref && viewMoreHref.includes('#') ? viewMoreHref : viewMoreHref ? `${viewMoreHref}#top` : undefined

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <h2
          className={cn(
            'font-semibold text-foreground text-2xl sm:text-3xl text-balance tracking-tight',
            titleClassName,
          )}
        >
          {title}
        </h2>
        {viewMoreTo ? (
          <Link
            to={viewMoreTo}
            className="font-semibold text-foreground/90 hover:text-primary text-base transition-colors"
          >
            View More
          </Link>
        ) : null}
      </div>

      {documents.length === 0 ? (
        <div className="bg-card/70 p-6 border border-border/70 rounded-xl text-muted-foreground text-sm sm:text-base">
          {emptyMessage ?? 'No files under this category for now.'}
        </div>
      ) : (
        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent>
            {documents.map((document) => (
              <CarouselItem key={document.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                <ResourceDocumentCard document={document} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="top-[35%] -left-5 sm:-left-6 z-20 bg-background/95 disabled:opacity-45 shadow-md disabled:cursor-not-allowed disabled:pointer-events-auto" />
          <CarouselNext className="top-[35%] -right-5 sm:-right-6 z-20 bg-background/95 disabled:opacity-45 shadow-md disabled:cursor-not-allowed disabled:pointer-events-auto" />
        </Carousel>
      )}
    </section>
  )
}
