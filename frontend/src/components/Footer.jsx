import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react'

const SOCIAL = [
  { icon: Instagram, href: 'https://www.instagram.com/thefitnesslabgym?utm_source=qr&igsh=MWRwc3ljbXV2eHN1ZA%3D%3D', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com/thefitnesslabfl?rdid=I0DAc5rDNaR39ix5&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14atX1FapyC%2F', label: 'Facebook' },
  { icon: MessageCircle, href: 'https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0', label: 'WhatsApp' },
  { icon: MapPin, href: 'https://share.google/HdkgsfHTe9xOIv1ze', label: 'Google Maps' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left */}
        <div>
          <p className="font-heading font-extrabold text-2xl uppercase text-white mb-3">
            THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span>
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Where science meets sweat. Premium fitness experience in the heart of Hyderabad.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className="section-label mb-4">Quick Links</p>
          <div className="flex flex-col gap-2">
            {[['Classes', '/classes'], ['Gallery', '/gallery'], ['Pricing', '/pricing'], ['Contact', '/contact']].map(([label, to]) => (
              <Link key={to} to={to} className="text-muted text-sm hover:text-accent transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <p className="section-label mb-4">Connect</p>
          <div className="flex gap-2 mb-4">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
          <div className="flex items-start gap-2 text-muted text-sm mb-2">
            <MapPin size={14} className="mt-0.5 flex-shrink-0" />
            <span>PVSR Palace, 3rd & 4th Floor, Sri Ram Nagar Colony, Golden Temple Rd, Manikonda</span>
          </div>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Phone size={14} />
            <span>+91 99122 23125</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-muted text-xs">© 2026 The Fitness Lab. All rights reserved.</span>
        <Link to="/owner-login" className="text-muted text-xs uppercase tracking-widest hover:text-accent transition-colors">
          Owner Login
        </Link>
      </div>
    </footer>
  )
}
