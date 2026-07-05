import { useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, KeyRound, LockKeyhole } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { updatePassword } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const loginImage = '/assets/images/login.jpg'
const glassCardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }

function hasRecoveryParams() {
  if (typeof window === 'undefined') {
    return false
  }

  const searchParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.replace('#', ''))

  return (
    searchParams.has('code') ||
    searchParams.get('type') === 'recovery' ||
    hashParams.has('access_token') ||
    hashParams.get('type') === 'recovery'
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const recoveryLinkDetected = useMemo(() => hasRecoveryParams(), [])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResetPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    const { error } = await updatePassword(password)
    setIsSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Password updated successfully. Please sign in.')
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <img
        src={loginImage}
        alt="Landscape background for password reset"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/55 to-foreground/35" />

      <main
        data-read-aloud="auth-page"
        className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8"
      >
        <Card
          className="w-full max-w-md text-primary-foreground shadow-2xl backdrop-blur-md"
          style={glassCardStyle}
        >
          <CardHeader className="space-y-5 p-6 sm:p-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>

            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">Set a new password</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80 sm:text-base">
                Enter your new password to finish resetting your account.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
              {!recoveryLinkDetected ? (
                <p className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs text-primary-foreground/85">
                  Open this page from your reset email link to complete password reset.
                </p>
              ) : null}

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="new-password">
                  New password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 border-white/40 bg-white/92 pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirm-new-password">
                  Confirm password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-new-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 border-white/40 bg-white/92 pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Updating password...' : 'Update password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
