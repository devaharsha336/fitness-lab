import { GOOGLE_FORM_URL, WHATSAPP_URL } from '../config/site'

/**
 * The site's paired calls to action: the existing "Join Now" (WhatsApp) button
 * alongside a "Fill the Form" button pointing at the Google Form.
 *
 * Both render as real <a> elements so crawlers follow them and keyboard users
 * get native focus behaviour. The form link opens in a new tab, and its
 * aria-label says so, since an unannounced new tab is disorienting with a
 * screen reader.
 *
 * The form links' aria-label begins with their visible text, which WCAG 2.5.3
 * (Label in Name) requires so voice-control users can activate what they read.
 *
 * The styling deliberately reproduces the button classes already used across
 * the site rather than introducing a new design: solid accent fill for the
 * primary action, outlined for the secondary.
 */

const SIZES = {
  sm: 'text-xs px-5 py-2',
  md: 'text-sm px-7 py-3',
  lg: 'text-sm px-10 py-4',
}

/** Accent glow on hover, matching the inline handlers used elsewhere. */
const glowOn = (e) => {
  e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'
  e.currentTarget.style.transform = 'scale(1.02)'
}
const glowOff = (e) => {
  e.currentTarget.style.boxShadow = 'none'
  e.currentTarget.style.transform = 'scale(1)'
}

export function JoinNowButton({
  href = WHATSAPP_URL,
  size = 'md',
  label = 'JOIN NOW',
  className = '',
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cta-btn inline-block text-center bg-accent text-black font-body font-bold uppercase tracking-widest ${SIZES[size]} ${className}`}
      style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      onMouseEnter={glowOn}
      onMouseLeave={glowOff}
    >
      {label}
    </a>
  )
}

export function FillFormButton({
  size = 'md',
  label = 'FILL THE FORM',
  className = '',
}) {
  return (
    <a
      href={GOOGLE_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fill the Form — membership enquiry (opens in a new tab)"
      className={`cta-btn inline-block text-center border border-accent text-accent font-body font-bold uppercase tracking-widest hover:bg-accent hover:text-black transition-colors ${SIZES[size]} ${className}`}
    >
      {label}
    </a>
  )
}

/**
 * A compact text link version, for the programme and class cards where a
 * second full-size button would crowd the layout.
 */
export function FillFormLink({ className = '' }) {
  return (
    <a
      href={GOOGLE_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fill the Form — membership enquiry (opens in a new tab)"
      onClick={(e) => e.stopPropagation()}
      className={`cta-form-link inline-block text-xs font-body font-bold uppercase tracking-widest underline underline-offset-4 text-accent hover:text-white transition-colors ${className}`}
    >
      Fill the Form →
    </a>
  )
}

/**
 * Both buttons together. Wraps cleanly at narrow widths rather than
 * overflowing; at 375px the pair stacks onto two rows.
 */
export default function CTAButtons({
  joinHref = WHATSAPP_URL,
  joinLabel = 'JOIN NOW',
  size = 'md',
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <JoinNowButton href={joinHref} size={size} label={joinLabel} />
      <FillFormButton size={size} />
    </div>
  )
}
