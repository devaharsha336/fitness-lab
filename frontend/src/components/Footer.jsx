import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react'
import { SOCIAL_LINKS, BUSINESS, ADDRESS_SHORT } from '../config/site'

const SOCIAL = [
  { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
  { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
  { icon: MessageCircle, href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp' },
  { icon: MapPin, href: SOCIAL_LINKS.maps, label: 'Google Maps' },
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
            Where science meets sweat. Premium fitness experience in Manikonda, Hyderabad.
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
          <div className="flex flex-col gap-1 text-muted text-sm">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <a href="tel:+919912223125" className="hover:text-accent transition-colors">+91 99122 23125</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <a href="tel:+918125034011" className="hover:text-accent transition-colors">+91 81250 34011</a>
            </div>
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
