import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Individual (1 Person)', best_price: false, monthly: '₹2,500/-', quarterly: '₹7,000/-', half_yearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple (2 Persons)', best_price: true, monthly: '₹4,500/-', quarterly: '₹11,500/-', half_yearly: '₹20,000/-', yearly: '₹28,000/-' },
  { name: 'Gold Personal Training (Sharing)', best_price: true, monthly: '₹8,000/-', quarterly: '₹20,000/-', half_yearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum One to One Training', best_price: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', half_yearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

const INCLUDES = [
  'Modern Equipment',
  'Expert Trainers',
  'Personalized Workout Plan',
  'Diet Guidance',
  'Locker & Shower Facility',
]

const COLS = ['Package', 'Monthly', 'Quarterly (3 months)', 'Half-Yearly (6 months)', 'Yearly (12 months)']

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
      className="animate-from-left pricing-row"
      style={{
        transitionDelay: `${index * 0.1}s`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <td className="py-4 px-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-white font-medium">{row.name}</span>
        {row.best_price && (
          <span className="block text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: '#E6FF00' }}>Best Price</span>
        )}
      </td>
      <td className="py-4 px-4 text-muted font-medium" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>{row.monthly}</td>
      <td className="py-4 px-4 text-muted font-medium" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>{row.quarterly}</td>
      <td className="py-4 px-4 text-muted font-medium" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>{row.half_yearly}</td>
      <td className="py-4 px-4 text-muted font-medium">{row.yearly}</td>
    </tr>
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

      {/* Pricing Table */}
      <div className="overflow-x-auto mb-12">
        <table
          className="w-full"
          style={{
            borderCollapse: 'collapse',
            minWidth: '640px',
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <thead>
            <tr style={{ background: '#E6FF00' }}>
              {COLS.map((h) => (
                <th
                  key={h}
                  className="text-left py-4 px-4 text-black font-heading font-bold uppercase"
                  style={{ fontSize: '0.78rem', letterSpacing: '0.08em', borderRight: '1px solid rgba(0,0,0,0.12)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricing.map((row, i) => <PricingRow key={row.name} row={row} index={i} />)}
          </tbody>
        </table>
      </div>

      {/* All Packages Include */}
      <div className="mb-12 p-6" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(17,17,17,0.5)' }}>
        <p className="font-heading font-bold uppercase tracking-widest text-sm mb-5" style={{ color: '#E6FF00' }}>All Packages Include</p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {INCLUDES.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted">
              <Check size={14} style={{ color: '#E6FF00', flexShrink: 0 }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted text-sm mb-6">Ready to join? Message us on WhatsApp to book your membership.</p>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-12 py-4"
          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          BOOK NOW →
        </a>
      </div>
    </div>
  )
}
