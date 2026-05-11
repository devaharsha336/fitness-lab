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
