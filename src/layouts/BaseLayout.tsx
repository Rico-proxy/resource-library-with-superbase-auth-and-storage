import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'

export function BaseLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
