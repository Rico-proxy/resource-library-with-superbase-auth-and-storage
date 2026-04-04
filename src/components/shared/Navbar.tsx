import { useEffect, useRef, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { BookOpen, ChevronDown, UserRound } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

function getDisplayName(user: User | null): string {
  if (!user) return ''

  const metadata = user.user_metadata as Record<string, unknown> | undefined
  const metadataName =
    (typeof metadata?.full_name === 'string' && metadata.full_name.trim()) ||
    (typeof metadata?.name === 'string' && metadata.name.trim()) ||
    (typeof metadata?.user_name === 'string' && metadata.user_name.trim()) ||
    ''

  if (metadataName) {
    return metadataName.split(' ')[0]
  }

  if (user.email) {
    return user.email.split('@')[0]
  }

  return 'Student'
}

export function Navbar() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('Student')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (isMounted) {
        const session = data.session
        setIsAuthenticated(Boolean(session))
        setUserName(getDisplayName(session?.user ?? null))
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
      setUserName(getDisplayName(session?.user ?? null))
      setIsUserMenuOpen(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }

    setIsUserMenuOpen(false)
    toast.success('Logged out successfully.')
    navigate('/', { replace: true })
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'border-b-2 border-transparent hover:text-foreground pb-1 transition-colors',
      isActive ? 'border-primary font-semibold text-foreground' : 'text-muted-foreground',
    )

  return (
    <header className="top-0 z-20 sticky bg-background/80 backdrop-blur-xl border-border/60 border-b">
      <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full max-w-6xl">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex justify-center items-center bg-primary shadow-sm rounded-xl w-9 h-9 text-primary-foreground">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm lg:text-base leading-none">Resource Library</p>
            <p className="text-muted-foreground text-xs">For Students</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm lg:text-base">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/resources" className={navLinkClass}>
            Resources
          </NavLink>
          <NavLink to="/upload" className={navLinkClass}>
            Upload
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/upload" className="md:hidden inline-flex">
            <Button size="sm">Upload</Button>
          </NavLink>
          {isAuthenticated ? (
            <div ref={userMenuRef} className="hidden sm:block relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className="gap-2 border-primary/25 bg-background/85 hover:bg-accent/70"
              >
                <UserRound className="w-4 h-4" />
                <span className="max-w-28 truncate">Hi, {userName}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', isUserMenuOpen ? 'rotate-180' : '')} />
              </Button>

              {isUserMenuOpen ? (
                <div className="top-full right-0 z-30 absolute bg-popover shadow-md mt-2 border border-border rounded-lg w-36 overflow-hidden">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hover:bg-accent px-3 py-2 w-full text-left text-popover-foreground text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink to="/login" className="hidden sm:inline-flex">
              <Button>Login</Button>
            </NavLink>
          )}
        </div>
      </div>
      <div className="md:hidden border-border/60 border-t">
        <div className="flex items-center gap-6 mx-auto px-4 sm:px-6 lg:px-8 py-2 w-full max-w-6xl text-sm">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/resources" className={navLinkClass}>
            Resources
          </NavLink>
          <NavLink to="/upload" className={navLinkClass}>
            Upload
          </NavLink>
        </div>
      </div>
    </header>
  )
}
