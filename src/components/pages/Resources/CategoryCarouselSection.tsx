import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import type { ResourceCategory } from '@/types/resources'
import { CategoryOverviewCard } from '@/components/pages/Resources/CategoryOverviewCard'

type CategoryCarouselSectionProps = {
  categories: ResourceCategory[]
}

export function CategoryCarouselSection({ categories }: CategoryCarouselSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-semibold text-foreground text-xl sm:text-2xl tracking-tight">Categories</h2>
      <Carousel opts={{ align: 'start', loop: false }} className="w-full">
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem key={category.slug} className="md:basis-1/2 lg:basis-1/3">
              <CategoryOverviewCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="top-[45%] -left-5 sm:-left-6 z-20 bg-background/95 disabled:opacity-45 shadow-md disabled:cursor-not-allowed disabled:pointer-events-auto" />
        <CarouselNext className="top-[45%] -right-5 sm:-right-6 z-20 bg-background/95 disabled:opacity-45 shadow-md disabled:cursor-not-allowed disabled:pointer-events-auto" />
      </Carousel>
    </section>
  )
}
