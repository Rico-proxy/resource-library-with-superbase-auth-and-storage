import { useState, type FormEvent } from 'react'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { requestPasswordReset } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const loginImage = '/assets/images/login.jpg'
const glassCardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasRequestedReset, setHasRequestedReset] = useState(false)

  const handleForgotPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address.')
      return
    }

    setIsSubmitting(true)
    const { error } = await requestPasswordReset(email.trim())
    setIsSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    setHasRequestedReset(true)
    toast.success('Password reset link sent. Check your email.')
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <img
        src={loginImage}
        alt="Landscape background for password reset"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/55 to-foreground/35" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
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
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">Forgot password?</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80 sm:text-base">
                Enter your email and we will send a reset link to your inbox.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reset-email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="mail@school.edu"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
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
                {isSubmitting ? 'Sending link...' : 'Send reset link'}
              </Button>

              {hasRequestedReset ? (
                <p className="text-center text-xs text-primary-foreground/80">
                  Check your inbox and follow the reset link to set a new password.
                </p>
              ) : null}

              <p className="text-center text-sm text-primary-foreground/80">
                Need an account?{' '}
                <Link to="/signup" className="font-medium text-primary-foreground hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
