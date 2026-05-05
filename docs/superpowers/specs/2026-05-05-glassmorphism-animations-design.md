# Glassmorphism + Dynamic Animations Upgrade
**Date:** 2026-05-05  
**Project:** The Fitness Lab  
**Stack:** React + Vite + Tailwind CSS  
**Design tokens:** `#000000` bg, `#E6FF00` accent, `#ffffff` text, Barlow Condensed headings

---

## 1. Goals

Upgrade the entire frontend with glassmorphism surfaces and layered motion design — without altering any existing functionality, routing, data fetching, or business logic. All changes are purely visual.

---

## 2. CSS Foundation (`src/index.css`)

Add the following on top of the existing file (which already has `fade-in-up`):

### Glassmorphism utility classes

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-yellow {
  background: rgba(230, 255, 0, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(230, 255, 0, 0.2);
}
```

### Scroll animation classes

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.animate-on-scroll.visible { opacity: 1; transform: translateY(0); }

.animate-from-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.animate-from-left.visible { opacity: 1; transform: translateX(0); }
```

### Keyframes

```css
@keyframes heroZoom { from { transform: scale(1.05); } to { transform: scale(1.0); } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeSlideLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes countUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
```

### Named animation classes (for hero stagger)

```css
.hero-label  { animation: fadeSlideLeft 0.6s ease forwards; animation-delay: 0.2s; opacity: 0; }
.hero-the    { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 0.3s; opacity: 0; }
.hero-fit    { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 0.5s; opacity: 0; }
.hero-lab    { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 0.7s; opacity: 0; }
.hero-sub    { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 0.9s; opacity: 0; }
.hero-btns   { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 1.1s; opacity: 0; }
.hero-social { animation: fadeSlideUp   0.6s ease forwards; animation-delay: 1.3s; opacity: 0; }
.hero-bg     { animation: heroZoom      8s   ease forwards; transform-origin: center; }
```

### Page transition

```css
.page-enter { animation: fadeSlideUp 0.4s ease forwards; }
```

### Reduced motion respect

```css
@media (prefers-reduced-motion: reduce) {
  *, .animate-on-scroll, .animate-from-left,
  .hero-label, .hero-the, .hero-fit, .hero-lab, .hero-sub, .hero-btns, .hero-social {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

---

## 3. Shared Hook (`src/hooks/useScrollAnimation.js`)

Extract and generalize the `useFadeInUp` hook that is currently duplicated in `Home.jsx` and `Classes.jsx`:

```js
// Returns a ref. When element enters viewport, adds the given className.
export function useScrollReveal(className = 'visible', threshold = 0.15) { ... }
```

Usage: `const ref = useScrollReveal()` — attach as `ref={ref}` to any `.animate-on-scroll` or `.animate-from-left` element.

---

## 4. Component Changes

### `src/App.jsx` — PageWrapper

Add a `PageWrapper` component that applies `page-enter` class on mount for route transitions:

```jsx
function PageWrapper({ children }) {
  return <div className="page-enter">{children}</div>
}
```

Wrap every `<Layout>` child and `<OwnerLogin>` / `<Dashboard>` in `<PageWrapper>`.

---

### `src/components/Navbar.jsx`

**On scroll (existing `scrolled` state):** Replace `bg-black border-b border-border` with:
```
background: rgba(0,0,0,0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1)
```

**Load animations:**
- Logo: `hero-label` animation class (fade from left)
- Nav links: stagger in one by one with small CSS delay (0.1s per link)

**Mobile menu:** Change from conditional render (`{menuOpen && ...}`) to CSS `max-height` transition so it slides down smoothly.

**JOIN NOW hover:** `box-shadow: 0 0 20px rgba(230,255,0,0.4)` + `scale(1.02)` on hover.

**Nav links hover:** Underline that slides in from left (`::after` pseudo-element with `scaleX` transition).

---

### `src/pages/Home.jsx`

**Hero section:**
- Background `<img>` (or `backgroundImage` div) gets `.hero-bg` class for `heroZoom` animation
- Section label `<p>` gets `.hero-label`
- "THE", "FITNESS", `<span>LAB</span>` each get `.hero-the`, `.hero-fit`, `.hero-lab` (applied per-word via individual `<span>` elements)
- Subtitle `<p>` gets `.hero-sub`
- Button group `<div>` gets `.hero-btns`
- Social icons row gets `.hero-social`
- Add 3 floating orb `<div>`s: absolute-positioned, `#E6FF00` at 10% opacity, `border-radius: 50%`, `animation: float Xs ease-in-out infinite` with varying durations (4s, 5s, 6s) and positions

**Stats Counter section** (new, inserted between Programs and Facility):
- Three glass cards in a row: "500+ Members", "5+ Years Experience", "10+ Expert Trainers"
- Each card: `.glass` + `.animate-on-scroll`
- Counter animation: when card enters viewport, `requestAnimationFrame` loop counting from 0 to target over 2s

**Programs section:**
- Section label: `.animate-from-left` + `useScrollReveal`
- Section heading: `.animate-on-scroll` + `useScrollReveal`
- Each `ProgramCard`: `.animate-on-scroll` + `useScrollReveal` with staggered `transition-delay` (0.15s × index)
- Card glass overlay: add `.glass-dark` to the gradient overlay div instead of plain `bg-gradient-to-t`
- Card hover: `group-hover:scale-105` on image, `group-hover:border-[rgba(230,255,0,0.4)]` on card border

**Facility section:**
- Label/heading: same `animate-from-left` + `animate-on-scroll` pattern
- Images: `.animate-on-scroll` with stagger, hover adds `brightness-110` + `scale-103`

**Pricing table rows:**
- Each `<tr>`: glass panel via inline style (backdrop-filter on `<tr>` doesn't work cross-browser — use a wrapping `<div>` or switch to flex-based layout instead of `<table>`)
- Hover: `background: rgba(230,255,0,0.05)` + left yellow border appears

**CTA section:** `.animate-on-scroll`

---

### `src/pages/Classes.jsx`

**ClassCard:**
- Card container: add `.glass-dark` overlay to image side, `group-hover:scale-[1.02]` on outer div
- Right content panel: `background: rgba(17,17,17,0.8)` + `backdrop-filter: blur(10px)` + `border: 1px solid rgba(255,255,255,0.1)` replacing `bg-card`
- Image zoom: `group-hover:scale-105` on background image

**Page-level label/heading:** `.animate-from-left` + `.animate-on-scroll`

---

### `src/pages/Gallery.jsx`

**Grid items:**
- Wrap each item div in `.animate-on-scroll` with stagger
- Hover: `scale-103` + `brightness-110` on image (already has `hover:scale-105` — extend to add brightness)

**Page-level label/heading:** `.animate-from-left` + `.animate-on-scroll`

---

### `src/pages/Pricing.jsx`

**Pricing table rows:**
- Since `backdrop-filter` on `<tr>` is unreliable, switch the table body rows to use `<div>` grid rows (5-column CSS grid) instead of `<tbody><tr><td>` markup. This lets glassmorphism apply correctly.
- Each row: `.glass-dark` base, hover → `glass-yellow` transition
- Stagger: each row gets `transition-delay: calc(index × 0.1s)` via inline style

**Perks section:** `.animate-from-left` + stagger

**Label/heading:** `.animate-from-left` + `.animate-on-scroll`

---

### `src/pages/Contact.jsx`

**WhatsApp card (right column):**  
Replace `bg-card border border-border` with `.glass` + `box-shadow: 0 0 40px rgba(230,255,0,0.1)`.

**Left info section:**  
`.animate-from-left` reveal on scroll.

**Full section:** `.animate-on-scroll` from bottom.

---

### `src/pages/OwnerLogin.jsx`

**Login card:**  
Replace `bg-card border border-border` with:
```
background: rgba(255,255,255,0.05);
backdrop-filter: blur(30px);
-webkit-backdrop-filter: blur(30px);
border: 1px solid rgba(255,255,255,0.1);
box-shadow: 0 0 40px rgba(230,255,0,0.15);
```

---

### `src/dashboard/Dashboard.jsx`

**Header bar:** `.glass-dark` instead of `bg-card border-b border-border`.

**Tabs:**  
Active tab: `border-accent text-[#E6FF00] bg-[rgba(230,255,0,0.05)]`  
Inactive tab: `.glass-dark` on hover  
Tab bar container: `backdrop-filter: blur(10px)` + subtle border

**Program/pricing cards:** Replace `bg-card border border-border` with `.glass-dark`.

---

## 5. Constraints

- **No new npm packages** — pure CSS + Intersection Observer + `requestAnimationFrame`
- **`-webkit-backdrop-filter`** prefix on every `backdrop-filter` for Safari
- **Pricing table restructure** — switch from `<table>` to CSS grid for Pricing page rows to allow glassmorphism (header row can remain a styled `<div>`)
- **`prefers-reduced-motion`** — all animations disabled when user prefers reduced motion
- **Existing functionality preserved** — all API calls, auth, routing, CRUD in Dashboard untouched

---

## 6. Files Changed

| File | Type of change |
|---|---|
| `src/index.css` | Add glass utilities, keyframes, animation classes |
| `src/hooks/useScrollAnimation.js` | New shared hook (extracted + generalized) |
| `src/App.jsx` | Add `PageWrapper` for page transitions |
| `src/components/Navbar.jsx` | Glass scroll effect, load stagger, mobile slide |
| `src/pages/Home.jsx` | Hero animations, orbs, Stats section, scroll reveals |
| `src/pages/Classes.jsx` | Glass cards, scroll reveals |
| `src/pages/Gallery.jsx` | Hover effects, scroll reveals |
| `src/pages/Pricing.jsx` | Table → grid, glass rows, stagger |
| `src/pages/Contact.jsx` | Glass WhatsApp card, scroll reveals |
| `src/pages/OwnerLogin.jsx` | Full glass card |
| `src/dashboard/Dashboard.jsx` | Glass header, tabs, cards |
