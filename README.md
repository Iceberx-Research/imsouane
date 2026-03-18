# imsouane.app

The digital village square for [Imsouane](https://en.wikipedia.org/wiki/Imsouane), Morocco — home of the longest right-hander in Africa, cheap tagines, and camels that don't give a damn.

A community platform where surfers, locals, and travelers can connect, find services, share info, and keep the Imsouane spirit alive online.

**Live at [imsouane.app](https://imsouane.app)**

---

## What is this

- **Community forum** — like Reddit but for one village. Pick a nickname, post, comment, upvote. No sign-up, no email, no bullshit.
- **Service marketplace** — need a ride to Agadir airport? Surf lessons? A room? Post it or find it here.
- **Surf talk** — forecasts, conditions, rip current warnings, session reports.

That's it. Simple on purpose.

---

## Tech stack

| What | With what |
|------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS |
| Build | Vite |
| Database | Supabase (PostgreSQL + Realtime + Storage) |
| State | React Query (TanStack Query) |
| Auth | None. Device fingerprint + nicknames. Like the old internet. |
| Routing | React Router v7 |

---

## Run it locally

```bash
git clone https://github.com/Iceberx-Research/imsouane.git
cd imsouane
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're in the village.

---

## Open Source — yes, fully

This project is **open source** under the [MIT License](LICENSE).

Anyone can fork it, improve it, break it, fix it, and send a pull request.

---

## Contributing

Want to help? Amazing. Here's how:

1. **Fork the repo**
2. **Create a branch** — `git checkout -b fix/something-cool`
3. **Make your changes**
4. **Open a Pull Request** — describe what you did and why
5. **Wait for review** — we'll check it out, give feedback, merge it

### The one rule

> **Be good, brother. Do not do bad shit here.**

That's it. That's the whole contributing guideline.

But to be a bit more specific:

- Fix bugs, improve UI, add translations, optimize performance
- Suggest features that help the Imsouane community
- Improve accessibility so everyone can use it
- Don't add trackers, ads, or anything that exploits users
- Don't break things on purpose
- Don't be weird about people's data

If you're unsure about something, open an issue first and let's talk about it.

---

## Project structure

```
imsouane/
├── src/
│   ├── components/
│   │   ├── Avatar.tsx            # Deterministic emoji avatars
│   │   ├── CamelMascot.tsx       # SVG camel mascot
│   │   ├── Layout.tsx            # App shell with navigation
│   │   └── NicknameModal.tsx     # Nickname registration
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Feed.tsx              # Community feed with infinite scroll
│   │   ├── Services.tsx          # Service marketplace
│   │   ├── PostDetail.tsx        # Post + comments
│   │   └── NewPost.tsx           # Create post with file upload
│   ├── lib/
│   │   ├── api.ts                # Supabase queries & mutations
│   │   ├── hooks.ts              # React Query hooks
│   │   ├── store.ts              # Types, tags, colors
│   │   ├── fingerprint.ts        # Device identification
│   │   ├── nickname.tsx          # Nickname context
│   │   ├── realtime.ts           # WebSocket subscriptions
│   │   └── supabase.ts           # Supabase client
│   └── App.tsx
├── supabase/
│   ├── migrations/               # Database schema
│   └── seed.sql                  # Sample data
└── ...
```

---

## Database

Supabase Postgres with Realtime enabled. No auth — anonymous access with Row Level Security.

**Tables:**
- `devices` — fingerprint-based identity with nicknames
- `posts` — forum posts with tags (surf, question, for_sale, lost_found, event, general, service)
- `comments` — linked to posts
- `votes` — upvotes with device dedup
- `rate_limits` — spam prevention

See [`supabase/migrations/`](supabase/migrations/) for the full schema.

---

## Why open source

Imsouane is a village. It belongs to the people who live there, surf there, and pass through. This website should be the same — built by the community, for the community. No corporate ownership, no paywalls, no data harvesting.

If this code is useful for your own village, beach town, or community — take it, use it, make it yours. That's the whole point.

---

## License

MIT — do whatever you want with it. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Made with love in Imsouane</strong><br>
  <a href="https://imsouane.app">imsouane.app</a>
</p>
