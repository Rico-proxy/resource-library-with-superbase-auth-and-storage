type GoogleIconProps = {
  className?: string
}

export function GoogleIcon({ className = 'h-4 w-4' }: GoogleIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3c1.7-1.6 2.7-3.9 2.7-6.6 0-.6-.1-1.2-.2-1.8H12z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.4 0 4.4-.8 5.9-2.1l-3-2.3c-.8.6-1.8 1-2.9 1-2.2 0-4-1.5-4.7-3.4l-3.1 2.4C5.5 19.3 8.5 21 12 21z"
      />
      <path
        fill="#FBBC05"
        d="M7.3 14.2c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2L4.2 7.8C3.4 9.2 3 10.6 3 12.2s.4 3.1 1.2 4.4l3.1-2.4z"
      />
      <path
        fill="#4285F4"
        d="M12 6.8c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 4 14.4 3 12 3 8.5 3 5.5 4.7 4.2 7.8l3.1 2.4c.7-2 2.5-3.4 4.7-3.4z"
      />
    </svg>
  )
}
