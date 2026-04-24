import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div>
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
                className="w-10 h-10 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-card border border-border p-10 flex flex-col items-center text-center">
          <MessageCircle size={48} style={{ color: '#E6FF00' }} className="mb-6" />
          <h2 className="section-heading text-3xl mb-4">Start Your Fitness Journey</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Have questions about our packages or want to book a session? Reach out to us directly on WhatsApp.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="w-full bg-accent text-black font-bold text-sm uppercase tracking-widest py-4 text-center hover:opacity-90 transition-opacity block mb-4"
          >
            CHAT ON WHATSAPP →
          </a>
          <p className="text-muted text-sm">+91 99122 23125</p>
        </div>
      </div>
    </div>
  )
}
