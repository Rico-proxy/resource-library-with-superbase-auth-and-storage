import { useState, type FormEvent } from 'react'
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const loginImage = '/assets/images/login.jpg'
const glassCardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }
const darkGlassCardStyle = { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: 'rgba(255, 255, 255, 0.2)' }

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password.')
      return
    }

    setIsSubmitting(true)
    const { error } = await signInWithEmail(email.trim(), password)
    setIsSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Signed in successfully.')
    navigate('/resources', { replace: true })
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true)
    const { error } = await signInWithGoogle()
    setIsGoogleSubmitting(false)

    if (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <img
        src={loginImage}
        alt="Landscape background for sign in"
        className="absolute inset-0 w-full h-full object-center object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/55 to-foreground/35" />

      <div className="z-10 relative flex items-center mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full max-w-7xl min-h-svh">
        <Card
          className="shadow-2xl backdrop-blur-md w-full max-w-md text-primary-foreground"
          style={glassCardStyle}
        >
          <CardHeader className="space-y-5 p-6 sm:p-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-foreground/85 hover:text-primary-foreground text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="space-y-2">
              <CardTitle className="text-3xl sm:text-4xl tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">
                Sign in to continue to your student resource library.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-6 sm:pb-8">
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="space-y-2">
                <label className="font-medium text-sm" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="mail@school.edu"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="bg-white/92 pl-10 border-white/40 h-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-sm" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="bg-white/92 pl-10 border-white/40 h-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-primary-foreground/85">
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary-foreground/85 hover:text-primary-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="bg-secondary hover:bg-secondary/90 w-full h-11 text-secondary-foreground"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 bg-white/25 h-px" />
                <span className="text-primary-foreground/70 text-xs">or continue with</span>
                <div className="flex-1 bg-white/25 h-px" />
              </div>

              <Button
                type="button"
                disabled={isSubmitting || isGoogleSubmitting}
                onClick={handleGoogleSignIn}
                variant="secondary"
                className="bg-white/90 hover:bg-white border border-white/30 w-full h-11 text-foreground"
              >
                <GoogleIcon className="mr-2 w-4 h-4" />
                {isGoogleSubmitting ? 'Redirecting...' : 'Continue with Google'}
              </Button>

              <p className="text-primary-foreground/80 text-sm text-center">
                New here?{' '}
                <Link to="/signup" className="font-medium text-primary-foreground hover:underline">
                  Create an account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="hidden lg:block flex-1 pl-8">
          <Card className="backdrop-blur-sm max-w-lg text-primary-foreground" style={darkGlassCardStyle}>
            <CardContent className="p-7">
              <p className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure Access
              </p>
              <h2 className="mt-4 font-semibold text-2xl leading-tight">
                Access curated books, lecture notes, and past questions from one account.
              </h2>
             
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
