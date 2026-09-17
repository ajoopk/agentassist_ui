# Agent Assist AutoQA — front-end prototype

A working front end for the AutoQA admin, built from the **Rewamp** section of the Figma file
`Agent Assist AutoQA Admin` (`PXgLWAKnbOMIQR5Y6w9225`), page **AutoQA**.

Everything runs on local fixtures. No backend is required to run it, and no backend calls are made.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dist/ — normal build
SINGLE=1 npm run build   # dist-single/index.html — one self-contained file, for sharing
```

Node 18+. Stack: React 18, TypeScript, Vite, Tailwind CSS 3, React Router 6 (hash router, so the
single-file build works from `file://` and from any static host without rewrite rules).

---

## Where to start reading

```
src/
  data/types.ts        the domain model — this is the API contract
  data/api.ts          the seam. Every screen calls only these functions
  data/fixtures.ts     the sample data behind them
  components/ui/       design system primitives (Button, Badge, Table, Dialog, Tabs…)
  components/app/      the app shell: navy rail, page header
  screens/             one file per screen
```

**To wire up the real backend, edit `src/data/api.ts` and nothing else.** Each function has its
suggested endpoint in a comment above it, returns a typed promise, and is already async. Replace the
body with a `fetch` and the screens keep working. `LATENCY_MS` at the top of that file fakes a round
trip so loading states are visible — set it to `0` to make the prototype feel instant.

---

## Screen map

| Route | Figma frame (Rewamp) |
|---|---|
| `/login` | 01_Login |
| `/otp` | 01_OTP |
| `/calls` | 02 — Calls Expanded list |
| `/calls/:callId` | 03 — Calls Details Transcript **and** 04 — Coaching summary (one screen, two tabs) |
| `/agent-performance` | 05 — Agent Performance |
| `/agent-performance/:agentId` | 06 — Agent Performance detail |
| `/guideline-performance` | 07 and 08 — Guideline Performance (collapsed and expanded row) |
| `/guideline-performance/:guidelineId` | 09 — Review guideline detail |
| `/guidelines` | 09 — Create and Manage Guidelines, plus the 10 — New checklist and 11 — New guideline dialogs |
| `/agents` | 12 — Agents |
| `/dashboard` | not designed — placeholder so the nav item resolves |

14 frames map to 10 routes because the transcript and coaching summary are tab states of one screen,
the two guideline-performance frames are row states of one screen, and the two "new" frames are
dialogs opened from the guidelines screen.

---

## What actually works

- **Auth flow.** Login validates the email, goes to OTP, OTP accepts any 6 digits and lands on Calls.
  The resend timer counts down.
- **Calls.** Search filters by agent name or ID, the risk and score selects filter, rows expand to the
  checklist breakdown, pagination is wired, Review opens the call.
- **Call detail.** Tabs switch transcript and coaching summary, segment tabs switch, guideline rows
  expand, the audio player plays with a moving playhead and the waveform inks as it goes. Click the
  waveform to scrub.
- **Agent performance.** Search filters; rows and the Review button open the detail screen.
- **Guideline performance.** Search filters, rows expand to the evidence panel, Review opens the
  review screen.
- **Review guideline.** Edit rewrites the proposed instruction inline; Apply and Dismiss resolve the
  screen and show the outcome.
- **Guidelines.** Switching checklist in the left panel loads that checklist's guidelines. Both
  dialogs validate, create, and push the result into the list for the session.
- **Agents.** Search filters across name, ID and email.

State is in-memory only. A refresh resets everything.

---

## Design system notes for implementers

Tokens live in `tailwind.config.js` and come straight from the **Design System AQA** page.

| Token | Value | Use |
|---|---|---|
| `ink` | `#09090B` | primary text |
| `muted` | `#71717A` | secondary text, table headers |
| `line` | `#E4E4E7` | borders, rules |
| `subtle` | `#F4F4F5` | filled cards, table header strips, expanded rows |
| `primary` / `primary-fg` | `#18181B` / `#FAFAFA` | the one filled button per screen |
| `destructive` | `#EF4343` | failures only |
| `rail` family | `#15203B`, `#25365F`, `#B5D2F3`, `#203363` | the navy app chrome |

Radius 6 (cards 8, badges full). Inter only. Card shadow `0 1px 2px rgb(0 0 0 / 0.05)`.

Two rules that are easy to lose in implementation:

1. **The kit has no green and no warning colour.** State is carried by badge variant plus label, never
   by hue alone. Pass / Positive / Enabled / Active are all the neutral `secondary` badge.
2. **One red per row.** On a failing row only the Critical badge is destructive; the missed count and
   score stay neutral ink. Three reds on one row stops meaning anything.

---

## Known gaps and things to decide

- **No success or warning token.** Three places lost information translating from the product's
  original colours: coaching-priority severity dots (now numbered ranks), the segment bars (now
  neutral vs destructive against a threshold), and Positive / Enabled states (now grey). If the team
  wants those distinctions back, the design system needs a success and a warning colour first.
- **"Insufficient data"** on Guideline Performance is shown on rows with 231 calls at 17% adherence.
  The label describes the input while the number describes the output. Backend needs to say what that
  state actually computes before the copy is fixed.
- **Evidence arithmetic.** The review screen says the patterns explain *18 of 18* critical misses,
  computed from the fixture (12 + 6). The Figma frame says 16 of 18. One of the two is wrong; the
  numbers in the design don't add up.
- **Team Dashboard** has no design.
- **Not built:** real auth, permissions and roles, server pagination beyond the fixture page size,
  sorting, bulk actions, empty and error states beyond a single "no results" message, responsive
  layout below ~1280px. The screens are laid out for a desktop QA console, as the designs are.
- **Accessibility** is decent but not audited: focus rings, dialog escape and focus, labelled inputs,
  semantic tables. Keyboard traversal of the expanding table rows needs a pass before production.
