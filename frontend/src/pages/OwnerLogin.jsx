import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function OwnerLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      localStorage.setItem('fitness_lab_token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-muted text-sm hover:text-accent transition-colors">
        <ArrowLeft size={16} />
        Back to site
      </Link>

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
        <h1 className="section-heading text-4xl mb-2">
          OWNER <span style={{ color: '#E6FF00' }}>LOGIN</span>
        </h1>
        <p className="text-muted text-sm mb-8">Access your admin dashboard</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-border text-white placeholder-muted text-sm px-4 py-3 pl-10 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-border text-white placeholder-muted text-sm px-4 py-3 pl-10 pr-10 focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-3 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'ACCESS DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  )
}
