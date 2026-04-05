import { ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const faqs = [
  {
    question: 'Do I need an account before I can use the website?',
    answer:
      'You can browse resources without an account. To preview documents, download files, or upload your own notes, you need to sign in.',
  },
  {
    question: 'Can I upload any file size?',
    answer:
      'In-app uploads above 10MB are blocked and users are asked to compress first. Keep uploads smaller for better performance.',
  },
  {
    question: 'How are documents organized?',
    answer:
      'All files are tagged by category during upload. This keeps browsing clean across Educational, Literature, History, and Business & Career.',
  },
  {
    question: 'Who can see files I upload?',
    answer:
      'Uploaded files are listed in the shared resource library so other students can discover and download them.',
  },
]

export function LandingFaqSection() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Quick answers to common questions.
        </p>
      </div>

      <Card className="border-border/70 bg-card/95">
        <CardHeader>
          <CardTitle className="text-lg">FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-border bg-background px-4 py-3 open:bg-background/95"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
