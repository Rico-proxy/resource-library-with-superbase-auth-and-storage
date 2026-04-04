import { supabase } from '@/lib/supabase'

function getRedirectUrl(path: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  return `${window.location.origin}${path}`
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signUpWithEmail(fullName: string, email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectUrl('/login'),
      data: {
        full_name: fullName,
      },
    },
  })
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getRedirectUrl('/resources'),
    },
  })
}

export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getRedirectUrl('/reset-password'),
  })
}

export async function updatePassword(newPassword: string) {
  return supabase.auth.updateUser({
    password: newPassword,
  })
}
