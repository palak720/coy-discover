# Coy Discover

A swipe-based **Discover** tab built as a standalone app for the Coy SDE Intern assignment. Users swipe right to like and left to pass. A match happens only when both people have liked each other, and nobody is ever told who liked them unless it is mutual.

---

## Part A: Two Core Feature Suggestions

### 1. Match notification with a time-limited conversation starter
**What:** When two people match, both receive a notification and a short prompt such as "You matched with Riya. Say hi within 48 hours." A suggested opener (based on shared interests) can be tapped to send.

**Why it is needed:** Coy's value is the moment of mutual reveal. Right now that moment ends the experience: the match appears, but nothing guides the next step. Many matches in dating-style apps go silent because neither person wants to message first. A soft deadline and a ready-made opener turns a reveal into an actual conversation, which raises retention and shows users the product leads somewhere.

### 2. Privacy controls for each crush (pause, withdraw, and hide from contacts)
**What:** Let users pause or withdraw a crush at any time, and let them hide themselves from specific people, for example anyone in their phone contacts or college.

**Why it is needed:** The whole product depends on trust that nothing leaks. Users add a crush only if they are sure it stays private and reversible. Giving them control (undo a crush, avoid certain people) lowers the fear of adding someone, which should increase the number of crushes added per user and the number of matches.

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
├── next.config.js              Rewrites for /feed, /swipe, /matches
└── package.json
```

---

## Notes and Limitations
- Single-user demo; no real authentication.
- A JSON file is used for simplicity. It persists locally but will not persist on serverless hosts such as Vercel, so run the project locally. For production, replace `lib/db.js` with SQLite or PostgreSQL.
- Profile photos are placeholder images and need an internet connection.