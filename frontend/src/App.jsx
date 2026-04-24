import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/classes" element={<Layout><Classes /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
