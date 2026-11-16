import { useEffect, useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollAnimation'
import { unsplashSrcSet, CARD_SIZES } from '../utils/images'
import { FillFormLink } from '../components/CTAButtons'
import { WHATSAPP_URL } from '../config/site'
import { Dumbbell, Clock, User } from 'lucide-react'
import Seo from '../components/Seo'
import { PAGE_SEO } from '../config/seo'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FALLBACK = [
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

function ClassCard({ cls, index }) {
  const ref = useScrollReveal(0.1)

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
        {/* Real <img> rather than a CSS background, so the photo is
            crawlable and carries alt text. object-cover matches the
            previous background-size: cover exactly. */}
        <img
          src={cls.image_url}
          srcSet={unsplashSrcSet(cls.image_url)}
          sizes={CARD_SIZES}
          alt={`${cls.name} class at The Fitness Lab gym in Manikonda, Hyderabad`}
          width={800}
          height={533}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <h2 className="section-heading text-3xl mb-3">{cls.name.toUpperCase()}</h2>
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
        {/* Existing button kept as-is; the form gets a compact text link so the
            card layout is unchanged. */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn inline-block border border-accent text-accent text-xs font-bold uppercase tracking-widest px-6 py-2 hover:bg-accent hover:text-black transition-all w-fit"
          >
            BOOK THIS CLASS →
          </a>
          <FillFormLink />
        </div>
      </div>
    </div>
  )
}

export default function Classes() {
  const [classes, setClasses] = useState([])
  const labelRef = useScrollReveal(0.15, 'animate-from-left')
  const headingRef = useScrollReveal(0.15, 'animate-on-scroll')

  useEffect(() => {
    fetch(`${API}/api/classes`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setClasses(data) }).catch(() => {})
  }, [])

  const data = (classes.length ? classes : FALLBACK).map(cls => ({
    ...cls,
    image_url: IMAGE_MAP[cls.name] || cls.image_url,
  }))

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <Seo {...PAGE_SEO.classes} />
      <p ref={labelRef} className="section-label mb-3">What We Offer</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-12">Our Classes</h1>
      <div className="flex flex-col gap-6">
        {data.map((cls, i) => <ClassCard key={cls.name} cls={cls} index={i} />)}
      </div>
    </div>
  )
}
