# Program Cards Modal + Join Now Button

**Date:** 2026-06-17
**File:** `frontend/src/pages/Home.jsx`

## Overview

Two additions to the existing program cards in the "Our Programs" section of `Home.jsx`:
1. Clicking a card opens a glassmorphism detail modal for that program
2. Each card gets a "Join Now" button that opens WhatsApp (same as all other CTAs on the site)

## Architecture

All modal state lives in `Home` as `useState(null)`. `ProgramCard` receives two callbacks: `onOpen` (card click) and the WhatsApp href. A new `ProgramModal` component renders conditionally when `selectedProgram !== null`. Both components stay in `Home.jsx` — no new files needed.

## Program Descriptions

A `PROGRAM_DETAILS` constant maps program name → `fullDescription`. Used in the modal. API-fetched classes are merged with this map at display time (fallback to short description if name not found).

- **Strength Training**: Build muscle mass and increase raw power through progressive overload and compound lifts. Our sessions focus on squat, bench, deadlift, and accessory movements — suited for beginners and experienced lifters alike. Expect measurable strength gains within weeks of consistent training.
- **HIIT**: Burn fat and boost cardiovascular fitness with high-intensity intervals designed to keep your heart rate elevated and your metabolism firing long after the session ends. Alternating explosive effort bursts with active recovery, HIIT is ideal for anyone looking to maximize results in minimum time.
- **Functional Training**: Move better, feel stronger. Functional training develops coordination, mobility, and full-body strength using kettlebells, cables, and bodyweight exercises that mirror real-life movement patterns. Perfect for athletes and anyone who wants a body that performs as good as it looks.
- **Personal Training**: Get results faster with a dedicated trainer designing your program around your specific goals, current fitness level, and schedule. One-on-one coaching ensures perfect form, consistent accountability, and a plan that evolves as you do.

## ProgramCard Changes

- Card `div` gets `onClick={() => onOpen(cls)}` — entire card is clickable
- "Join Now" `<a>` tag added below schedule text:
  - Opens `https://api.whatsapp.com/send/?phone=919912223125...` in new tab
  - Styled: `bg-[#E6FF00]`, dark text, bold, small, uppercase tracking — same as all other site CTAs
  - `e.stopPropagation()` on click to prevent card modal from also opening
- All existing hover effects, border glow, image zoom, and stagger animations are untouched

## ProgramModal Component

**Trigger:** Renders when `selectedProgram !== null` in `Home`

**Structure:**
```
Fixed overlay (inset-0, z-50, bg black/70)
  └── Centered panel (max-w-lg, glass bg, backdrop-blur-20, border yellow/30)
        ├── Close (X) button — top-right
        ├── Dumbbell icon (yellow)
        ├── Program name (section-heading style)
        ├── Full description (2–3 sentences, text-muted)
        ├── Schedule badge (yellow text, uppercase, tracking-widest)
        └── "Join Now" CTA button (same WhatsApp link, full yellow button)
```

**Animations:**
- Overlay: `opacity 0 → 1` via CSS transition on mount
- Panel: `scale(0.95) opacity-0 → scale(1) opacity-1` via inline style + transition

**Close triggers:**
1. Click on overlay background (not the panel) — `onClick` on overlay div
2. Escape key — `useEffect` with `keydown` event listener, cleaned up on unmount
3. X button in modal corner

**Styling:** Consistent with site glassmorphism — `background: rgba(0,0,0,0.85)`, `backdropFilter: blur(20px)`, `border: 1px solid rgba(230,255,0,0.3)`

## What Does NOT Change

- `useScrollObserver` hook — untouched
- Stagger animation delays on cards (`transitionDelay`)
- Image zoom on hover (`group-hover:scale-105`)
- Border color hover glow (`onMouseEnter`/`onMouseLeave`)
- `StatCounter`, `FacilityImage`, `PricingRow`, rest of `Home` component

## Build Verification

Run `npm run build` (or `vite build`) from `frontend/` after implementation to confirm no TypeScript/lint errors.
