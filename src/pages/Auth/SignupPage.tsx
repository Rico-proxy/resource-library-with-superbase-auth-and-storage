import { useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import { signInWithGoogle, signUpWithEmail } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const loginImage = '/assets/images/login.jpg'
const glassCardStyle = { backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' }

export function SignupPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please complete all fields.')
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

    if (!acceptedTerms) {
      toast.error('Please accept the terms to continue.')
      return
    }

    setIsSubmitting(true)
    const { data, error } = await signUpWithEmail(fullName.trim(), email.trim(), password)
    setIsSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }

    if (data.session) {
      toast.success('Account created successfully.')
      navigate('/resources', { replace: true })
      return
    }

    toast.success('Account created. Check your email to confirm your account.')
    navigate('/login', { replace: true })
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
        alt="Landscape background for sign up"
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
              to="/"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <div className="space-y-2">
              <CardTitle className="text-3xl tracking-tight sm:text-4xl">Create account</CardTitle>
              <CardDescription className="text-sm text-primary-foreground/80 sm:text-base">
                Join the student resource library and start sharing valuable materials.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="full-name">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    className="h-11 border-white/40 bg-white/92 pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="signup-email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="mail@school.edu"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="h-11 border-white/40 bg-white/92 pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="signup-password">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 border-white/40 bg-white/92 pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="confirm-password">
                  Confirm password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    className="h-11 border-white/40 bg-white/92 pl-10 pr-10 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-primary-foreground/85">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <span>I agree to the terms and privacy policy.</span>
              </label>

              <Button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="h-11 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-white/25" />
                <span className="text-xs text-primary-foreground/70">or continue with</span>
                <div className="h-px flex-1 bg-white/25" />
              </div>

              <Button
                type="button"
                disabled={isSubmitting || isGoogleSubmitting}
                onClick={handleGoogleSignIn}
                variant="secondary"
                className="h-11 w-full border border-white/30 bg-white/90 text-foreground hover:bg-white"
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                {isGoogleSubmitting ? 'Redirecting...' : 'Continue with Google'}
              </Button>

              <p className="text-center text-sm text-primary-foreground/80">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-foreground hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-center text-xs text-primary-foreground/75">
                Forgot your password?{' '}
                <Link to="/forgot-password" className="font-medium text-primary-foreground hover:underline">
                  Reset it
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
