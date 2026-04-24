import { useEffect, useState } from 'react'
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

export default function Pricing() {
  const [pricing, setPricing] = useState(FALLBACK)

  useEffect(() => {
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p className="section-label mb-3">Membership Plans</p>
      <h1 className="section-heading text-5xl md:text-7xl mb-4">Our Packages</h1>
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

      {/* Table */}
      <div className="overflow-x-auto border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card">
              {['Package', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].map((h) => (
                <th key={h} className="font-heading font-bold uppercase text-left px-6 py-4" style={{ color: '#E6FF00', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pricing.map((row) => (
              <tr key={row.name} className="border-b border-border hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-5">
                  <span className="text-white font-medium">{row.name}</span>
                  {row.best_price && (
                    <span className="block text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: '#E6FF00' }}>Best Price</span>
                  )}
                </td>
                <td className="px-6 py-5 text-muted font-medium">{row.monthly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.quarterly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.half_yearly}</td>
                <td className="px-6 py-5 text-muted font-medium">{row.yearly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted text-sm mb-6">Ready to join? Message us on WhatsApp to book your membership.</p>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-12 py-4 hover:opacity-90 transition-opacity"
        >
          BOOK NOW →
        </a>
      </div>
    </div>
  )
}
