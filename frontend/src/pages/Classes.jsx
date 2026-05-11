import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Clock, User } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Strength Training', description: 'Build raw muscle and functional strength with compound lifts, progressive overload principles, and expert coaching. Our strength program is suitable for all levels — whether you\'re picking up a barbell for the first time or chasing a new PR.', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'HIIT', description: 'High-intensity interval training designed to torch calories, boost metabolism, and improve cardiovascular endurance. Each session pushes your limits with short bursts of effort followed by active recovery.', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Functional Training', description: 'Train movements, not just muscles. Our functional training program improves mobility, stability, and real-world athletic performance using kettlebells, resistance bands, and bodyweight movements.', schedule: 'WED, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Personal Training', description: 'One-on-one coaching tailored entirely to your goals, current fitness level, and schedule. Your trainer designs every session, monitors progress, and adjusts your plan for maximum results.', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
]

function ClassCard({ cls, index }) {
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
      className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 overflow-hidden group"
      style={{
        transitionDelay: `${index * 0.1}s`,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Image side */}
      <div className="min-h-64 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${cls.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-accent text-black text-xs font-bold uppercase tracking-widest px-3 py-1">
            Class {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content side */}
      <div
        className="p-8 flex flex-col justify-center"
        style={{
          background: 'rgba(17,17,17,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Dumbbell size={24} style={{ color: '#E6FF00' }} className="mb-4" />
        <h3 className="section-heading text-3xl mb-3">{cls.name.toUpperCase()}</h3>
        <p className="text-muted text-sm leading-relaxed mb-6">{cls.description}</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <Clock size={14} style={{ color: '#E6FF00' }} />
            <span className="text-white">{cls.schedule}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User size={14} style={{ color: '#E6FF00' }} />
            <span className="text-muted">Certified Trainer</span>
          </div>
        </div>
        <a
          href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block border border-accent text-accent text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-black transition-all w-fit"
        >
          BOOK THIS CLASS →
        </a>
      </div>
    </div>
  )
}

export default function Classes() {
  const [classes, setClasses] = useState([])
  const labelRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(setClasses).catch(() => setClasses(FALLBACK))
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

  const data = classes.length ? classes : FALLBACK

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p ref={labelRef} className="section-label mb-3">What We Offer</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-12">Our Classes</h1>
      <div className="flex flex-col gap-6">
        {data.map((cls, i) => <ClassCard key={cls.name} cls={cls} index={i} />)}
      </div>
    </div>
  )
}
