import { BookOpen, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer data-read-aloud="site-footer" className="bg-foreground border-foreground/20 border-t">
      <div className="flex flex-col gap-6 mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-6xl">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="flex justify-center items-center bg-secondary shadow-sm rounded-xl w-9 h-9 text-secondary-foreground">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-primary-foreground text-sm lg:text-base leading-none">Resource Library</p>
              <p className="mt-1 text-primary-foreground/80 text-xs">Built for students to share and learn.</p>
            </div>
          </Link>

          <div className="flex items-center gap-5 text-primary-foreground/85 text-sm lg:text-base">
            <Link to="/" className="hover:text-primary-foreground transition-colors">
              Home
            </Link>
            <Link to="/resources" className="hover:text-primary-foreground transition-colors">
              Resources
            </Link>
            <Link to="/upload" className="hover:text-primary-foreground transition-colors">
              Upload
            </Link>
            <a href="mailto:support@resourcelibrary.app" className="inline-flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="w-4 h-4" />
              Contact
            </a>
          </div>
        </div>

        <div className="pt-4 border-primary-foreground/20 border-t text-primary-foreground/70 text-xs">
          © {new Date().getFullYear()} Resource Library. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
