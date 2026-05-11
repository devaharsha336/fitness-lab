import { useEffect, useRef } from 'react'
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Contact() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const els = [
      { el: leftRef.current, cls: 'animate-from-left' },
      { el: rightRef.current, cls: 'animate-on-scroll' },
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

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div ref={leftRef}>
          <p className="section-label mb-3">Get In Touch</p>
          <h1 className="section-heading text-5xl md:text-6xl mb-10">Contact Us</h1>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Visit Us</p>
            <div className="flex items-start gap-3 text-muted text-sm mb-3">
              <MapPin size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <span>PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd, Manikonda</span>
            </div>
            <div className="flex items-center gap-3 text-muted text-sm">
              <Phone size={16} style={{ color: '#E6FF00' }} />
              <span>+91 99122 23125</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white font-medium uppercase tracking-widest text-sm mb-4">Hours</p>
            <div className="flex items-start gap-3 text-muted text-sm">
              <Clock size={16} style={{ color: '#E6FF00' }} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white mb-1">Mon – Sat</p>
                <p>Morning: 5:30 AM – 12:00 PM</p>
                <p className="mb-2">Evening: 5:00 PM – 10:00 PM</p>
                <p className="text-white mb-1">Sunday</p>
                <p>Morning: 6:00 AM – 10:00 AM</p>
                <p>Evening: 5:00 PM – 9:00 PM</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#888888' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#E6FF00'
                  e.currentTarget.style.color = '#E6FF00'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = '#888888'
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — glass card */}
        <div
          ref={rightRef}
          className="flex flex-col items-center text-center p-10"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 40px rgba(230, 255, 0, 0.1)',
          }}
        >
          <MessageCircle size={48} style={{ color: '#E6FF00' }} className="mb-6" />
          <h2 className="section-heading text-3xl mb-4">Start Your Fitness Journey</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Have questions about our packages or want to book a session? Reach out to us directly on WhatsApp.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-4 text-center block mb-4"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'
              e.currentTarget.style.transform = 'scale(1.01)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            CHAT ON WHATSAPP →
          </a>
          <p className="text-muted text-sm">+91 99122 23125</p>
        </div>
      </div>
    </div>
  )
}
