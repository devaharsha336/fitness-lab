import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Gallery from './pages/Gallery'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import StructuredData from './components/StructuredData'

/*
 * The owner-only screens are code-split. They were statically imported, so
 * every visitor to the public site downloaded the whole dashboard — its
 * tables, forms and CRUD logic — before the home page could render. Only the
 * gym owner ever opens these, and only after signing in.
 */
const OwnerLogin = lazy(() => import('./pages/OwnerLogin'))
const Dashboard = lazy(() => import('./dashboard/Dashboard'))

/** Minimal placeholder while an admin chunk loads; public pages never see it. */
function AdminLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-muted text-sm uppercase tracking-widest">Loading…</p>
    </div>
  )
}

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
      <StructuredData />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PageWrapper>
        <Suspense fallback={<AdminLoading />}>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/classes" element={<Layout><Classes /></Layout>} />
            <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/owner-login" element={<OwnerLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Suspense>
      </PageWrapper>
    </BrowserRouter>
  )
}
