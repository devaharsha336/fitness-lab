# Glassmorphism + Dynamic Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the entire frontend of The Fitness Lab with glassmorphism surfaces, hero/scroll animations, a new Stats Counter section, and page transitions — no functional changes.

**Architecture:** All animation is vanilla CSS + Intersection Observer + `requestAnimationFrame`. Glassmorphism is applied via utility CSS classes (`.glass`, `.glass-dark`, `.glass-yellow`) and inline styles where `backdrop-filter` needs Safari prefix. A shared `useScrollReveal` hook (extracted from the duplicated `useFadeInUp`) drives all scroll-triggered reveals. An `AnimateIn` wrapper component lets per-element animation be expressed inline without calling hooks at every level.

**Tech Stack:** React 18, Vite, Tailwind CSS, vanilla CSS animations, Intersection Observer API, `requestAnimationFrame`

**Dev server:** `cd /Users/devaharsha/fitness-lab/frontend && npm run dev` (default port 5173)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/index.css` | Modify | Add glass utilities, keyframes, animation classes, nav-link underline |
| `src/hooks/useScrollAnimation.js` | Create | Shared Intersection Observer hook + AnimateIn component |
| `src/App.jsx` | Modify | Add PageWrapper for page transitions |
| `src/components/Navbar.jsx` | Modify | Glass on scroll, mobile slide, link underline, JOIN NOW glow |
| `src/pages/Home.jsx` | Modify | Hero stagger, floating orbs, Stats section, scroll reveals |
| `src/pages/Classes.jsx` | Modify | Glass card panels, scroll reveals |
| `src/pages/Gallery.jsx` | Modify | Scroll reveals with stagger |
| `src/pages/Pricing.jsx` | Modify | Table → CSS grid, glass rows, stagger slide-in |
| `src/pages/Contact.jsx` | Modify | Glass WhatsApp card, scroll reveals |
| `src/pages/OwnerLogin.jsx` | Modify | Full glass login card |
| `src/dashboard/Dashboard.jsx` | Modify | Glass header, tabs, cards |

---

## Task 1: CSS Foundation

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace the full contents of `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #000000;
  --accent: #E6FF00;
  --text-primary: #ffffff;
  --text-muted: #888888;
  --card-bg: #111111;
  --border: #222222;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.section-label {
  color: var(--accent);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
}

.section-heading {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  line-height: 1;
}

/* ── Glassmorphism utilities ─────────────────────────────── */

.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-yellow {
  background: rgba(230, 255, 0, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(230, 255, 0, 0.2);
}

/* ── Scroll animation classes ────────────────────────────── */

.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-from-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.animate-from-left.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Legacy alias — keep for any existing .fade-in-up usages */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Keyframes ───────────────────────────────────────────── */

@keyframes heroZoom {
  from { transform: scale(1.05); }
  to   { transform: scale(1.0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-20px); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Hero animation classes ──────────────────────────────── */

.hero-label  { opacity: 0; animation: fadeSlideLeft 0.6s ease forwards 0.2s; }
.hero-the    { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 0.3s; }
.hero-fit    { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 0.5s; }
.hero-lab    { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 0.7s; }
.hero-sub    { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 0.9s; }
.hero-btns   { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 1.1s; }
.hero-social { opacity: 0; animation: fadeSlideUp   0.6s ease forwards 1.3s; }
.hero-bg     { animation: heroZoom 8s ease forwards; transform-origin: center; }

/* ── Page transition ─────────────────────────────────────── */

.page-enter { animation: fadeSlideUp 0.4s ease forwards; }

/* ── Navbar link underline slide ─────────────────────────── */

.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #E6FF00;
  transition: width 0.25s ease;
}
.nav-link:hover::after {
  width: 100%;
}

/* ── Pricing row glass ───────────────────────────────────── */

.pricing-row {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
}

.pricing-row:hover {
  background: rgba(230, 255, 0, 0.05);
  border-color: rgba(230, 255, 0, 0.2);
  transform: translateX(4px);
}

/* ── Reduced motion ──────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  *,
  .animate-on-scroll,
  .animate-from-left,
  .fade-in-up,
  .hero-label, .hero-the, .hero-fit, .hero-lab,
  .hero-sub, .hero-btns, .hero-social,
  .page-enter,
  .pricing-row {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Verify**

Run `cd /Users/devaharsha/fitness-lab/frontend && npm run dev`, open `http://localhost:5173`. Site should look identical to before (no animations yet — CSS only).

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: add glassmorphism utilities, keyframes, and animation classes"
```

---

## Task 2: Shared Scroll Animation Hook

**Files:**
- Create: `src/hooks/useScrollAnimation.js`

- [ ] **Step 1: Create the file**

```js
import { useEffect, useRef } from 'react'

/**
 * Returns a ref. When the element enters the viewport it receives
 * the class "visible", triggering CSS transitions on .animate-on-scroll
 * and .animate-from-left elements.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useScrollAnimation.js
git commit -m "feat: add shared useScrollReveal hook"
```

---

## Task 3: App.jsx — Page Transitions

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Gallery from './pages/Gallery'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import OwnerLogin from './pages/OwnerLogin'
import Dashboard from './dashboard/Dashboard'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('fitness_lab_token')
  return token ? children : <Navigate to="/owner-login" replace />
}

function PageWrapper({ children }) {
  const ref = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('page-enter')
    void el.offsetWidth // force reflow to restart animation
    el.classList.add('page-enter')
  }, [pathname])
  return <div ref={ref}>{children}</div>
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/classes" element={<Layout><Classes /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Verify**

Navigate between pages in the browser — each page should fade/slide up on entry (0.4s).

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add page-enter transition on route change"
```

---

## Task 4: Navbar — Glass + Animations

**Files:**
- Modify: `src/components/Navbar.jsx`

- [ ] **Step 1: Replace `src/components/Navbar.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Lock, Menu, X } from 'lucide-react'

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
              style={{ animationDelay: `${0.1 + i * 0.08}s`, opacity: 0, animation: `fadeSlideUp 0.5s ease forwards ${0.1 + i * 0.08}s` }}
            >
              {page}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4" style={{ opacity: 0, animation: 'fadeSlideUp 0.5s ease forwards 0.45s' }}>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-black font-body font-bold text-xs uppercase tracking-widest px-5 py-2 transition-all duration-200 hover:scale-[1.02]"
            style={{ '--tw-shadow': 'none', transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            JOIN NOW
          </a>
          <Link
            to="/owner-login"
            className="flex items-center gap-1.5 text-white border border-border px-3 py-2 text-xs uppercase tracking-widest font-body hover:border-accent hover:text-accent transition-colors"
          >
            <Lock size={12} />
            Owner Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — smooth slide */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          opacity: menuOpen ? 1 : 0,
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
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-black font-bold text-xs uppercase tracking-widest px-5 py-2 text-center"
          >
            JOIN NOW
          </a>
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
```

- [ ] **Step 2: Verify**

In browser: scroll down — navbar should glass up. On mobile, tap menu — it should slide down smoothly. Hover JOIN NOW — glow. Hover nav links — underline slides in from left.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: navbar glassmorphism on scroll, link underlines, mobile slide"
```

---

## Task 5: Home.jsx — Hero Section

**Files:**
- Modify: `src/pages/Home.jsx` (hero section only — keep rest of file unchanged)

- [ ] **Step 1: Update the hero section in `src/pages/Home.jsx`**

Replace the `{/* HERO */}` section (lines 78–125) with:

```jsx
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 overflow-hidden">
        {/* Background with zoom animation */}
        <div
          className="absolute inset-0 hero-bg"
          style={{ backgroundImage: 'url(/images/hero_banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3))' }} />

        {/* Floating orbs */}
        <div className="absolute pointer-events-none" style={{ top: '25%', right: '25%', width: 128, height: 128, borderRadius: '50%', background: 'rgba(230,255,0,0.06)', filter: 'blur(20px)', animation: 'float 5s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ top: '50%', right: '35%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(230,255,0,0.08)', filter: 'blur(15px)', animation: 'float 4s ease-in-out infinite 1s' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '30%', right: '15%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(230,255,0,0.04)', filter: 'blur(25px)', animation: 'float 6s ease-in-out infinite 0.5s' }} />

        <div className="relative z-10 max-w-3xl pt-24">
          <p className="section-label mb-6 hero-label">Premium Fitness Experience</p>
          <h1 className="section-heading" style={{ fontSize: 'clamp(64px, 10vw, 96px)', lineHeight: 1 }}>
            <span className="block hero-the">THE</span>
            <span className="block hero-fit">FITNESS</span>
            <span className="block hero-lab" style={{ color: '#E6FF00' }}>LAB</span>
          </h1>
          <p className="text-muted mt-6 mb-8 max-w-lg leading-relaxed hero-sub">
            Where science meets sweat. Transform your body with world-class training, cutting-edge equipment, and relentless discipline.
          </p>
          <div className="flex flex-wrap gap-4 hero-btns">
            <a
              href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
              className="bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-7 py-3 transition-all duration-200"
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              JOIN NOW →
            </a>
            <Link
              to="/classes"
              className="border border-white text-white font-body font-medium text-sm uppercase tracking-widest px-7 py-3 hover:border-accent hover:text-accent transition-colors"
            >
              EXPLORE CLASSES
            </Link>
          </div>
        </div>

        {/* Social icons */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10 hero-social">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center text-white/60 transition-all duration-200 hover:scale-110"
              style={{ border: '1px solid rgba(255,255,255,0.3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E6FF00'; e.currentTarget.style.color = '#E6FF00' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </section>
```

- [ ] **Step 2: Verify**

Reload `http://localhost:5173`. Hero text should animate in word-by-word. Background should subtly zoom in. Three faint yellow orbs should float.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: hero section — stagger animations, zoom bg, floating orbs"
```

---

## Task 6: Home.jsx — Stats Counter Section

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Add the `STATS` constant and `StatCounter` component near the top of `Home.jsx`** (after the `CLASSES_FALLBACK` constant, before `useFadeInUp`):

```jsx
const STATS = [
  { value: 500, suffix: '+', label: 'Members' },
  { value: 5,   suffix: '+', label: 'Years Experience' },
  { value: 10,  suffix: '+', label: 'Expert Trainers' },
]

function StatCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          obs.unobserve(el)
          const duration = 2000
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            setCount(Math.floor(progress * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      className="glass p-8 text-center animate-on-scroll"
      style={{ transitionDelay: '0.1s' }}
    >
      <p className="section-heading" style={{ fontSize: 'clamp(48px, 6vw, 72px)', color: '#E6FF00' }}>
        {count}{suffix}
      </p>
      <p className="text-muted text-sm uppercase tracking-widest mt-3">{label}</p>
    </div>
  )
}
```

- [ ] **Step 2: Insert the Stats section in the `Home` component's JSX** — between the `{/* OUR PROGRAMS */}` section and the `{/* OUR FACILITY */}` section:

```jsx
      {/* STATS */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>
```

- [ ] **Step 3: Verify**

Scroll down past Programs — three glass cards should appear with numbers counting up from 0 to 500+, 5+, 10+.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: stats counter section with glass cards and count-up animation"
```

---

## Task 7: Home.jsx — Programs, Facility, Pricing Scroll Reveals

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Update `ProgramCard` to include glass overlay, hover effects, and scroll animation**

Replace the existing `ProgramCard` function:

```jsx
function ProgramCard({ cls, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-64 flex flex-col justify-end group cursor-pointer animate-on-scroll"
      style={{
        backgroundImage: `url(${cls.image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        transitionDelay: `${index * 0.15}s`,
        transition: 'opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(230,255,0,0.4)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      {/* Background zoom on hover */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Glass dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="relative z-10 p-6">
        <Dumbbell size={20} style={{ color: '#E6FF00' }} className="mb-2" />
        <h3 className="section-heading text-2xl mb-1">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm mb-2">{cls.description}</p>
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E6FF00' }}>{cls.schedule}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add scroll reveals to Programs, Facility, and Pricing sections**

At the top of the `Home` component function (after the existing state declarations), add new refs:

```jsx
  const labelProgramsRef = useRef(null)
  const headingProgramsRef = useRef(null)
  const labelFacilityRef = useRef(null)
  const headingFacilityRef = useRef(null)
  const labelPricingRef = useRef(null)
  const headingPricingRef = useRef(null)
  const ctaRef = useRef(null)
```

And add a `useEffect` that sets up Intersection Observers for all of them:

```jsx
  useEffect(() => {
    const els = [
      { el: labelProgramsRef.current, cls: 'animate-from-left' },
      { el: headingProgramsRef.current, cls: 'animate-on-scroll' },
      { el: labelFacilityRef.current, cls: 'animate-from-left' },
      { el: headingFacilityRef.current, cls: 'animate-on-scroll' },
      { el: labelPricingRef.current, cls: 'animate-from-left' },
      { el: headingPricingRef.current, cls: 'animate-on-scroll' },
      { el: ctaRef.current, cls: 'animate-on-scroll' },
    ]
    const observers = els.map(({ el, cls }) => {
      if (!el) return null
      el.classList.add(cls)
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])
```

- [ ] **Step 3: Update the JSX for Programs, Facility, Pricing, and CTA sections**

Replace the four sections (starting from `{/* OUR PROGRAMS */}` to end of `{/* CTA */}`):

```jsx
      {/* OUR PROGRAMS */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <p ref={labelProgramsRef} className="section-label mb-3">What We Offer</p>
        <h2 ref={headingProgramsRef} className="section-heading text-5xl md:text-6xl mb-10">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayClasses.map((cls, i) => <ProgramCard key={cls.name} cls={cls} index={i} />)}
        </div>
      </section>

      {/* STATS — already added in Task 6 */}

      {/* OUR FACILITY */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <p ref={labelFacilityRef} className="section-label mb-3">Take A Look</p>
        <h2 ref={headingFacilityRef} className="section-heading text-5xl md:text-6xl mb-10">Our Facility</h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            '/images/full_gym_overview.jpg',
            '/images/cardio_zone.jpg',
            '/images/strength_weights.jpg',
            '/images/hero_banner.jpg',
          ].map((src, i) => (
            <FacilityImage key={src} src={src} index={i} />
          ))}
        </div>
      </section>

      {/* OUR PACKAGES */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <p ref={labelPricingRef} className="section-label mb-3">Membership Plans</p>
        <h2 ref={headingPricingRef} className="section-heading text-5xl md:text-6xl mb-10">Our Packages</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Packages', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map((h) => (
                  <th key={h} className="font-heading font-bold uppercase text-left pb-4 pr-6" style={{ color: '#E6FF00', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing.map((row, i) => (
                <PricingRow key={row.name} row={row} index={i} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-10">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-3 transition-all duration-200"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            BOOK NOW →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-20 px-6 md:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label mb-3">Get In Touch</p>
            <h2 className="section-heading text-4xl md:text-5xl">Ready To Start?</h2>
            <p className="text-muted mt-3">Chat with us on WhatsApp — quick answers, no waiting.</p>
            <div className="flex items-center gap-2 mt-4 text-muted text-sm">
              <MapPin size={14} />
              <span>PVSR Palace, Manikonda, Hyderabad</span>
            </div>
          </div>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-4 transition-all duration-200"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'; e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            CHAT ON WHATSAPP →
          </a>
        </div>
      </section>
```

- [ ] **Step 4: Add `FacilityImage` and `PricingRow` sub-components** (add near the top with the other component definitions):

```jsx
function FacilityImage({ src, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className="overflow-hidden aspect-video animate-on-scroll"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <img
        src={src}
        alt="Fitness Lab facility"
        className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.03] hover:brightness-110"
      />
    </div>
  )
}

function PricingRow({ row, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <tr
      ref={ref}
      className="border-b border-border animate-from-left pricing-row"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <td className="py-4 pr-6">
        <span className="text-white font-medium">{row.name}</span>
        {(row.best_price || row.bestPrice) && (
          <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#E6FF00' }}>Best Price</span>
        )}
      </td>
      <td className="py-4 pr-6 text-muted">{row.monthly}</td>
      <td className="py-4 pr-6 text-muted">{row.quarterly}</td>
      <td className="py-4 pr-6 text-muted">{row.half_yearly || row.halfYearly}</td>
      <td className="py-4 text-muted">{row.yearly}</td>
    </tr>
  )
}
```

- [ ] **Step 5: Remove the old `useFadeInUp` hook and the old refs** (`programsRef`, `facilityRef`, `pricingRef`, `ctaRef`) from `Home.jsx` since they are now replaced.

- [ ] **Step 6: Verify**

Scroll through the home page — Programs label slides from left, heading slides up, cards stagger in, facility photos scale up, pricing rows slide in from left with yellow highlight on hover.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: home page scroll reveals, glass program cards, facility + pricing animations"
```

---

## Task 8: Classes.jsx — Glass Cards + Scroll Reveals

**Files:**
- Modify: `src/pages/Classes.jsx`

- [ ] **Step 1: Replace `src/pages/Classes.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Clock, User } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Strength Training', description: 'Build raw muscle and functional strength with compound lifts, progressive overload principles, and expert coaching. Our strength program is suitable for all levels — whether you\'re picking up a barbell for the first time or chasing a new PR.', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'HIIT', description: 'High-intensity interval training designed to torch calories, boost metabolism, and improve cardiovascular endurance. Each session pushes your limits with short bursts of effort followed by active recovery.', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Functional Training', description: 'Train movements, not just muscles. Our functional training program improves mobility, stability, and real-world athletic performance using kettlebells, resistance bands, and bodyweight movements.', schedule: 'WED, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Personal Training', description: 'One-on-one coaching tailored entirely to your goals, current fitness level, and schedule. Your trainer designs every session, monitors progress, and adjusts your plan for maximum results.', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
]

function ClassCard({ cls, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 overflow-hidden group"
      style={{
        transitionDelay: `${index * 0.1}s`,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Image side */}
      <div className="min-h-64 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-accent text-black text-xs font-bold uppercase tracking-widest px-3 py-1">
            Class {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content side */}
      <div
        className="p-8 flex flex-col justify-center"
        style={{
          background: 'rgba(17,17,17,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Dumbbell size={24} style={{ color: '#E6FF00' }} className="mb-4" />
        <h3 className="section-heading text-3xl mb-3">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm leading-relaxed mb-6">{cls.description}</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Clock size={14} style={{ color: '#E6FF00' }} />
            <span className="text-white">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User size={14} style={{ color: '#E6FF00' }} />
            <span className="text-muted">Certified Trainer</span>
          </div>
        </div>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block border border-accent text-accent text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-black transition-all w-fit"
        >
          BOOK THIS CLASS →
        </a>
      </div>
    </div>
  )
}

export default function Classes() {
  const [classes, setClasses] = useState([])
  const labelRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => setClasses(FALLBACK))
  }, [])

  useEffect(() => {
    const els = [
      { el: labelRef.current, cls: 'animate-from-left' },
      { el: headingRef.current, cls: 'animate-on-scroll' },
    ]
    const observers = els.map(({ el, cls }) => {
      if (!el) return null
      el.classList.add(cls)
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  const data = classes.length ? classes : FALLBACK

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p ref={labelRef} className="section-label mb-3">What We Offer</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-12">Our Classes</h1>
      <div className="flex flex-col gap-6">
        {data.map((cls, i) => <ClassCard key={cls.name} cls={cls} index={i} />)}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Navigate to `/classes`. Cards should fade in with stagger, image side glass overlay visible, content panel has glass tint. Image zooms on hover.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Classes.jsx
git commit -m "feat: classes page glass cards and scroll reveals"
```

---

## Task 9: Gallery.jsx — Scroll Reveals + Hover Effects

**Files:**
- Modify: `src/pages/Gallery.jsx`

- [ ] **Step 1: Replace `src/pages/Gallery.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { src: '/images/hero_banner.jpg', alt: 'The Fitness Lab gym floor' },
  { src: '/images/full_gym_overview.jpg', alt: 'Full gym overview' },
  { src: '/images/cardio_zone.jpg', alt: 'Cardio zone' },
  { src: '/images/functional_zone.jpg', alt: 'Functional training zone' },
  { src: '/images/strength_weights.jpg', alt: 'Strength and weights area' },
  { src: '/images/reception_about.jpg', alt: 'Reception area' },
]

function GalleryImage({ img, index, onClick }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="overflow-hidden cursor-pointer aspect-video animate-on-scroll"
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={onClick}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.05] hover:brightness-110"
      />
    </div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const els = [
      { el: labelRef.current, cls: 'animate-from-left' },
      { el: headingRef.current, cls: 'animate-on-scroll' },
    ]
    const observers = els.map(({ el, cls }) => {
      if (!el) return null
      el.classList.add(cls)
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  const prev = () => setLightbox((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setLightbox((i) => (i + 1) % IMAGES.length)

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p ref={labelRef} className="section-label mb-3">Take A Look</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-12">Our Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {IMAGES.map((img, i) => (
          <GalleryImage key={img.src} img={img} index={i} onClick={() => setLightbox(i)} />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          <button className="absolute top-4 right-4 text-white hover:text-accent transition-colors" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 text-white hover:text-accent transition-colors p-2" onClick={(e) => { e.stopPropagation(); prev() }}>
            <ChevronLeft size={36} />
          </button>
          <img
            src={IMAGES[lightbox].src}
            alt={IMAGES[lightbox].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-4 text-white hover:text-accent transition-colors p-2" onClick={(e) => { e.stopPropagation(); next() }}>
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-4 text-muted text-sm">{lightbox + 1} / {IMAGES.length}</div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Navigate to `/gallery`. Images fade in with stagger. Hover individual images — should scale + brighten. Lightbox still works.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Gallery.jsx
git commit -m "feat: gallery scroll reveals and hover effects"
```

---

## Task 10: Pricing.jsx — Glass Rows + Stagger

**Files:**
- Modify: `src/pages/Pricing.jsx`

- [ ] **Step 1: Replace `src/pages/Pricing.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Individual', best_price: false, monthly: '₹2,500/-', quarterly: '₹6,500/-', half_yearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple', best_price: true, monthly: '₹4,500/-', quarterly: '₹11,000/-', half_yearly: '₹18,000/-', yearly: '₹30,000/-' },
  { name: 'Gold Personal Training', best_price: true, monthly: '₹7,000/-', quarterly: '₹20,000/-', half_yearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum Personal Training', best_price: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', half_yearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

const PERKS = [
  'Access to all gym equipment',
  'Locker room & shower facilities',
  'Unlimited class bookings',
  'Fitness progress tracking',
  'Nutrition guidance',
]

const COLS = ['Package', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']

function PricingRow({ row, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid animate-from-left pricing-row"
      style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        transitionDelay: `${index * 0.1}s`,
        padding: '20px 24px',
      }}
    >
      <div>
        <span className="text-white font-medium">{row.name}</span>
        {row.best_price && (
          <span className="block text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: '#E6FF00' }}>Best Price</span>
        )}
      </div>
      <div className="text-muted font-medium self-center">{row.monthly}</div>
      <div className="text-muted font-medium self-center">{row.quarterly}</div>
      <div className="text-muted font-medium self-center">{row.half_yearly}</div>
      <div className="text-muted font-medium self-center">{row.yearly}</div>
    </div>
  )
}

export default function Pricing() {
  const [pricing, setPricing] = useState(FALLBACK)
  const labelRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  useEffect(() => {
    const els = [
      { el: labelRef.current, cls: 'animate-from-left' },
      { el: headingRef.current, cls: 'animate-on-scroll' },
    ]
    const observers = els.map(({ el, cls }) => {
      if (!el) return null
      el.classList.add(cls)
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p ref={labelRef} className="section-label mb-3">Membership Plans</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-4">Our Packages</h1>
      <p className="text-muted mb-12 max-w-xl">All memberships include full access to our facility. Choose the plan that works for you.</p>

      {/* Perks */}
      <div className="flex flex-wrap gap-4 mb-12">
        {PERKS.map((perk) => (
          <div key={perk} className="flex items-center gap-2 text-sm text-muted">
            <Check size={14} style={{ color: '#E6FF00' }} />
            {perk}
          </div>
        ))}
      </div>

      {/* Table header */}
      <div
        className="grid mb-px"
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          background: 'rgba(17,17,17,0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 24px',
        }}
      >
        {COLS.map((h) => (
          <div key={h} className="font-heading font-bold uppercase" style={{ color: '#E6FF00', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-px">
        {pricing.map((row, i) => <PricingRow key={row.name} row={row} index={i} />)}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted text-sm mb-6">Ready to join? Message us on WhatsApp to book your membership.</p>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-12 py-4 transition-all duration-200"
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          BOOK NOW →
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Navigate to `/pricing`. Rows should slide in from left with stagger. Hover each row — yellow tint + slight rightward shift + yellow border.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Pricing.jsx
git commit -m "feat: pricing page glass rows with stagger and hover effects"
```

---

## Task 11: Contact.jsx — Glass Card + Scroll Reveals

**Files:**
- Modify: `src/pages/Contact.jsx`

- [ ] **Step 1: Replace `src/pages/Contact.jsx`**

```jsx
import { useEffect, useRef } from 'react'
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Contact() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const els = [
      { el: leftRef.current, cls: 'animate-from-left' },
      { el: rightRef.current, cls: 'animate-on-scroll' },
    ]
    const observers = els.map(({ el, cls }) => {
      if (!el) return null
      el.classList.add(cls)
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div ref={leftRef}>
          <p className="section-label mb-3">Get In Touch</p>
          <h1 className="section-heading text-5xl md:text-6xl mb-10">Contact Us</h1>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Visit Us</p>
            <div className="flex items-start gap-3 text-muted text-sm mb-3">
              <MapPin size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <span>PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd, Manikonda</span>
            </div>
            <div className="flex items-center gap-3 text-muted text-sm">
              <Phone size={16} style={{ color: '#E6FF00' }} />
              <span>+91 99122 23125</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Hours</p>
            <div className="flex items-start gap-3 text-muted text-sm">
              <Clock size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white mb-1">Mon – Sat</p>
                <p>Morning: 5:30 AM – 12:00 PM</p>
                <p className="mb-2">Evening: 5:00 PM – 10:00 PM</p>
                <p className="text-white mb-1">Sunday</p>
                <p>Morning: 6:00 AM – 10:00 AM</p>
                <p>Evening: 5:00 PM – 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center text-muted transition-all duration-200 hover:scale-110"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#E6FF00'; e.currentTarget.style.color = '#E6FF00' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#888888' }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — glass card */}
        <div
          ref={rightRef}
          className="flex flex-col items-center text-center p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 40px rgba(230, 255, 0, 0.1)',
          }}
        >
          <MessageCircle size={48} style={{ color: '#E6FF00' }} className="mb-6" />
          <h2 className="section-heading text-3xl mb-4">Start Your Fitness Journey</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Have questions about our packages or want to book a session? Reach out to us directly on WhatsApp.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-4 text-center block mb-4 transition-all duration-200"
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'; e.currentTarget.style.transform = 'scale(1.01)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' }}
          >
            CHAT ON WHATSAPP →
          </a>
          <p className="text-muted text-sm">+91 99122 23125</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Navigate to `/contact`. Left column slides from left, right WhatsApp card fades up with glass effect and yellow glow.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "feat: contact page glass WhatsApp card and scroll reveals"
```

---

## Task 12: OwnerLogin.jsx — Full Glass Card

**Files:**
- Modify: `src/pages/OwnerLogin.jsx`

- [ ] **Step 1: Update only the card `<div>` style in `src/pages/OwnerLogin.jsx`**

Find the card div (line ~43):
```jsx
      <div
        className="w-full max-w-md bg-card border border-border p-10"
        style={{ boxShadow: '0 0 40px rgba(230,255,0,0.08)' }}
      >
```

Replace with:
```jsx
      <div
        className="w-full max-w-md p-10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 40px rgba(230, 255, 0, 0.15)',
        }}
      >
```

- [ ] **Step 2: Verify**

Navigate to `/owner-login`. The login card should now appear frosted/glass over the black background with a subtle yellow glow.

- [ ] **Step 3: Commit**

```bash
git add src/pages/OwnerLogin.jsx
git commit -m "feat: owner login glass card with yellow glow"
```

---

## Task 13: Dashboard.jsx — Glass Header, Tabs, Cards

**Files:**
- Modify: `src/dashboard/Dashboard.jsx`

- [ ] **Step 1: Update the header bar** — find the header `<div>` (line ~270):

```jsx
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
```

Replace with:
```jsx
      <div
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
```

- [ ] **Step 2: Update the tab bar** — find the tab bar `<div>` (line ~279):

```jsx
      <div className="border-b border-border px-6 flex gap-0">
```

Replace with:
```jsx
      <div
        className="px-6 flex gap-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
```

- [ ] **Step 3: Update the tab buttons** — find the tab button className (line ~283):

```jsx
            className={`px-6 py-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-accent text-white' : 'border-transparent text-muted hover:text-white'
            }`}
```

Replace with:
```jsx
            className={`px-6 py-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all duration-200 ${
              tab === t.id
                ? 'border-accent text-white'
                : 'border-transparent text-muted hover:text-white'
            }`}
            style={tab === t.id ? { background: 'rgba(230,255,0,0.05)' } : {}}
```

- [ ] **Step 4: Update program/pricing cards in `ProgramsTab` and `PricingTab`**

In `ProgramsTab`, find all card divs with `className="bg-card border border-border p-5"` and `className="bg-card border border-accent p-6 mb-6"` — replace with glass styles:

Card (normal):
```jsx
            <div
              key={cls.id}
              className="p-5"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
```

Add form card:
```jsx
        <div
          className="p-6 mb-6"
          style={{ background: 'rgba(230,255,0,0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(230,255,0,0.2)' }}
        >
```

In `PricingTab`, find `className="bg-card border border-border p-6"`:
```jsx
          <div
            key={pkg.id}
            className="p-6"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
```

- [ ] **Step 5: Verify**

Log in to `/dashboard`. Header and tab bar should have glass tint. Active tab highlighted yellow. Cards appear frosted.

- [ ] **Step 6: Commit**

```bash
git add src/dashboard/Dashboard.jsx
git commit -m "feat: dashboard glass header, tabs, and cards"
```

---

## Task 14: Final Commit

- [ ] **Step 1: Run a full browser pass**

With `npm run dev` running, visit each page in order:
- `/` — hero stagger, orbs, stats counter, scroll reveals
- `/classes` — glass cards, image zoom, stagger
- `/gallery` — grid stagger, hover effects, lightbox still works
- `/pricing` — glass rows, slide-in stagger, hover yellow tint
- `/contact` — glass WhatsApp card, slide-from-left
- `/owner-login` — glass login card with glow
- Navigate between pages — fade transition on each
- Scroll navbar on any page — glass effect appears

- [ ] **Step 2: Final commit with all changes**

```bash
git add -A && git commit -m "feat: glassmorphism + dynamic animations upgrade"
```

- [ ] **Step 3: Push**

```bash
git push origin main
```

---

## Self-Review Checklist

| Spec Requirement | Task |
|---|---|
| Navbar glass on scroll | Task 4 |
| Navbar mobile slide | Task 4 |
| JOIN NOW glow hover | Tasks 4, 5 |
| Nav link underline slide | Task 1 (CSS), Task 4 |
| Program cards glass overlay + hover border | Tasks 1, 7 |
| Pricing rows glass panel + hover | Tasks 1, 7 (Home), 10 (Pricing page) |
| Owner login glass card | Task 12 |
| Contact WhatsApp glass card | Task 11 |
| Dashboard glass tabs + cards | Task 13 |
| Hero text stagger animations | Task 5 |
| Hero bg zoom | Task 5 |
| Floating orbs | Task 5 |
| Stats counter section (new) | Task 6 |
| Scroll reveals — labels from left | Tasks 7–11 |
| Scroll reveals — headings from bottom | Tasks 7–11 |
| Program cards stagger | Task 7 |
| Facility photos scale + brightness | Task 7 |
| Pricing rows stagger slide from left | Tasks 7, 10 |
| Contact section fade from bottom | Task 11 |
| Page transitions | Task 3 |
| Social icons hover glow | Task 5 |
| Footer links color transition | Existing Tailwind hover — already present |
| prefers-reduced-motion | Task 1 (CSS) |
| -webkit- backdrop-filter prefix | All tasks using backdrop-filter |
