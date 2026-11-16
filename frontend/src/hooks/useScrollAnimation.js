import { useLayoutEffect, useRef } from 'react'

/**
 * Returns a ref. When the element enters the viewport it receives the class
 * "visible", triggering the CSS transitions on .animate-on-scroll and
 * .animate-from-left.
 *
 * Anything already within the viewport when the component mounts is revealed
 * synchronously in a layout effect, i.e. before the browser paints, and never
 * animates. This matters for two reasons:
 *
 *  1. Prerendered HTML ships with these sections already revealed. React then
 *     mounts and replaces that DOM with fresh, unrevealed nodes. Because
 *     IntersectionObserver only reports back on a later frame, above-the-fold
 *     content was measurably flashing visible -> hidden -> visible: roughly
 *     1.1s on a 4x-throttled CPU.
 *  2. Even without prerendering, animating content that is already on screen at
 *     first paint just delays the page for no benefit.
 *
 * Below-the-fold elements are unaffected and still animate in on scroll.
 *
 * @param {number} threshold         IntersectionObserver threshold.
 * @param {string} [initialClass]    Animation class to apply on mount, for
 *                                   components that set it from JS rather than
 *                                   in their JSX.
 */
export function useScrollReveal(threshold = 0.15, initialClass) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (initialClass) el.classList.add(initialClass)

    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const inViewNow = rect.top < viewportHeight && rect.bottom > 0

    if (inViewNow) {
      // Reveal before the first paint. The transition has to be suppressed for
      // this one commit: reading getBoundingClientRect above flushes style, so
      // the browser has already recorded opacity 0 as the "from" value and
      // would otherwise animate 0 -> 1 (staggered by each element's
      // transition-delay). Restore the previous value afterwards so hover and
      // scroll transitions on the same element keep working.
      const previousTransition = el.style.transition
      // Saved separately: assigning the `transition` shorthand resets
      // transition-delay, which several components set inline to stagger
      // their reveal.
      const previousDelay = el.style.transitionDelay
      el.style.transition = 'none'
      el.classList.add('visible')
      void el.offsetHeight // force a reflow to commit it untransitioned
      el.style.transition = previousTransition
      el.style.transitionDelay = previousDelay
      return
    }

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
  }, [threshold, initialClass])

  return ref
}
