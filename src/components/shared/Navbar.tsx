import { useEffect, useRef, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import {
  FiBookOpen,
  FiChevronDown,
  FiGrid,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiUploadCloud,
  FiUser,
} from 'react-icons/fi'
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

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-medium transition-colors',
      isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
    )

  return (
    <>
      <header
        data-read-aloud="site-header"
        className="top-0 z-20 sticky bg-background/80 backdrop-blur-xl border-border/60 border-b"
      >
        <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full max-w-6xl">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex justify-center items-center bg-primary shadow-sm rounded-xl w-9 h-9 text-primary-foreground">
              <FiBookOpen className="w-4 h-4" />
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
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="gap-2 border-primary/25 bg-background/85 hover:bg-accent/70"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-28 truncate">Hi, {userName}</span>
                  <FiChevronDown
                    className={cn(
                      'hidden sm:inline w-4 h-4 transition-transform',
                      isUserMenuOpen ? 'rotate-180' : '',
                    )}
                  />
                </Button>

                {isUserMenuOpen ? (
                  <div className="top-full right-0 z-30 absolute bg-popover shadow-md mt-2 border border-border rounded-lg w-40 overflow-hidden">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 hover:bg-accent px-3 py-2 w-full text-left text-popover-foreground text-sm transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
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
      </header>

      <nav
        data-read-aloud="site-nav"
        className="md:hidden right-0 bottom-0 left-0 z-30 fixed bg-background/90 backdrop-blur-xl border-border/70 border-t"
      >
        <div className="gap-1 grid grid-cols-4 mx-auto px-3 py-2 w-full max-w-lg">
          <NavLink to="/" end className={mobileNavLinkClass}>
            <FiHome className="w-4 h-4" />
            Home
          </NavLink>
          <NavLink to="/resources" className={mobileNavLinkClass}>
            <FiGrid className="w-4 h-4" />
            Resources
          </NavLink>
          <NavLink to="/upload" className={mobileNavLinkClass}>
            <FiUploadCloud className="w-4 h-4" />
            Upload
          </NavLink>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex flex-col justify-center items-center gap-1 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={mobileNavLinkClass}>
              <FiLogIn className="w-4 h-4" />
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </>
  )
}
