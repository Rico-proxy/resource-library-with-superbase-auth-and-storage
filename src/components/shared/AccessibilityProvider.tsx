import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import EasySpeech from 'easy-speech'
import { toast } from 'sonner'

type ReadingFontMode = 'default' | 'dyslexia'
type ContrastMode = 'default' | 'high' | 'warm'

type AccessibilitySettings = {
  fontMode: ReadingFontMode
  contrastMode: ContrastMode
}

type AccessibilityContextValue = AccessibilitySettings & {
  isSpeaking: boolean
  speechSupported: boolean
  availableVoices: SpeechSynthesisVoice[]
  selectedVoiceURI: string
  setFontMode: (mode: ReadingFontMode) => void
  setContrastMode: (mode: ContrastMode) => void
  setSelectedVoiceURI: (voiceURI: string) => void
  speakPageContent: (selector?: string | string[]) => void
  speakText: (text: string) => void
  stopSpeaking: () => void
}

const STORAGE_KEY = 'resource-library-accessibility'

const defaultSettings: AccessibilitySettings = {
  fontMode: 'default',
  contrastMode: 'default',
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

function safelyCancelSpeech() {
  try {
    EasySpeech.cancel()
  } catch {
    // Keep the rest of the app usable even if speech teardown fails.
  }
}

function applyDocumentSettings(settings: AccessibilitySettings) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.readingFont = settings.fontMode
  document.documentElement.dataset.contrast = settings.contrastMode
}

function isElementVisiblyReadable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return true

  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return false
  }

  return element.getClientRects().length > 0
}

function normalizeReadableText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase()
}

function getReadableTextFromSelectors(selector: string | string[]): string {
  if (typeof document === 'undefined') return ''

  const selectorList = Array.isArray(selector) ? selector : [selector]
  const collectedText: string[] = []
  const visited = new Set<Element>()
  const emittedText = new Set<string>()

  for (const entry of selectorList) {
    const targets = document.querySelectorAll(entry)
    for (const target of targets) {
      if (visited.has(target)) continue
      visited.add(target)

      if (!isElementVisiblyReadable(target)) continue

      const text = target.textContent?.replace(/\s+/g, ' ').trim()
      if (text) {
        const normalized = normalizeReadableText(text)
        if (!normalized || emittedText.has(normalized)) continue
        emittedText.add(normalized)
        collectedText.push(text)
      }
    }
  }

  return collectedText.join(' ').replace(/\s+/g, ' ').trim()
}

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isSpeechReady, setIsSpeechReady] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('')
  const manualStopRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        applyDocumentSettings(defaultSettings)
        return
      }

      const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>
      const nextSettings: AccessibilitySettings = {
        fontMode: parsed.fontMode === 'dyslexia' ? 'dyslexia' : 'default',
        contrastMode:
          parsed.contrastMode === 'high' || parsed.contrastMode === 'warm'
            ? parsed.contrastMode
            : 'default',
      }

      setSettings(nextSettings)
      applyDocumentSettings(nextSettings)
    } catch {
      applyDocumentSettings(defaultSettings)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    applyDocumentSettings(settings)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let supported = false
    try {
      const detected = EasySpeech.detect()
      supported = Boolean(detected.speechSynthesis && detected.speechSynthesisUtterance)
    } catch {
      supported = false
    }

    setSpeechSupported(supported)

    if (!supported) {
      setIsSpeechReady(false)
      setAvailableVoices([])
      return
    }

    let isMounted = true

    const initSpeech = async () => {
      try {
        await EasySpeech.init({ maxTimeout: 5000, interval: 250, quiet: true })
        if (!isMounted) return

        const voices = EasySpeech.voices()
        setAvailableVoices(voices)
        setSelectedVoiceURI((current) => current || voices.find((voice) => voice.default)?.voiceURI || voices[0]?.voiceURI || '')
        setIsSpeechReady(true)
      } catch {
        if (!isMounted) return
        setIsSpeechReady(false)
        setAvailableVoices([])
        setSelectedVoiceURI('')
      }
    }

    void initSpeech()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        safelyCancelSpeech()
      }
    }
  }, [])

  const stopSpeaking = () => {
    if (!speechSupported) return

    manualStopRef.current = true
    safelyCancelSpeech()
    setIsSpeaking(false)
  }

  const speakText = async (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText) {
      toast.error('There is no readable text on this screen yet.')
      return
    }

    if (!speechSupported) {
      toast.error('Read-aloud is not supported in this browser.')
      return
    }

    try {
      if (!isSpeechReady) {
        await EasySpeech.init({ maxTimeout: 5000, interval: 250, quiet: true })
        const voices = EasySpeech.voices()
        setAvailableVoices(voices)
        setSelectedVoiceURI((current) => current || voices.find((voice) => voice.default)?.voiceURI || voices[0]?.voiceURI || '')
        setIsSpeechReady(true)
      }

      const voice = availableVoices.find((entry) => entry.voiceURI === selectedVoiceURI)
      manualStopRef.current = false
      setIsSpeaking(true)
      await EasySpeech.speak({
        text: trimmedText,
        voice,
        rate: 0.6,
        pitch: 1,
        start: () => setIsSpeaking(true),
        end: () => {
          manualStopRef.current = false
          setIsSpeaking(false)
        },
        error: () => {
          setIsSpeaking(false)
        },
      })
    } catch {
      setIsSpeaking(false)
      if (manualStopRef.current) {
        manualStopRef.current = false
        return
      }
      toast.error('Unable to read this page aloud right now.')
    }
  }

  const speakPageContent = (selector: string | string[] = 'main') => {
    void speakText(getReadableTextFromSelectors(selector))
  }

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      fontMode: settings.fontMode,
      contrastMode: settings.contrastMode,
      isSpeaking,
      speechSupported,
      availableVoices,
      selectedVoiceURI,
      setFontMode: (mode) => setSettings((current) => ({ ...current, fontMode: mode })),
      setContrastMode: (mode) => setSettings((current) => ({ ...current, contrastMode: mode })),
      setSelectedVoiceURI,
      speakPageContent,
      speakText: (text) => {
        void speakText(text)
      },
      stopSpeaking,
    }),
    [settings, isSpeaking, speechSupported, availableVoices, selectedVoiceURI, isSpeechReady],
  )

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider.')
  }

  return context
}
