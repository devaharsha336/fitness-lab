import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell, X, Phone } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollAnimation'
import { unsplashSrcSet, CARD_SIZES } from '../utils/images'
import CTAButtons, { JoinNowButton, FillFormButton, FillFormLink } from '../components/CTAButtons'
import { WHATSAPP_URL, SOCIAL_LINKS } from '../config/site'
import Seo from '../components/Seo'
import { PAGE_SEO } from '../config/seo'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SOCIAL = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: MessageCircle, href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp' },
  { icon: MapPin, href: SOCIAL_LINKS.maps, label: 'Maps' },
]

const PRICING_FALLBACK = [
  { name: 'Individual (1 Person)', is_featured: false, monthly: '₹2,500/-', quarterly: '₹7,000/-', half_yearly: '₹10,500/-', yearly: '₹15,000/-' },
  { name: 'Couple (2 Persons)', is_featured: true, monthly: '₹4,500/-', quarterly: '₹11,500/-', half_yearly: '₹20,000/-', yearly: '₹28,000/-' },
  { name: 'Gold Personal Training (Sharing)', is_featured: true, monthly: '₹8,000/-', quarterly: '₹20,000/-', half_yearly: '₹38,000/-', yearly: '₹70,000/-' },
  { name: 'Platinum One to One Training', is_featured: true, monthly: '₹15,000/-', quarterly: '₹40,000/-', half_yearly: '₹75,000/-', yearly: '₹1,20,000/-' },
]

const CLASSES_FALLBACK = [
  { name: 'Personal Training', description: 'One-on-one sessions with our certified personal trainers tailored specifically to your fitness goals. Whether you want to build strength, lose weight, or improve overall health, your trainer designs every workout around you. Get maximum results with expert guidance, form correction, and constant motivation.', schedule: 'Flexible Timing', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { name: 'Body Transformation', description: 'A comprehensive 12-week program combining strength training, nutrition coaching, and cardio to completely reshape your physique. Designed for those serious about dramatic, visible change. Track your progress weekly with body composition measurements and adjust the plan as you evolve.', schedule: 'Mon, Wed, Fri – 6:00 AM & 6:00 PM', image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80' },
  { name: 'Weight Loss', description: 'A science-backed fat loss program combining high-intensity workouts with metabolic conditioning to burn calories efficiently. Our coaches guide you through every session while monitoring your diet and recovery. Sustainable, healthy weight loss with real, lasting results.', schedule: 'Tue, Thu, Sat – 7:00 AM & 7:00 PM', image_url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80' },
  { name: 'Weight Gain', description: "Structured muscle-building program for those looking to add lean mass and improve body composition. Combines progressive overload strength training with a personalized calorie and protein plan. Build the physique you've always wanted with expert programming and nutrition support.", schedule: 'Mon, Thu – 8:00 AM & 5:00 PM', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { name: 'Cardio', description: 'High-energy cardio sessions designed to improve cardiovascular endurance, burn fat, and boost your overall stamina. Includes treadmill intervals, cycling, rowing, and aerobic circuits. Perfect for beginners and experienced athletes looking to level up their conditioning.', schedule: 'Daily – 6:00 AM & 6:30 PM', image_url: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80' },
  { name: 'Strength', description: 'Progressive strength training focused on compound movements — squats, deadlifts, bench press, and overhead press. Build raw power and muscular endurance with structured periodization and expert coaching. Suitable for all levels from beginners to advanced lifters.', schedule: 'Mon, Wed, Fri – 7:30 AM & 7:00 PM', image_url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80' },
  { name: 'HIIT', description: 'High-Intensity Interval Training that alternates between explosive bursts of effort and short recovery periods. Burns maximum calories in minimum time and keeps your metabolism elevated for hours after the session. 45-minute classes that challenge every muscle group.', schedule: 'Tue, Fri – 6:00 AM & 7:00 PM', image_url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80' },
  { name: 'Circuit Training', description: 'Full-body circuit workouts that rotate through multiple exercise stations targeting different muscle groups. Combines strength, endurance, and agility for a complete fitness experience in one session. Great for those who want variety and intensity without long rest periods.', schedule: 'Mon, Wed, Sat – 8:00 AM & 6:00 PM', image_url: 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=800&q=80' },
  { name: 'Kick Boxing', description: 'High-energy kickboxing classes combining martial arts techniques with cardiovascular conditioning. Learn punches, kicks, and combinations while burning serious calories and building core strength. No prior experience needed — just bring your energy.', schedule: 'Tue, Thu – 7:00 AM & 7:30 PM', image_url: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80' },
  { name: 'Hyrox Training', description: 'Functional fitness training modeled after the global Hyrox competition format — combining running with functional workout stations like sled pushes, rowing, and burpee broad jumps. Build elite-level endurance and strength simultaneously. Ideal for competitive athletes and fitness enthusiasts.', schedule: 'Wed, Sat – 6:30 AM & 5:30 PM', image_url: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?w=800&q=80' },
  { name: 'Yodha Training', description: 'Our signature warrior-style training program inspired by ancient Indian martial discipline, blending calisthenics, functional movement, and mental toughness conditioning. Build a resilient body and a warrior mindset through structured progressive challenges. Exclusive to The Fitness Lab.', schedule: 'Mon, Thu, Sat – 6:00 AM', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
  { name: 'Hybrid Gym', description: 'The ultimate blend of strength training and endurance work for those who want to excel at both. Hybrid training cycles between heavy lifting blocks and aerobic conditioning so you never have to choose between being strong and being fit. Train like an elite, perform like an athlete.', schedule: 'Tue, Fri, Sun – 7:00 AM & 6:00 PM', image_url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80' },
  { name: 'Group Workouts', description: 'Energetic group fitness classes led by motivating coaches in a community atmosphere. Train alongside like-minded people, push each other to new limits, and make fitness a social experience. Classes rotate weekly so you always have something fresh to look forward to.', schedule: 'Daily – 7:00 AM & 6:00 PM', image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80' },
]

const PROGRAM_DETAILS = {
  'Personal Training': 'One-on-one sessions with our certified personal trainers tailored specifically to your fitness goals. Whether you want to build strength, lose weight, or improve overall health, your trainer designs every workout around you. Get maximum results with expert guidance, form correction, and constant motivation.',
  'Body Transformation': 'A comprehensive 12-week program combining strength training, nutrition coaching, and cardio to completely reshape your physique. Designed for those serious about dramatic, visible change. Track your progress weekly with body composition measurements and adjust the plan as you evolve.',
  'Weight Loss': 'A science-backed fat loss program combining high-intensity workouts with metabolic conditioning to burn calories efficiently. Our coaches guide you through every session while monitoring your diet and recovery. Sustainable, healthy weight loss with real, lasting results.',
  'Weight Gain': "Structured muscle-building program for those looking to add lean mass and improve body composition. Combines progressive overload strength training with a personalized calorie and protein plan. Build the physique you've always wanted with expert programming and nutrition support.",
  'Cardio': 'High-energy cardio sessions designed to improve cardiovascular endurance, burn fat, and boost your overall stamina. Includes treadmill intervals, cycling, rowing, and aerobic circuits. Perfect for beginners and experienced athletes looking to level up their conditioning.',
  'Strength': 'Progressive strength training focused on compound movements — squats, deadlifts, bench press, and overhead press. Build raw power and muscular endurance with structured periodization and expert coaching. Suitable for all levels from beginners to advanced lifters.',
  'HIIT': 'High-Intensity Interval Training that alternates between explosive bursts of effort and short recovery periods. Burns maximum calories in minimum time and keeps your metabolism elevated for hours after the session. 45-minute classes that challenge every muscle group.',
  'Circuit Training': 'Full-body circuit workouts that rotate through multiple exercise stations targeting different muscle groups. Combines strength, endurance, and agility for a complete fitness experience in one session. Great for those who want variety and intensity without long rest periods.',
  'Kick Boxing': 'High-energy kickboxing classes combining martial arts techniques with cardiovascular conditioning. Learn punches, kicks, and combinations while burning serious calories and building core strength. No prior experience needed — just bring your energy.',
  'Hyrox Training': 'Functional fitness training modeled after the global Hyrox competition format — combining running with functional workout stations like sled pushes, rowing, and burpee broad jumps. Build elite-level endurance and strength simultaneously. Ideal for competitive athletes and fitness enthusiasts.',
  'Yodha Training': 'Our signature warrior-style training program inspired by ancient Indian martial discipline, blending calisthenics, functional movement, and mental toughness conditioning. Build a resilient body and a warrior mindset through structured progressive challenges. Exclusive to The Fitness Lab.',
  'Hybrid Gym': 'The ultimate blend of strength training and endurance work for those who want to excel at both. Hybrid training cycles between heavy lifting blocks and aerobic conditioning so you never have to choose between being strong and being fit. Train like an elite, perform like an athlete.',
  'Group Workouts': 'Energetic group fitness classes led by motivating coaches in a community atmosphere. Train alongside like-minded people, push each other to new limits, and make fitness a social experience. Classes rotate weekly so you always have something fresh to look forward to.',
}

const IMAGE_MAP = {
  'Personal Training': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'Body Transformation': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  'Weight Loss': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  'Weight Gain': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'Cardio': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80',
  'Strength': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
  'HIIT': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80',
  'Circuit Training': 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=800&q=80',
  'Kick Boxing': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80',
  'Hyrox Training': 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?w=800&q=80',
  'Yodha Training': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'Hybrid Gym': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
  'Group Workouts': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
}

const STATS = [
  { value: 500, suffix: '+', label: 'Members' },
  { value: 5,   suffix: '+', label: 'Years Experience' },
  { value: 10,  suffix: '+', label: 'Expert Trainers' },
]

function TimingsBanner() {
  const day = new Date().getDay()
  const isSunday = day === 0
  const hours = isSunday
    ? 'Morning: 6:00 AM – 10:00 AM  ·  Evening: 5:00 PM – 9:00 PM'
    : 'Morning: 5:30 AM – 12:00 PM  ·  Evening: 5:00 PM – 10:00 PM'
  const dayLabel = isSunday ? 'Sunday Hours' : "Today's Hours (Mon–Sat)"
  return (
    <div
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 40,
        background: '#E6FF00',
        color: '#000',
        textAlign: 'center',
        padding: '7px 16px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
      }}
    >
      🕐 {dayLabel}: {hours}
    </div>
  )
}

// Kept as a local alias so the call sites below read unchanged; the shared hook
// also reveals anything already on screen at mount, before the first paint.
const useScrollObserver = useScrollReveal

function StatCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0)
  // The card carries .animate-on-scroll (opacity: 0) but nothing here ever
  // added .visible, so these three stats were invisible on the live site and
  // their counters sat at "0+". The shared hook now does the revealing; the
  // effect below still owns the count-up.
  const ref = useScrollReveal(0.5)
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

        {/* Join Now / Fill the Form CTAs */}
        <CTAButtons joinLabel="JOIN NOW →" />
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
      {/* Background with zoom on hover.
          A real <img> rather than a CSS background so the photo is
          crawlable and carries alt text. object-cover + the default
          centre object-position reproduce background-size: cover exactly,
          so this renders identically. */}
      <img
        src={cls.image_url}
        srcSet={unsplashSrcSet(cls.image_url)}
        sizes={CARD_SIZES}
        alt={`${cls.name} training at The Fitness Lab gym in Manikonda, Hyderabad`}
        width={800}
        height={533}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        {/* Existing button kept as-is; the form gets a compact text link so the
            card layout is unchanged. */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn inline-block bg-accent text-black font-body font-bold text-xs uppercase tracking-widest px-5 py-2"
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
          <FillFormLink />
        </div>
      </div>
    </div>
  )
}

function FacilityImage({ src, base, alt, index }) {
  const ref = useScrollObserver(0.1)
  return (
    <div
      ref={ref}
      className="overflow-hidden aspect-video animate-on-scroll"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <img
        src={src}
        srcSet={`${base}-600.webp 600w, ${base}-900.webp 900w, ${src} 1200w`}
        sizes="(min-width: 768px) 50vw, 50vw"
        alt={alt}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
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
        {row.is_featured && (
          <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: '#E6FF00' }}>Featured</span>
        )}
      </td>
      <td className="py-4 pr-6 text-muted">{row.monthly}</td>
      <td className="py-4 pr-6 text-muted">{row.quarterly}</td>
      <td className="py-4 pr-6 text-muted">{row.half_yearly}</td>
      <td className="py-4 text-muted">{row.yearly}</td>
    </tr>
  )
}

export default function Home() {
  const [classes, setClasses] = useState([])
  const [pricing, setPricing] = useState(PRICING_FALLBACK)
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setClasses(data) }).catch(() => {})
    fetch(`${API}/api/pricing`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setPricing(data) }).catch(() => {})
  }, [])

  const labelProgramsRef = useScrollReveal(0.15, 'animate-from-left')
  const headingProgramsRef = useScrollReveal(0.15, 'animate-on-scroll')
  const labelFacilityRef = useScrollReveal(0.15, 'animate-from-left')
  const headingFacilityRef = useScrollReveal(0.15, 'animate-on-scroll')
  const labelPricingRef = useScrollReveal(0.15, 'animate-from-left')
  const headingPricingRef = useScrollReveal(0.15, 'animate-on-scroll')
  const ctaRef = useScrollReveal(0.15, 'animate-on-scroll')

  const displayClasses = (classes.length ? classes : CLASSES_FALLBACK).map(cls => ({
    ...cls,
    image_url: IMAGE_MAP[cls.name] || cls.image_url,
  }))

  return (
    <>
      <Seo {...PAGE_SEO.home} />
      <TimingsBanner />
      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 overflow-hidden">
        {/* Background with zoom animation */}
        <div
          className="absolute inset-0 hero-bg"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3))' }} />

        {/* Floating orbs */}
        <div className="absolute pointer-events-none" style={{ top: '25%', right: '25%', width: 128, height: 128, borderRadius: '50%', background: 'rgba(230,255,0,0.06)', filter: 'blur(20px)', animation: 'float 5s ease-in-out infinite' }} />
        <div className="absolute pointer-events-none" style={{ top: '50%', right: '35%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(230,255,0,0.08)', filter: 'blur(15px)', animation: 'float 4s ease-in-out infinite 1s' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '30%', right: '15%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(230,255,0,0.04)', filter: 'blur(25px)', animation: 'float 6s ease-in-out infinite 0.5s' }} />

        <div className="relative z-10 max-w-3xl pt-32">
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
            <JoinNowButton label="JOIN NOW →" />
            <FillFormButton />
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
            { base: '/images/full_gym_overview', src: '/images/full_gym_overview.webp', alt: 'Gym floor and equipment at The Fitness Lab, Manikonda, Hyderabad' },
            { base: '/images/cardio_zone', src: '/images/cardio_zone.webp', alt: 'Cardio zone with treadmills at The Fitness Lab, Manikonda' },
            { base: '/images/strength_weights', src: '/images/strength_weights.webp', alt: 'Strength training area with free weights at The Fitness Lab, Manikonda' },
            { base: '/images/hero_banner', src: '/images/hero_banner.webp', alt: 'Main training floor at The Fitness Lab gym in Manikonda, Hyderabad' },
          ].map((img, i) => (
            <FacilityImage key={img.src} src={img.src} base={img.base} alt={img.alt} index={i} />
          ))}
        </div>
      </section>

      {/* OUR PACKAGES */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <p ref={labelPricingRef} className="section-label mb-3">Membership Plans</p>
        <h2 ref={headingPricingRef} className="section-heading text-5xl md:text-6xl mb-10">Our Packages</h2>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '640px' }}>
            <thead>
              <tr className="border-b border-border">
                {['Package', 'Monthly', 'Quarterly (3 months)', 'Half-Yearly (6 months)', 'Yearly (12 months)'].map((h) => (
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
        <div className="mt-10">
          <CTAButtons joinLabel="BOOK NOW →" size="lg" className="justify-center" />
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
            <div className="flex flex-col gap-1 mt-3">
              <div className="flex items-center gap-2 text-muted text-sm">
                <Phone size={14} />
                <a href="tel:+919912223125" className="hover:text-accent transition-colors">+91 99122 23125</a>
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                <Phone size={14} />
                <a href="tel:+918125034011" className="hover:text-accent transition-colors">+91 81250 34011</a>
              </div>
            </div>
          </div>
          <CTAButtons
            joinLabel="CHAT ON WHATSAPP →"
            size="lg"
            className="flex-shrink-0"
          />
        </div>
      </section>
    </>
  )
}
