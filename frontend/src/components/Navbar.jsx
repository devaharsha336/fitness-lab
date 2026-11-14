import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Lock, Menu, X } from 'lucide-react'
import { JoinNowButton, FillFormButton } from './CTAButtons'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    `nav-link text-xs font-body font-medium uppercase tracking-widest transition-colors duration-200 ${
      isActive ? 'text-accent' : 'text-white hover:text-accent'
    }`

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={scrolled ? {
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to="/"
          className="font-heading font-extrabold text-xl uppercase text-white tracking-tight hero-label"
          style={{ animationDelay: '0s' }}
        >
          THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['classes', 'gallery', 'pricing', 'contact'].map((page, i) => (
            <NavLink
              key={page}
              to={`/${page}`}
              className={navLinkClass}
              style={{ opacity: 0, animation: `fadeSlideUp 0.5s ease forwards ${0.1 + i * 0.08}s` }}
            >
              {page}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div
          className="hidden md:flex items-center gap-4"
          style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease forwards 0.45s' }}
        >
          <JoinNowButton size="sm" />
          <FillFormButton size="sm" />
          <Link
            to="/owner-login"
            className="flex items-center gap-1.5 text-white border border-border px-3 py-2 text-xs uppercase tracking-widest font-body hover:border-accent hover:text-accent transition-colors"
          >
            <Lock size={12} />
            Owner Login
          </Link>
        </div>

        {/* Mobile: compact form pill + hamburger. Two full-width buttons will
            not fit beside the logo at 375px, so the form CTA is shortened to
            "FORM" here and shown in full inside the menu. */}
        <div className="md:hidden flex items-center gap-3">
          <FillFormButton size="sm" label="FORM" className="!px-3 !py-1.5" />
          <button
            className="text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — smooth slide */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          opacity: menuOpen ? 1 : 0,
          // Without this the collapsed menu is merely transparent, so its
          // links stay focusable and are still announced by screen readers.
          visibility: menuOpen ? 'visible' : 'hidden',
          transitionProperty: 'max-height, opacity, visibility',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {['classes', 'gallery', 'pricing', 'contact'].map((page) => (
            <NavLink
              key={page}
              to={`/${page}`}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {page}
            </NavLink>
          ))}
          <JoinNowButton size="sm" className="w-full" />
          <FillFormButton size="sm" className="w-full" />
          <Link
            to="/owner-login"
            className="flex items-center justify-center gap-1.5 text-white border border-border px-3 py-2 text-xs uppercase tracking-widest"
            onClick={() => setMenuOpen(false)}
          >
            <Lock size={12} />
            Owner Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
