import { Code, Globe, Search, Upload } from 'lucide-react'

const benefits = [
  {
    title: 'Upload documents easily, for free',
    description: 'Share notes and guides in just a few clicks.',
    icon: Upload,
  },
  {
    title: 'Improve discoverability with smart search',
    description: 'Help students find content faster by topic and course code.',
    icon: Search,
  },
  {
    title: 'Share with students across departments',
    description: 'Reach learners in different faculties and levels.',
    icon: Globe,
  },
  {
    title: 'Embed resources in course websites',
    description: 'Link handouts and references directly in class portals.',
    icon: Code,
  },
]

export function UploadBenefitsSection() {
  return (
    <section className="relative bg-primary/10 mt-2 py-10 sm:py-12 border-primary/20 border-y w-full overflow-hidden text-foreground">
      <div className="-z-10 absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(23,84,67,0.10),transparent_34%),radial-gradient(circle_at_85%_70%,rgba(23,84,67,0.05),transparent_30%)]" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl">
        <div className="mb-5 sm:mb-6">
          <h2 className="font-semibold text-2xl tracking-tight">Why upload to our library?</h2>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">
            Designed for students who want to share quality resources and support their peers.
          </p>
        </div>

        <div className="gap-3 grid md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-background/95 shadow-sm border border-primary/15 rounded-xl text-foreground">
              <div className="flex flex-col items-center gap-4 p-5 h-full text-center">
                <div className="place-items-center grid bg-secondary shadow-sm rounded-lg w-11 h-11 text-primary">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-base leading-snug">{benefit.title}</p>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
