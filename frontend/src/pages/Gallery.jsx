import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const IMAGES = [
  { src: '/images/hero_banner.jpg', alt: 'The Fitness Lab gym floor' },
  { src: '/images/full_gym_overview.jpg', alt: 'Full gym overview' },
  { src: '/images/cardio_zone.jpg', alt: 'Cardio zone' },
  { src: '/images/functional_zone.jpg', alt: 'Functional training zone' },
  { src: '/images/strength_weights.jpg', alt: 'Strength and weights area' },
  { src: '/images/reception_about.jpg', alt: 'Reception area' },
]

function GalleryImage({ img, index, onClick }) {
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
      className="overflow-hidden cursor-pointer aspect-video animate-on-scroll"
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={onClick}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.05] hover:brightness-110"
      />
    </div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)

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

  const prev = () => setLightbox((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setLightbox((i) => (i + 1) % IMAGES.length)

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <p ref={labelRef} className="section-label mb-3">Take A Look</p>
      <h1 ref={headingRef} className="section-heading text-5xl md:text-7xl mb-12">Our Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {IMAGES.map((img, i) => (
          <GalleryImage key={img.src} img={img} index={i} onClick={() => setLightbox(i)} />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          <button className="absolute top-4 right-4 text-white hover:text-accent transition-colors" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          <button className="absolute left-4 text-white hover:text-accent transition-colors p-2" onClick={(e) => { e.stopPropagation(); prev() }}>
            <ChevronLeft size={36} />
          </button>
          <img
            src={IMAGES[lightbox].src}
            alt={IMAGES[lightbox].alt}
            className="max-h-[85vh] max-w-[85vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button className="absolute right-4 text-white hover:text-accent transition-colors p-2" onClick={(e) => { e.stopPropagation(); next() }}>
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-4 text-muted text-sm">{lightbox + 1} / {IMAGES.length}</div>
        </div>
      )}
    </div>
  )
}
