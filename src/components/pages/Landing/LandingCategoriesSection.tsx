import { BookOpen, BriefcaseBusiness, Landmark, ScrollText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { resourceCategories } from '@/data/resources/resources-data'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const iconBySlug = {
  educational: BookOpen,
  literature: ScrollText,
  history: Landmark,
  'business-career': BriefcaseBusiness,
} as const

export function LandingCategoriesSection() {
  return (
    <section id="explore" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {resourceCategories.map((category) => {
        const Icon = iconBySlug[category.slug]
        return (
          <Link key={category.slug} to={`/resources/${category.slug}#top`} className="block">
            <Card className="group h-full border-border/70 bg-card/95 transition-all hover:-translate-y-1 hover:shadow-md">
              <CardHeader>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.shortDescription}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </section>
  )
}
