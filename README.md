# Coy Discover

A swipe-based **Discover** tab built as a standalone app for the Coy SDE Intern assignment. Users swipe right to like and left to pass. A match happens only when both people have liked each other, and nobody is ever told who liked them unless it is mutual.

---

Experience Summary:

I went through the full flow: phone OTP login, adding a crush, email verification, the invite link, and the extra-slots screen. The core idea is clear and simple: add a crush privately, and nothing is revealed unless it is mutual. Two things stood out. A crush only matters if the other person is also on Coy, and crush slots are limited, so each one is valuable. My two suggestions come from these two points.

Feature 1: Anonymous reminder for crushes who haven’t joined

What: If a user adds a crush who has not joined Coy yet, the app can send that person an anonymous message after a few days, such as “Someone has added you on Coy. Join to find out if it’s mutual.” The message never says who it is from. The user can turn this on or off and choose how often it is sent.

Why it is needed: A match is only possible when both people are on the app. After adding a crush and sharing the invite link, the user can only wait. If the crush never opens the link, the user’s effort leads nowhere and they are likely to stop using the app. An anonymous reminder helps convert crushes into active users without breaking the core promise of privacy, and it grows the user base, which makes matches more likely.

Feature 2: Pause, swap or remove a crush to free a slot

What: Let users pause or remove a crush at any time and reuse that slot for someone else, with a short cooldown so slots are not abused. Removed crushes should be deleted completely and never notified.

Why it is needed: Slots are limited, and feelings change. A user whose crush has moved on, or who never joined, is stuck with a wasted slot unless they pay for more. Letting them free and reuse a slot makes the limit feel fair instead of punishing. It also builds trust, because users know they stay in control of who they have added, which makes them more willing to add crushes in the first place.
---

## Part B: Discover Tab

### Features
- **Mobile-first UI** with a bottom tab bar: a blank **Home** placeholder, the **Discover** tab, and a **Matches** tab.
- **Swipe cards:** drag left/right with touch or mouse, or use the Pass / Like buttons on desktop. Cards rotate as you drag, show LIKE / NOPE stamps, and fly out of view on release.
- **"It's a match!" screen** shown the moment a mutual like happens.
- **Matches view** listing all mutual matches.
- **Empty state** when there are no profiles left.
- **Persistence:** swipes and matches survive page reloads.

### Tech Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) with React |
| Backend | Next.js API routes (Node.js) |
| Data | JSON file (`data/db.json`), created automatically on first run |
| Auth | None. A single logged-in user is assumed. |

### Seed Data
- 30 mock profiles, each with name, age, photo (placeholder image), short bio, city or college, and three interests.
- Every third profile has **already liked the logged-in user**, so matches can be demonstrated quickly. Liking any of profiles with ID 3, 6, 9, 12, ... produces a match.

---

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/feed` | Returns profiles the user has not yet swiped on. |
| `POST` | `/swipe` | Records a like or pass. Body: `{ "profileId": 3, "direction": "like" }`. Returns `{ "match": true/false, "profile": {...} }`. The profile is included only when it is a match. |
| `GET` | `/matches` | Returns all mutual matches. |

`/feed`, `/swipe` and `/matches` are rewritten to the Next.js routes under `/api/...`.

**Validation and edge cases**
- `direction` must be `"like"` or `"pass"`, otherwise `400`.
- Unknown `profileId` returns `404`.
- Swiping the same profile twice is ignored (idempotent), so a swipe can never be changed or re-trigger a match.

---

## How the Privacy Promise Is Enforced

1. The list of people who already liked the user is stored **server-side only**. It is never returned by `/feed`, `/swipe` or `/matches`.
2. `/feed` returns profile data only (no "likes you" flag), so the client cannot tell who liked the user.
3. `/swipe` returns a profile in its response only when `match` is `true`.
4. A match is created only when **both** sides have liked: the user's like plus an existing like from that profile.
5. Passed or liked profiles are removed from the feed permanently.

---

## Getting Started

**Requirements:** Node.js 18 or newer and npm.

```bash
git clone <your-repo-url>
cd coy-discover
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For drag gestures, use mobile view in browser developer tools (`F12`, then `Ctrl + Shift + M`).

**Reset demo data:** stop the server, delete `data/db.json`, and start again.

---

## Project Structure

```
coy-discover/
├── app/
│   ├── api/
│   │   ├── feed/route.js       GET /feed
│   │   ├── swipe/route.js      POST /swipe
│   │   └── matches/route.js    GET /matches
│   ├── layout.js
│   ├── globals.css
│   └── page.js                 Tab bar (Home, Discover, Matches)
├── components/
│   ├── Discover.js             Swipe cards, gestures, match screen
│   └── Matches.js              Matches list
├── lib/db.js                   Seed data and JSON persistence
├── data/db.json                Generated on first run (git-ignored)
├── next.config.mjs              Rewrites for /feed, /swipe, /matches
└── package.json
```

---

## Notes and Limitations
- Single-user demo; no real authentication.
- A JSON file is used for simplicity. It persists locally but will not persist on serverless hosts such as Vercel, so run the project locally. For production, replace `lib/db.js` with SQLite or PostgreSQL.
- Profile photos are placeholder images and need an internet connection.
