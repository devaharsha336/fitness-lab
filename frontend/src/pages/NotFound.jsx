import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

/**
 * Shown for any route the app does not recognise.
 *
 * The static HTML behind this (dist/spa.html, written by scripts/prerender.mjs)
 * carries robots noindex, so an unknown URL is never indexed even though a
 * single-page app on Vercel can only answer it with a 200.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <Seo title="Page Not Found | The Fitness Lab" description="That page does not exist. Head back to The Fitness Lab home page." path="/404" noindex />
      <p className="section-label mb-3">404</p>
      <h1 className="section-heading text-5xl md:text-7xl mb-4">Page Not Found</h1>
      <p className="text-muted mb-10 max-w-lg leading-relaxed">
        That page doesn’t exist. It may have moved, or the link might be wrong.
        Head back to the home page, or jump straight to what you’re after.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/"
          className="bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-7 py-3"
        >
          Back To Home
        </Link>
        <Link
          to="/classes"
          className="border border-white text-white font-body font-medium text-sm uppercase tracking-widest px-7 py-3 hover:border-accent hover:text-accent transition-colors"
        >
          View Classes
        </Link>
        <Link
          to="/contact"
          className="border border-white text-white font-body font-medium text-sm uppercase tracking-widest px-7 py-3 hover:border-accent hover:text-accent transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
