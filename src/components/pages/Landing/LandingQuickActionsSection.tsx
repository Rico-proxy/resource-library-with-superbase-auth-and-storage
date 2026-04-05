import { ArrowRight, BookOpenText, LogIn, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const quickActions = [
  {
    title: 'Browse Resources',
    description: 'Explore all uploaded documents by category and topic.',
    href: '/resources#top',
    buttonLabel: 'Open Resources',
    icon: BookOpenText,
  },
  {
    title: 'Upload Notes',
    description: 'Share useful class notes and PDFs for other students.',
    href: '/upload#top',
    buttonLabel: 'Go to Upload',
    icon: Upload,
  },
  {
    title: 'Login',
    description: 'Sign in to preview documents and unlock downloads.',
    href: '/login#top',
    buttonLabel: 'Sign In',
    icon: LogIn,
  },
]

export function LandingQuickActionsSection() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Jump straight to the page you need.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="border-border/70 bg-card/95">
            <CardHeader className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <action.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={action.href} className="inline-flex w-full">
                <Button className="w-full justify-between">
                  {action.buttonLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
