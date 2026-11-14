import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollAnimation'
import CTAButtons from '../components/CTAButtons'
import Seo from '../components/Seo'
import { PAGE_SEO } from '../config/seo'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Individual (1 Person)', is_featured: false, monthly: '₹2,500/-', quarterly: '₹7,000/-', half_yearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple (2 Persons)', is_featured: true, monthly: '₹4,500/-', quarterly: '₹11,500/-', half_yearly: '₹20,000/-', yearly: '₹28,000/-' },
  { name: 'Gold Personal Training (Sharing)', is_featured: true, monthly: '₹8,000/-', quarterly: '₹20,000/-', half_yearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum One to One Training', is_featured: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', half_yearly: '₹75,000/-', yearly: '₹1,20,000/-' },
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
  const ref = useScrollReveal(0.1)

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
        {row.is_featured && (
          <span className="block text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: '#E6FF00' }}>Featured</span>
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
  const labelRef = useScrollReveal(0.15, 'animate-from-left')
  const headingRef = useScrollReveal(0.15, 'animate-on-scroll')

  useEffect(() => {
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setPricing(data) }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <Seo {...PAGE_SEO.pricing} />
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
        <p className="text-muted text-sm mb-6">
          Ready to join? Message us on WhatsApp, or fill in the form and we’ll get back to you.
        </p>
        <CTAButtons joinLabel="BOOK NOW →" size="lg" className="justify-center" />
      </div>
    </div>
  )
}
