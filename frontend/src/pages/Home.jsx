import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell, X } from 'lucide-react'

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

const PROGRAM_DETAILS = {
  'Strength Training': 'Build muscle mass and increase raw power through progressive overload and compound lifts. Our sessions focus on squat, bench, deadlift, and accessory movements — suited for beginners and experienced lifters alike. Expect measurable strength gains within weeks of consistent training.',
  'HIIT': 'Burn fat and boost cardiovascular fitness with high-intensity intervals designed to keep your heart rate elevated and your metabolism firing long after the session ends. Alternating explosive effort bursts with active recovery, HIIT is ideal for anyone looking to maximize results in minimum time.',
  'Functional Training': 'Move better, feel stronger. Functional training develops coordination, mobility, and full-body strength using kettlebells, cables, and bodyweight exercises that mirror real-life movement patterns. Perfect for athletes and anyone who wants a body that performs as good as it looks.',
  'Personal Training': 'Get results faster with a dedicated trainer designing your program around your specific goals, current fitness level, and schedule. One-on-one coaching ensures perfect form, consistent accountability, and a plan that evolves as you do.',
}

const STATS = [
  { value: 500, suffix: '+', label: 'Members' },
  { value: 5,   suffix: '+', label: 'Years Experience' },
  { value: 10,  suffix: '+', label: 'Expert Trainers' },
]

function useScrollObserver(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

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

function ProgramModal({ program, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!program) return null

  const fullDescription = PROGRAM_DETAILS[program.name] || program.description

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(230,255,0,0.3)',
          animation: 'modalIn 0.25s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon + Name */}
        <Dumbbell size={24} style={{ color: '#E6FF00' }} className="mb-4" />
        <h3 className="section-heading text-3xl mb-4">{program.name.toUpperCase()}</h3>

        {/* Full description */}
        <p className="text-muted leading-relaxed mb-6">{fullDescription}</p>

        {/* Schedule */}
        <p
          className="text-xs font-medium tracking-widest uppercase mb-8 inline-block px-3 py-1"
          style={{ color: '#E6FF00', border: '1px solid rgba(230,255,0,0.3)' }}
        >
          {program.schedule}
        </p>

        {/* Join Now CTA */}
        <div className="block">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-8 py-3"
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
            JOIN NOW →
          </a>
        </div>
      </div>
    </div>
  , document.body)
}

function ProgramCard({ cls, index, onOpen }) {
  const ref = useScrollObserver(0.1)

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-h-64 flex flex-col justify-end group cursor-pointer animate-on-scroll"
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        transitionDelay: `${index * 0.15}s`,
        transition: 'opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease',
      }}
      onClick={() => onOpen(cls)}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(230,255,0,0.4)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      {/* Background with zoom on hover */}
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
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 bg-accent text-black font-body font-bold text-xs uppercase tracking-widest px-5 py-2"
          style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 16px rgba(230,255,0,0.4)'
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          JOIN NOW →
        </a>
      </div>
    </div>
  )
}

function FacilityImage({ src, index }) {
  const ref = useScrollObserver(0.1)
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
  const ref = useScrollObserver(0.1)
  return (
    <tr
      ref={ref}
      className="animate-from-left pricing-row"
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

export default function Home() {
  const [classes, setClasses] = useState([])
  const [pricing, setPricing] = useState(PRICING_FALLBACK)
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => {})
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (data.length) setPricing(data) }).catch(() => {})
  }, [])

  const labelProgramsRef = useRef(null)
  const headingProgramsRef = useRef(null)
  const labelFacilityRef = useRef(null)
  const headingFacilityRef = useRef(null)
  const labelPricingRef = useRef(null)
  const headingPricingRef = useRef(null)
  const ctaRef = useRef(null)

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

  const displayClasses = classes.length ? classes : CLASSES_FALLBACK

  return (
    <>
      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
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
              className="bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-7 py-3"
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
              className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E6FF00'
                e.currentTarget.style.color = '#E6FF00'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </section>

      {/* OUR PROGRAMS */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <p ref={labelProgramsRef} className="section-label mb-3">What We Offer</p>
        <h2 ref={headingProgramsRef} className="section-heading text-5xl md:text-6xl mb-10">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayClasses.map((cls, i) => (
            <ProgramCard key={cls.name} cls={cls} index={i} onOpen={setSelectedProgram} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

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
            className="inline-block bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-3"
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
            className="flex-shrink-0 bg-accent text-black font-bold text-sm uppercase tracking-widest px-10 py-4"
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
            CHAT ON WHATSAPP →
          </a>
        </div>
      </section>
    </>
  )
}
