# The Fitness Lab — Delivery Readiness Report

**Date:** 2026-06-17
**Reviewed by:** Security Audit Agent + Code Quality/QA Agent (parallel) + automated fixes

---

## VERDICT

> **NOT READY FOR HANDOFF — Complete C1–C6 first (~20 minutes of work)**
>
> The site is fully functional and the code is clean. All blockers are credential and config hygiene — nothing architectural. See the 20-minute checklist at the bottom.

---

## PART 1 — CRITICAL / BLOCKING (owner action required)

### [C1] Change the admin password in the live database
The seeded password `FitnessLab@2024` is hardcoded in:
- `backend/seed.py:84`
- `README.md:55-56`
- `docs/superpowers/plans/2026-04-24-fitness-lab.md:2325`

It is permanently in git history. The client must log into the dashboard → Account Settings and change this password before handoff. There is no force-change-on-first-login mechanism.

### [C2] Rotate MongoDB Atlas password
`backend/.env` (gitignored, not committed) contains:
```
MONGO_URI=mongodb+srv://devasharsha336:FitnessLab2024@cluster0...
```
Rotate this password in Atlas UI immediately and update Render's `MONGO_URI` environment variable with the new string. Do this before giving the client access to the codebase or repo.

### [C3] Rotate JWT secret to a strong random value
Current value: `fitnesslab-super-secret-2024` — a guessable human-readable string.
Anyone with this value can forge valid admin JWTs without knowing the password.
```bash
openssl rand -hex 32
```
Update `JWT_SECRET` in Render's environment variables with the output.

### [C4] Password hashing is SHA-256 without salt (bcrypt unused)
`backend/auth.py:17-21` uses `hashlib.sha256` — no salt, no iterations.
`passlib[bcrypt]` and `bcrypt` are both in `requirements.txt` but never imported or used.
- Replace `hash_password` / `verify_password` in `auth.py` with `passlib.context.CryptContext(schemes=["bcrypt"])`
- Re-seed or manually update the stored hash in Atlas after deploying the fix
- Risk: low for a single-admin site with a strong password, but a real vulnerability if the DB is ever leaked

### [C5] Confirm VITE_API_URL is set in Vercel dashboard
`frontend/.env.local` (gitignored) points to `http://localhost:8000`.
This file won't ship to Vercel, but Vercel needs `VITE_API_URL=https://your-render-service.onrender.com` set in the Vercel project's Environment Variables UI. Verify this before going live.

### [C6] CORS is `allow_origins=["*"]` with `allow_credentials=True`
`backend/main.py:9` — combining wildcard origins with credentials is spec-invalid and means any website can call your API.
Restrict to your Vercel domain:
```python
allow_origins=["https://your-site.vercel.app"],
```

---

## PART 2 — FIXES APPLIED AUTOMATICALLY

| # | Fix | Files Changed |
|---|-----|---------------|
| 1 | **Pricing page mobile** — 5-column table wrapped in `overflow-x-auto` with `minWidth: 560px`; scrolls horizontally on 375px instead of clipping | `frontend/src/pages/Pricing.jsx` |
| 2 | **`.env.save` untracked from git** — `git rm --cached backend/.env.save`. File only had non-sensitive config (algorithm/expiry) | `.gitignore`, git index |
| 3 | **`.gitignore` hardened** — added `.env.save` and `*.env*` patterns | `.gitignore` |
| 4 | **FastAPI docs disabled in production** — `/docs` and `/redoc` now only available when `DEBUG=true` env var is set | `backend/main.py` |
| 5 | **React Router v7 future flags** — suppresses browser console warnings about upcoming v7 breaking changes | `frontend/src/App.jsx` |
| 6 | **`datetime.utcnow()` deprecation** — replaced with `datetime.now(timezone.utc)`, compatible with Python 3.12+ | `backend/auth.py` |

---

## PART 3 — SHOULD FIX SOON (post-handoff)

| # | Finding | File |
|---|---------|------|
| M1 | No rate limiting on `POST /api/auth/login` — brute-force unrestricted | `backend/routes/auth_routes.py:17` |
| M2 | `tlsAllowInvalidCertificates=True` disables TLS verification on MongoDB connection | `backend/database.py:9` |
| M3 | JWT stored in `localStorage` (XSS-accessible) — acceptable risk for single-admin | `frontend/src/pages/OwnerLogin.jsx:27` |
| M4 | Dashboard fetch calls have no try/catch — blank UI on API failure / Render cold start | `frontend/src/dashboard/Dashboard.jsx:39-42` |
| M5 | Password change endpoint doesn't invalidate existing JWTs | `backend/routes/auth_routes.py:25-37` |
| M6 | No keep-alive ping for Render free tier — 30-60s cold start after 15min idle | Render config |

---

## PART 4 — NICE TO HAVE

- Gallery lightbox arrow keys only work when overlay div has focus — use `document.addEventListener` instead (`Gallery.jsx:88`)
- `key={cls.name}` on program lists should use `cls._id` when API data is present (`Home.jsx:415`, `Classes.jsx:122`)
- `passlib`/`bcrypt` in `requirements.txt` are dead dependencies — clean up when fixing C4
- 24-hour JWT with no refresh — consider shortening to 1-2 hours
- Gallery lightbox close/nav buttons missing `aria-label` for screen readers (`Gallery.jsx:93,96,105`)

---

## PART 5 — CONFIRMED SAFE

- `.env` is NOT committed to git (`git ls-files backend/.env` returns nothing)
- `.env.save` only contained non-sensitive config — no credentials were ever in git
- All write/mutate API endpoints protected by `Depends(get_current_user)` — verified
- No `console.log` statements in frontend — no token/data leaks to browser console
- No hardcoded API keys or secrets in frontend code
- Build: `✓ built in 996ms`, zero errors, zero warnings (226.99 kB JS / 19.37 kB CSS)
- All internal routes valid, all nav links match defined routes
- All images referenced in JSX exist in `/public/images/`
- All `fetch()` calls use `import.meta.env.VITE_API_URL` — no hardcoded URLs
- No TODO, FIXME, lorem ipsum, or placeholder test data in any source file
- All frontend dependencies used; no unused runtime packages
- `vercel.json` SPA rewrite rule is correct
- `render.yaml` start command and env var config is correct
- Full auth flow confirmed: Login → JWT stored → Bearer header → backend validates → Dashboard access

---

## 20-MINUTE PRE-HANDOFF CHECKLIST

- [ ] Log into dashboard → Account Settings → change admin password (C1)
- [ ] Rotate MongoDB Atlas DB user password in Atlas UI → update `MONGO_URI` in Render (C2)
- [ ] Generate new JWT secret (`openssl rand -hex 32`) → update `JWT_SECRET` in Render (C3)
- [ ] Verify `VITE_API_URL` is set to production Render URL in Vercel dashboard (C5)
- [ ] Restrict CORS in `backend/main.py` to Vercel production domain (C6)
- [ ] (Recommended) Upgrade password hashing to bcrypt (C4)

Once all boxes are checked: **Ready for client handoff.**
