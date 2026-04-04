import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ResourceCategory } from '@/types/resources'

type CategoryOverviewCardProps = {
  category: ResourceCategory
}

export function CategoryOverviewCard({ category }: CategoryOverviewCardProps) {
  return (
    <Card className="bg-card border-border/70 h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{category.name}</CardTitle>
        <CardDescription>{category.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{category.intro}</p>
        <Link to={`/resources/${category.slug}#top`} className="inline-flex">
          <Button variant="secondary">
            View More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
