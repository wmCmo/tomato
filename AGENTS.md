# AGENTS.md

## Things that will trip you up

> I wrote this repo by hand entirely as a practice. There are things that definitely aren't conventional here.

- `[userId]` accepts either `@handle` or a UUID.
- A room's ID is the host's profile ID, so each user has exactly one room.
- In `index.css`, `--foreground` is actually a chip/surface background and --accent is the text color.
- Every page under `/main` is `'use client'`, and the only server code is `generateMetadata` in the layouts. That's why crawlers only see what the layouts produce.
- `dict.home.nav.header` doubles as a title suffix (`| のトマト`).
