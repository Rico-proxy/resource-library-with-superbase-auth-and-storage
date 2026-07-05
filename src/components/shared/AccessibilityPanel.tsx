import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Accessibility, Contrast, Type, Volume2, VolumeX } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { useAccessibility } from '@/components/shared/AccessibilityProvider'

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const {
    fontMode,
    contrastMode,
    isSpeaking,
    speechSupported,
    availableVoices,
    selectedVoiceURI,
    setFontMode,
    setContrastMode,
    setSelectedVoiceURI,
    speakPageContent,
    stopSpeaking,
  } = useAccessibility()

  const getReadingTargets = () => {
    if (
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/reset-password'
    ) {
      return ['[data-read-aloud="auth-page"]', 'form']
    }

    return [
      '[data-read-aloud="page"]',
      'main',
      'footer[data-read-aloud="site-footer"]',
    ]
  }

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6">
      {isOpen ? (
        <Card className="w-[min(92vw,360px)] border-border/80 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Accessibility className="h-4 w-4" />
              Reading Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4" />
                Dyslexia-friendly font
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={fontMode === 'default' ? 'default' : 'outline'}
                  onClick={() => setFontMode('default')}
                >
                  Default
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={fontMode === 'dyslexia' ? 'default' : 'outline'}
                  onClick={() => setFontMode('dyslexia')}
                >
                  Reading font
                </Button>
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Contrast className="h-4 w-4" />
                Color contrast presets
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={contrastMode === 'default' ? 'default' : 'outline'}
                  onClick={() => setContrastMode('default')}
                >
                  Default
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={contrastMode === 'high' ? 'default' : 'outline'}
                  onClick={() => setContrastMode('high')}
                >
                  High contrast
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={contrastMode === 'warm' ? 'default' : 'outline'}
                  onClick={() => setContrastMode('warm')}
                >
                  Warm focus
                </Button>
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="h-4 w-4" />
                Text-to-speech
              </div>
              {speechSupported && availableVoices.length > 0 ? (
                <Select value={selectedVoiceURI} onValueChange={setSelectedVoiceURI}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a reading voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} {voice.lang ? `(${voice.lang})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => speakPageContent(getReadingTargets())}
                  disabled={!speechSupported}
                >
                  {isSpeaking ? 'Reading…' : 'Read this page'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={stopSpeaking} disabled={!speechSupported}>
                  Stop reading
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {speechSupported
                  ? 'Read-aloud speaks visible page text. Embedded PDF contents may still require the browser’s own PDF tools or a downloadable reader.'
                  : 'This browser does not expose speech synthesis support, so read-aloud is unavailable here.'}
              </p>
            </section>
          </CardContent>
        </Card>
      ) : null}

      <Button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          'h-12 w-12 rounded-full px-0 shadow-lg',
          isOpen ? 'bg-secondary text-secondary-foreground' : '',
        )}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close reading accessibility controls' : 'Open reading accessibility controls'}
      >
        {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Accessibility className="h-5 w-5" />}
      </Button>
    </div>
  )
}
