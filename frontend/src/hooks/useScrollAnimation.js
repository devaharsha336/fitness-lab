import { useEffect, useRef } from 'react'

/**
 * Returns a ref. When the element enters the viewport it receives
 * the class "visible", triggering CSS transitions on .animate-on-scroll
 * and .animate-from-left elements.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}
