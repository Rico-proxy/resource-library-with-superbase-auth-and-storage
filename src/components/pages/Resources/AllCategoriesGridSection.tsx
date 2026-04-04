import { CategoryOverviewCard } from '@/components/pages/Resources/CategoryOverviewCard'
import type { ResourceCategory } from '@/types/resources'

type AllCategoriesGridSectionProps = {
  categories: ResourceCategory[]
}

export function AllCategoriesGridSection({ categories }: AllCategoriesGridSectionProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground">All Categories</h2>
        <p className="text-muted-foreground">Browse all document categories available in the library.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryOverviewCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  )
}
