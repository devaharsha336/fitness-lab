import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollAnimation'
import Seo from '../components/Seo'
import { PAGE_SEO } from '../config/seo'

const IMAGES = [
  { src: '/images/hero_banner.webp', w: 1920, h: 1080, alt: 'Main training floor at The Fitness Lab gym in Manikonda, Hyderabad' },
  { src: '/images/full_gym_overview.webp', w: 1200, h: 800, alt: 'Overview of the gym floor and equipment at The Fitness Lab, Manikonda' },
  { src: '/images/cardio_zone.webp', w: 1200, h: 800, alt: 'Cardio zone with treadmills and cycles at The Fitness Lab, Manikonda' },
  { src: '/images/functional_zone.webp', w: 1200, h: 800, alt: 'Functional training zone at The Fitness Lab gym, Manikonda, Hyderabad' },
  { src: '/images/strength_weights.webp', w: 1200, h: 800, alt: 'Strength training area with free weights at The Fitness Lab, Manikonda' },
  { src: '/images/reception_about.webp', w: 1200, h: 800, alt: 'Reception area at The Fitness Lab gym in Manikonda, Hyderabad' },
]

function GalleryImage({ img, index, onClick }) {
  const ref = useScrollReveal(0.1)

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
        width={img.w}
        height={img.h}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-all duration-500 hover:scale-[1.05] hover:brightness-110"
      />
    </div>
  )
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)
  const labelRef = useScrollReveal(0.15, 'animate-from-left')
  const headingRef = useScrollReveal(0.15, 'animate-on-scroll')

  const prev = () => setLightbox((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setLightbox((i) => (i + 1) % IMAGES.length)

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <Seo {...PAGE_SEO.gallery} />
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
