# Program Cards Modal + Join Now Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make program cards on the Home page clickable to open a glassmorphism detail modal, and add a "Join Now" WhatsApp button inside each card.

**Architecture:** All changes are self-contained in `frontend/src/pages/Home.jsx`. A `PROGRAM_DETAILS` map provides long descriptions keyed by program name. `selectedProgram` state in `Home` drives modal open/close. `ProgramCard` receives `onOpen` callback and renders a Join Now button with `stopPropagation`. A new `ProgramModal` component handles display, Escape key, and overlay-click-to-close.

**Tech Stack:** React 18, Tailwind CSS, Lucide React (Dumbbell, X icons already imported), Vite

---

### Task 1: Add PROGRAM_DETAILS map and extend CLASSES_FALLBACK

**Files:**
- Modify: `frontend/src/pages/Home.jsx:21-26` (CLASSES_FALLBACK) and add PROGRAM_DETAILS constant after it

- [ ] **Step 1: Add PROGRAM_DETAILS map after CLASSES_FALLBACK (line 26)**

Open `frontend/src/pages/Home.jsx`. After the closing `]` of `CLASSES_FALLBACK` (after line 26), insert:

```jsx
const PROGRAM_DETAILS = {
  'Strength Training': 'Build muscle mass and increase raw power through progressive overload and compound lifts. Our sessions focus on squat, bench, deadlift, and accessory movements — suited for beginners and experienced lifters alike. Expect measurable strength gains within weeks of consistent training.',
  'HIIT': 'Burn fat and boost cardiovascular fitness with high-intensity intervals designed to keep your heart rate elevated and your metabolism firing long after the session ends. Alternating explosive effort bursts with active recovery, HIIT is ideal for anyone looking to maximize results in minimum time.',
  'Functional Training': 'Move better, feel stronger. Functional training develops coordination, mobility, and full-body strength using kettlebells, cables, and bodyweight exercises that mirror real-life movement patterns. Perfect for athletes and anyone who wants a body that performs as good as it looks.',
  'Personal Training': 'Get results faster with a dedicated trainer designing your program around your specific goals, current fitness level, and schedule. One-on-one coaching ensures perfect form, consistent accountability, and a plan that evolves as you do.',
}
```

- [ ] **Step 2: Verify the file still parses — check for syntax by reading lines 21–35**

Read `frontend/src/pages/Home.jsx` lines 21–40 and confirm `CLASSES_FALLBACK` and `PROGRAM_DETAILS` are both present with no syntax errors.

---

### Task 2: Add ProgramModal component

**Files:**
- Modify: `frontend/src/pages/Home.jsx` — add `ProgramModal` function component before `ProgramCard`

- [ ] **Step 1: Import X icon from lucide-react (line 3)**

Change the import at line 3 from:
```jsx
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell } from 'lucide-react'
```
to:
```jsx
import { Instagram, Facebook, MessageCircle, MapPin, Dumbbell, X } from 'lucide-react'
```

- [ ] **Step 2: Add ProgramModal component before ProgramCard (before line 92)**

Insert the following function before the `function ProgramCard` declaration:

```jsx
function ProgramModal({ program, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!program) return null

  const fullDescription = PROGRAM_DETAILS[program.name] || program.description

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8"
        style={{
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(230,255,0,0.3)',
          animation: 'modalIn 0.25s ease forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Icon + Name */}
        <Dumbbell size={24} style={{ color: '#E6FF00' }} className="mb-4" />
        <h3 className="section-heading text-3xl mb-4">{program.name.toUpperCase()}</h3>

        {/* Full description */}
        <p className="text-muted leading-relaxed mb-6">{fullDescription}</p>

        {/* Schedule */}
        <p
          className="text-xs font-medium tracking-widest uppercase mb-8 inline-block px-3 py-1"
          style={{ color: '#E6FF00', border: '1px solid rgba(230,255,0,0.3)' }}
        >
          {program.schedule}
        </p>

        {/* Join Now CTA */}
        <div className="block">
          <a
            href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-accent text-black font-body font-bold text-sm uppercase tracking-widest px-8 py-3"
            style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(230,255,0,0.4)'
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            JOIN NOW →
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add modalIn keyframe animation to global CSS**

Find the global CSS file (likely `frontend/src/index.css` or `frontend/src/App.css`). Add the following at the end:

```css
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

---

### Task 3: Update ProgramCard to accept onOpen callback and add Join Now button

**Files:**
- Modify: `frontend/src/pages/Home.jsx` — update `ProgramCard` function signature and body

- [ ] **Step 1: Update ProgramCard signature to accept onOpen prop**

Change line 92 from:
```jsx
function ProgramCard({ cls, index }) {
```
to:
```jsx
function ProgramCard({ cls, index, onOpen }) {
```

- [ ] **Step 2: Add onClick to the card's outer div**

In `ProgramCard`, the outer `div` (currently line 95) has `className="relative overflow-hidden ..."`. Add `onClick={() => onOpen(cls)}` to it:

```jsx
<div
  ref={ref}
  className="relative overflow-hidden min-h-64 flex flex-col justify-end group cursor-pointer animate-on-scroll"
  style={{
    border: '1px solid rgba(255,255,255,0.1)',
    transitionDelay: `${index * 0.15}s`,
    transition: 'opacity 0.7s ease, transform 0.7s ease, border-color 0.3s ease',
  }}
  onClick={() => onOpen(cls)}
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(230,255,0,0.4)' }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
>
```

- [ ] **Step 3: Add Join Now button inside card below the schedule line**

Inside the `<div className="relative z-10 p-6">` block, after the schedule `<p>` tag, add:

```jsx
<a
  href="https://api.whatsapp.com/send/?phone=919912223125&text&type=phone_number&app_absent=0"
  target="_blank"
  rel="noreferrer"
  className="inline-block mt-4 bg-accent text-black font-body font-bold text-xs uppercase tracking-widest px-5 py-2"
  style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
  onClick={(e) => e.stopPropagation()}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = '0 0 16px rgba(230,255,0,0.4)'
    e.currentTarget.style.transform = 'scale(1.02)'
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.transform = 'scale(1)'
  }}
>
  JOIN NOW →
</a>
```

---

### Task 4: Wire up modal state in Home and render ProgramModal

**Files:**
- Modify: `frontend/src/pages/Home.jsx` — update `Home` component

- [ ] **Step 1: Add selectedProgram state to Home**

In the `Home` function body (after line 172), add:

```jsx
const [selectedProgram, setSelectedProgram] = useState(null)
```

- [ ] **Step 2: Pass onOpen to each ProgramCard**

Find the line that renders `ProgramCard` (currently around line 298):
```jsx
{displayClasses.map((cls, i) => <ProgramCard key={cls.name} cls={cls} index={i} />)}
```

Change it to:
```jsx
{displayClasses.map((cls, i) => (
  <ProgramCard key={cls.name} cls={cls} index={i} onOpen={setSelectedProgram} />
))}
```

- [ ] **Step 3: Render ProgramModal at the top of the Home return**

At the very start of the `return (` block in `Home` (right after `<>`), add:

```jsx
<ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
```

So the return looks like:
```jsx
return (
  <>
    <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    {/* HERO */}
    <section className="relative min-h-screen ...">
```

---

### Task 5: Build verification and local dev server

**Files:** No code changes — verification only

- [ ] **Step 1: Run Vite build to check for errors**

```bash
cd "/Users/devaharsha/Claude Code/fitness-lab/frontend" && npm run build
```

Expected: Build completes with no errors. Output ends with `✓ built in X.XXs`.

- [ ] **Step 2: Start dev server**

```bash
cd "/Users/devaharsha/Claude Code/fitness-lab/frontend" && npm run dev
```

Expected: Server starts on `http://localhost:5173` (or similar port). No console errors.

- [ ] **Step 3: Manual smoke-check checklist**
  - Navigate to Home page
  - Verify program cards show "JOIN NOW →" button at the bottom
  - Click a card (not the button) — modal should open with full description, schedule badge, and Join Now CTA
  - Press Escape — modal should close
  - Click outside modal panel — modal should close
  - Click the X button — modal should close
  - Click the in-card "JOIN NOW →" button — WhatsApp should open, NO modal
  - Verify card hover effects (border glow, image zoom) still work
  - Verify scroll-reveal stagger animations still work on fresh page load

---

## Self-Review

**Spec coverage:**
- [x] Entire card clickable → Task 3 Step 2
- [x] Modal opens with name, icon, full description, schedule, Join Now CTA → Task 2 Step 2
- [x] Glassmorphism modal style (dark glass, blur, yellow border) → Task 2 Step 2
- [x] Fade/scale-in animation → Task 2 Step 2 (modalIn keyframe) + Task 2 Step 3
- [x] Close on overlay click → Task 2 Step 2 (overlay onClick={onClose})
- [x] Close on Escape → Task 2 Step 2 (useEffect keydown)
- [x] Close on X button → Task 2 Step 2 (X button with onClick={onClose})
- [x] Join Now button in card → Task 3 Step 3
- [x] Join Now opens WhatsApp (same as site-wide CTAs) → Task 3 Step 3
- [x] stopPropagation on card's Join Now button → Task 3 Step 3
- [x] stopPropagation on modal's panel click → Task 2 Step 2
- [x] Existing animations untouched → Tasks 3–4 only add to existing, don't replace
- [x] useState for selectedProgram → Task 4 Step 1
- [x] Build check → Task 5

**Placeholder scan:** None found.

**Type consistency:** `program` prop in `ProgramModal` is the class object (`{ name, description, schedule, image_url }`). `onOpen` in `ProgramCard` receives `cls` and passes it to `setSelectedProgram` in `Home`. `selectedProgram` state is the same object shape. Consistent throughout.
