import { Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ResourceDocument } from '@/types/resources'

type ResourceDocumentCardProps = {
  document: ResourceDocument
}

export function ResourceDocumentCard({ document: resourceDoc }: ResourceDocumentCardProps) {
  const navigate = useNavigate()
  const isPdf = resourceDoc.format.toUpperCase() === 'PDF'
  const previewUrl =
    isPdf && resourceDoc.downloadUrl
      ? `${resourceDoc.downloadUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`
      : null

  const openDocument = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      toast.error(error.message)
      return
    }

    if (!data.session) {
      navigate('/login#top')
      return
    }

    const pathOrId = resourceDoc.storagePath ?? resourceDoc.id
    navigate(`/resources/preview?doc=${encodeURIComponent(pathOrId)}#top`)
  }

  const handleCardKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      await openDocument()
    }
  }

  const handleDownloadClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    if (resourceDoc.downloadUrl) {
      const anchor = window.document.createElement('a')
      anchor.href = resourceDoc.downloadUrl
      anchor.target = '_blank'
      anchor.rel = 'noreferrer'
      anchor.download = `${resourceDoc.title}.${resourceDoc.format.toLowerCase()}`
      window.document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      return
    }

    await openDocument()
  }

  return (
    <Card
      className="bg-card shadow-sm hover:shadow-md border-border/70 h-full transition-shadow cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => {
        void openDocument()
      }}
      onKeyDown={handleCardKeyDown}
    >
      <CardContent className="space-y-4 p-4">
        <div className="relative bg-muted border border-border rounded-lg overflow-hidden">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title={`${resourceDoc.title} preview`}
              className="aspect-[3/4] w-full pointer-events-none"
              loading="lazy"
            />
          ) : (
            <div className={`aspect-[3/4] bg-gradient-to-br ${resourceDoc.coverTone}`} />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_15%,rgba(255,255,255,0.28),transparent_45%)]" />
          <span className="top-2 left-2 absolute bg-black/80 px-2 py-1 rounded font-semibold text-[10px] text-white tracking-wide">
            {resourceDoc.format}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="min-h-[3.4rem] font-semibold text-foreground text-lg leading-tight">{resourceDoc.title}</h3>
          <p className="text-muted-foreground text-sm">Added by {resourceDoc.author}</p>
        </div>

        <div className="pt-3 border-border/70 border-t">
          <Button
            type="button"
            size="default"
            variant="secondary"
            aria-label={`Download ${resourceDoc.title}`}
            onClick={handleDownloadClick}
            className="w-full h-10"
          >
            <Download className="mr-2 w-4 h-4" />
            Download File
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
