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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
