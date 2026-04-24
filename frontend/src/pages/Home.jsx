import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Maps' },
]

const PRICING_FALLBACK = [
  { name: 'Individual', bestPrice: false, monthly: '₹2,500/-', quarterly: '₹6,500/-', halfYearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple', bestPrice: true, monthly: '₹4,500/-', quarterly: '₹11,000/-', halfYearly: '₹18,000/-', yearly: '₹30,000/-' },
  { name: 'Gold Personal Training', bestPrice: true, monthly: '₹7,000/-', quarterly: '₹20,000/-', halfYearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum Personal Training', bestPrice: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', halfYearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

const CLASSES_FALLBACK = [
  { name: 'Strength Training', description: 'Build muscle and strength', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'HIIT', description: 'High intensity interval training', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Functional Training', description: 'Train movements, not muscles', schedule: 'WED, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Personal Training', description: 'One-on-one expert coaching', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
]

function useFadeInUp() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function ProgramCard({ cls }) {
  return (
    <div
      className="relative overflow-hidden min-h-64 flex flex-col justify-end p-6 group cursor-pointer"
      style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative z-10">
        <Dumbbell size={20} style={{ color: '#E6FF00' }} className="mb-2" />
        <h3 className="section-heading text-2xl mb-1">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm mb-2">{cls.description}</p>
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: '#E6FF00' }}>{cls.schedule}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [classes, setClasses] = useState([])
  const [pricing, setPricing] = useState(PRICING_FALLBACK)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => {})
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  const programsRef = useFadeInUp()
  const facilityRef = useFadeInUp()
  const pricingRef = useFadeInUp()
  const ctaRef = useFadeInUp()

  const displayClasses = classes.length ? classes : CLASSES_FALLBACK

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-screen flex flex-col justify-center px-8 md:px-16"
        style={{ backgroundImage: 'url(/images/hero_banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3))' }} />
        <div className="relative z-10 max-w-3xl pt-24">
          <p className="section-label mb-6">Premium Fitness Experience</p>
          <h1 className="section-heading" style={{ fontSize: 'clamp(64px, 10vw, 96px)', lineHeight: 1 }}>
            THE<br />FITNESS<br /><span style={{ color: '#E6FF00' }}>LAB</span>
          </h1>
          <p className="text-muted mt-6 mb-8 max-w-lg leading-relaxed">
            Where science meets sweat. Transform your body with world-class training, cutting-edge equipment, and relentless discipline.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
              className="bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-7 py-3 hover:opacity-90 transition-opacity"
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

        {/* Social icons row at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 border border-white/30 flex items-center justify-center text-white/60 hover:border-accent hover:text-accent transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </section>

      {/* OUR PROGRAMS */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={programsRef}>
        <p className="section-label mb-3">What We Offer</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayClasses.map((cls) => <ProgramCard key={cls.name} cls={cls} />)}
        </div>
      </section>

      {/* OUR FACILITY */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={facilityRef}>
        <p className="section-label mb-3">Take A Look</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Facility</h2>
        <div className="grid grid-cols-2 gap-2">
          {['/images/full_gym_overview.jpg', '/images/cardio_zone.jpg', '/images/strength_weights.jpg', '/images/hero_banner.jpg'].map((src) => (
            <div key={src} className="overflow-hidden aspect-video">
              <img
                src={src}
                alt="Fitness Lab facility"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* OUR PACKAGES */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto fade-in-up" ref={pricingRef}>
        <p className="section-label mb-3">Membership Plans</p>
        <h2 className="section-heading text-5xl md:text-6xl mb-10">Our Packages</h2>
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
              {pricing.map((row) => (
                <tr key={row.name} className="border-b border-border hover:bg-[#1a1a1a] transition-colors">
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
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-10">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-3 hover:opacity-90 transition-opacity"
          >
            BOOK NOW →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16 border-t border-border fade-in-up" ref={ctaRef}>
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
            className="flex-shrink-0 bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-4 hover:opacity-90 transition-opacity"
          >
            CHAT ON WHATSAPP →
          </a>
        </div>
      </section>
    </>
  )
}
