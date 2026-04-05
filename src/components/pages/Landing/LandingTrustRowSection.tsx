import { CheckCircle2, LayoutGrid, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const trustItems = [
  {
    title: 'Fast access',
    description: 'Find and open class materials in seconds from one shared student library.',
    icon: Zap,
  },
  {
    title: 'Verified uploads',
    description: 'Only supported document formats are accepted, with size checks for cleaner resources.',
    icon: CheckCircle2,
  },
  {
    title: 'Organized by category',
    description: 'Resources are grouped into clear categories so students can browse without confusion.',
    icon: LayoutGrid,
  },
]

export function LandingTrustRowSection() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Why students use this</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Built for speed, trust, and clear organization.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {trustItems.map((item) => (
          <Card key={item.title} className="border-border/70 bg-card/95">
            <CardContent className="space-y-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
