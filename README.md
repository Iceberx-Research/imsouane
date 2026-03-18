# 🐪 imsouane.app

The digital village square for [Imsouane](https://en.wikipedia.org/wiki/Imsouane), Morocco — home of the longest right-hander in Africa, cheap tagines, and camels that don't give a damn.

A community platform where surfers, locals, and travelers can connect, find services, share info, and keep the Imsouane spirit alive online.

**🌊 Live at [imsouane.app](https://imsouane.app)**

---

## What is this

- **Community forum** — like Reddit but for one village. Pick a nickname, post, comment, upvote. No sign-up, no email, no bullshit.
- **Service marketplace** — need a ride to Agadir airport? Surf lessons? A room? Post it or find it here.
- **Village info** — map, how to get here, surf seasons, the basics.

That's it. Simple on purpose.

---

## Tech stack

| What | With what |
|------|-----------|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | Supabase (Postgres + Realtime) |
| Auth | None. Nicknames + cookies. Like the old internet. |
| Map | Mapy.cz embed |
| Hosting | Vercel / Railway |
| Vibes | 🇲🇦🐪🌊 |

---

## Run it locally

```bash
git clone https://github.com/YOUR_USERNAME/imsouane-app.git
cd imsouane-app
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're in the village.

---

## Open Source — yes, fully

This project is **open source** under the [MIT License](LICENSE).

Anyone can fork it, improve it, break it, fix it, and send a pull request. All changes go through review before merging — not because we don't trust you, but because we want to keep the thing working for the people who actually use it in the village.

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

- ✅ Fix bugs, improve UI, add translations, optimize performance
- ✅ Suggest features that help the Imsouane community
- ✅ Improve accessibility so everyone can use it
- ✅ Add documentation or clean up code
- ❌ Don't add trackers, ads, or anything that exploits users
- ❌ Don't break things on purpose
- ❌ Don't be weird about people's data
- ❌ Don't submit AI-generated spam PRs — we will know, and the camel will judge you

If you're unsure about something, open an issue first and let's talk about it.

---

## Project structure

```
imsouane-app/
├── app/
│   ├── page.tsx              # Landing page (hero, map, nav cards)
│   ├── community/
│   │   └── page.tsx          # Forum — posts, comments, upvotes
│   ├── services/
│   │   └── page.tsx          # Service marketplace
│   └── about/
│       └── page.tsx          # Info about Imsouane
├── components/
│   ├── PostCard.tsx
│   ├── ServiceCard.tsx
│   ├── NicknameModal.tsx
│   ├── MapEmbed.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts
├── public/
│   ├── camel.svg             # 🐪
│   └── ...
└── ...
```

---

## Database

Supabase Postgres with Realtime enabled. No auth — anonymous access with Row Level Security.

**Tables:**
- `posts` — forum posts with tags (surf, question, housing, transport, events, general)
- `comments` — one level deep, linked to posts
- `votes` — upvotes with browser fingerprint dedup
- `services` — marketplace listings, auto-expire after 30 days

See [`database/schema.sql`](database/schema.sql) for the full schema.

---

## Roadmap

- [x] Landing page with map and camel
- [ ] Community forum with realtime updates
- [ ] Service marketplace
- [ ] About page
- [ ] Mobile bottom navigation
- [ ] Dark mode ("Night in the Medina")
- [ ] Language toggle (EN / FR / Darija)
- [ ] Surf conditions widget
- [ ] PWA + push notifications
- [ ] Local business directory with map pins

Want to tackle something? Grab an issue or open one.

---

## Why open source

Imsouane is a village. It belongs to the people who live there, surf there, and pass through. This website should be the same — built by the community, for the community. No corporate ownership, no paywalls, no data harvesting.

If this code is useful for your own village, beach town, or community — take it, use it, make it yours. That's the whole point.

---

## Credits

- Built by [Kamil](https://github.com/YOUR_USERNAME) from a café somewhere in Morocco
- Inspired by the village itself — the fishermen, the surfers, the tagine shops, and the one camel that's always just standing there
- Powered by [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Tailwind CSS](https://tailwindcss.com), and too much mint tea

---

## License

MIT — do whatever you want with it. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Made with 🐪 in Imsouane</strong><br>
  <a href="https://imsouane.app">imsouane.app</a> · <a href="https://reddit.com/r/Imsouane">r/Imsouane</a>
</p>
