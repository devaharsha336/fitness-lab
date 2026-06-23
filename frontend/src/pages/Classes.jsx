import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Clock, User } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
  { name: 'Personal Training', description: 'One-on-one coaching tailored to your goals, current fitness level, and schedule. Your dedicated trainer designs every session, tracks your progress, and adjusts your plan for maximum results. Flexible timings to fit your lifestyle.', schedule: 'FLEXIBLE TIMING', image_url: '/images/full_gym_overview.jpg' },
  { name: 'Body Transformation', description: "A structured, results-driven program designed to reshape your physique through a combination of strength training, conditioning, and nutrition guidance. Whether you're starting from scratch or breaking through a plateau, this program delivers visible change. Ideal for those committed to a complete lifestyle overhaul.", schedule: 'MON, WED, FRI - 7:00 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'Weight Loss', description: 'A calorie-burning, metabolism-boosting program combining cardio, resistance training, and dietary strategy to help you shed fat effectively and sustainably. Each session is designed to maximize energy expenditure while preserving lean muscle mass. Suitable for all fitness levels.', schedule: 'TUE, THU, SAT - 6:30 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Weight Gain', description: 'A targeted muscle-building program focused on hypertrophy, progressive overload, and structured nutrition to help you gain lean mass efficiently. Includes guided strength sessions with expert coaching on form and recovery. Perfect for those looking to build size and strength simultaneously.', schedule: 'MON, WED, FRI - 8:00 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'Cardio', description: 'Improve your heart health, stamina, and endurance with our dedicated cardio program featuring treadmill intervals, cycling, rowing, and more. Sessions are paced for all fitness levels — from beginners building base endurance to athletes pushing their aerobic limits. A perfect foundation for any fitness goal.', schedule: 'MON TO SAT - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Strength', description: 'Build raw power and functional muscle through progressive overload, compound lifts, and structured periodization. Our certified coaches guide you through squat, bench, deadlift, and accessory work suited for beginners and seasoned lifters alike. Expect measurable strength gains within weeks.', schedule: 'MON, THU - 7:30 AM', image_url: '/images/strength_weights.jpg' },
  { name: 'HIIT', description: 'High-intensity interval training that torches calories, spikes your metabolism, and builds cardiovascular endurance in shorter sessions. Alternating explosive effort bursts with strategic recovery periods, HIIT is ideal for maximum results in minimum time. No two sessions are the same.', schedule: 'TUE, FRI - 6:00 AM', image_url: '/images/cardio_zone.jpg' },
  { name: 'Circuit Training', description: 'Move through a series of resistance and cardio stations designed to build total-body strength and endurance simultaneously. Circuit training keeps your heart rate elevated while targeting multiple muscle groups in a single session. A great option for those who want variety and efficiency.', schedule: 'WED, SAT - 7:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Kick Boxing', description: "Combine martial arts techniques with high-energy conditioning to build strength, coordination, and explosive power. Our kick boxing sessions are designed for fitness — no prior experience required — delivering a full-body workout that's as fun as it is effective.", schedule: 'TUE, SAT - 8:00 AM', image_url: '/images/functional_zone.jpg' },
  { name: 'Hyrox Training', description: "Purpose-built preparation for Hyrox competitions, combining functional fitness stations with running segments to build race-ready endurance and strength. Whether you're a first-timer or a seasoned competitor, our Hyrox program gets you across the finish line faster.", schedule: 'MON, THU - 6:30 AM', image_url: '/images/full_gym_overview.jpg' },
  { name: 'Yodha Training', description: 'An intense warrior-style conditioning program inspired by military fitness, combining bodyweight challenges, functional strength, and endurance drills. Yodha training is designed to push your physical and mental limits, building resilience and toughness from the inside out.', schedule: 'WED, FRI - 6:00 AM', image_url: '/images/hero_banner.jpg' },
  { name: 'Hybrid Gym', description: 'The best of both worlds — combines strength training and cardio conditioning in a single, efficient program. Hybrid Gym is designed for those who refuse to compromise, building a body that is equally powerful and well-conditioned. Suitable for intermediate to advanced fitness enthusiasts.', schedule: 'MON, WED, SAT - 7:00 AM', image_url: '/images/full_gym_overview.jpg' },
  { name: 'Group Workouts', description: 'Train alongside a community of like-minded members in high-energy group sessions led by expert coaches. Group workouts combine motivation, accountability, and structured programming to keep you consistent and progressing. Available across multiple formats and fitness levels.', schedule: 'MON TO SAT - 8:00 AM', image_url: '/images/hero_banner.jpg' },
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
