---
title: "refactor: Portfolio polish — types, components, UI, English-only"
type: refactor
status: active
date: 2026-04-24
---

# refactor: Portfolio polish — types, components, UI, English-only

## Overview

Rework `ai-support-agent-v1` so it reads as a polished portfolio piece for an AI Engineer audience. Current state is functional but scrappy: empty scaffold folders, types co-located with stores, a 240-line `ChatWindow`, a bare home page, mixed Spanish/English copy, default Next.js metadata, and no `.env.example`. After this refactor:

- Source tree contains only folders that are actually used.
- All shared types live in one place (`shared/types/`).
- Pages that mix many concerns are split into focused components.
- The home page showcases AI techniques (streaming, tool calling, file analysis, cost tracking) in the same voice as the Task Manager AI portfolio project — table-driven, calm, opinionated.
- Every user-facing string, system prompt, and code comment is in English.
- README and `AGENTS.md` match the portfolio voice; `.env.example` documents required env.

No behavior changes, no new features, no provider/model swaps.

---

## Problem Frame

The repo started from `create-next-app` and grew sprint-by-sprint. Artifacts of that growth:

- **Dead scaffolding.** `app/tickets/`, `features/chat/hooks/`, `features/tickets/components/` are empty placeholders.
- **Types scattered.** `Ticket`, `UsageRecord`, `UsageStore`, `TicketStore`, message-priority unions live next to the code that produces them. Nothing imports them as a contract; consumers re-declare narrowed shapes inline.
- **Crowded `ChatWindow`.** One file owns header, message list, bubble rendering, tool-call state, file preview, composer, loading dots, and submit logic.
- **Bare home page.** The home route is a centered "Open chat" link — fine for a demo, weak for a portfolio piece that should advertise the AI techniques on display.
- **Mixed language.** UI strings, system prompts, and comments are mostly Spanish. Comments include sprint-history notes ("Sprint 2 lo reemplaza", "Misma técnica que task-manager-ai") that don't belong in shipped code.
- **Default metadata and missing env example.** `<title>Create Next App</title>` and no `.env.example` make first-run setup awkward.
- **`AGENTS.md` only carries the Next.js-version warning.** It should also document the project conventions an agent or contributor needs to respect.

The README provided as reference (Task Manager AI) sets the target voice: a Techniques table that maps each AI capability to "where to look" in the code, a Stack table, a small architecture diagram, and a tight Setup section.

---

## Requirements Trace

- R1. The repo contains no empty/unused directories under `app/`, `features/`, or `shared/`.
- R2. All exported types/interfaces shared by more than one module live under `shared/types/` and are imported from there.
- R3. `features/chat/components/ChatWindow.tsx` is decomposed so no single component file mixes more than one concern (rendering messages, composing input, previewing files, etc.).
- R4. The home page (`app/page.tsx`) presents the project as a portfolio piece — at minimum a hero, an "AI techniques demonstrated" table, a stack table, and a CTA into `/chat`.
- R5. All user-facing strings (UI copy, button labels, placeholders, empty states, system prompts, error messages) are in English.
- R6. Code comments are in English, and only remain when they explain non-obvious *why*. Sprint history, AI-tooling references, and restate-the-code comments are removed.
- R7. `.env.example` exists at the repo root and documents `ANTHROPIC_API_KEY` (and any other env the code reads).
- R8. `app/layout.tsx` exposes accurate `metadata` (title + description) for the project.
- R9. `README.md` follows the reference portfolio format: hero, Techniques table, Stack table, Architecture diagram, Setup, Scripts, Project layout, Environment variables.
- R10. `AGENTS.md` documents project conventions a contributor or agent must respect (folder boundaries, where types live, the two-SDK split, English-only rule), in addition to the existing Next.js-version warning.
- R11. No file or doc explicitly states the project was built with AI assistance.

---

## Scope Boundaries

- No replacement of the in-memory ticket store with a database. The README's existing "Roadmap" already lists Supabase migration as future work.
- No swap of the keyword `searchKnowledge` for RAG/embeddings.
- No new feature work (auth, per-user cost tracking, extended thinking, etc.).
- No model or provider swap. Vercel AI SDK + `@ai-sdk/anthropic` for chat, `@anthropic-ai/sdk` for file analysis stays.
- No test suite introduction. The project has no tests today; adding one is out of scope for a UI/structure polish pass.
- No CI/CD, deployment config, or analytics work.
- No license file work unless trivially aligned with the reference README's `## License` section.

---

## Context & Research

### Relevant Code and Patterns

- `app/page.tsx` — current home, replaces in U5.
- `app/layout.tsx` — needs metadata + lang change (R8).
- `app/globals.css` — Tailwind 4 `@theme inline` block. Brand tokens go here if introduced in U5.
- `app/chat/page.tsx` — thin wrapper, leave as is.
- `app/api/chat/route.ts` — system prompt and tool descriptions are currently Spanish (R5/R6 target).
- `app/api/analyze/route.ts` — system prompt currently Spanish (R5).
- `app/api/usage/route.ts` — fine, no copy.
- `features/chat/components/ChatWindow.tsx` — split target in U4.
- `features/knowledge-base/search.ts` — keep keyword approach; only translate comments and KB-not-found message (R5/R6).
- `features/knowledge-base/data/product.md` — content is product KB; if Spanish, translate (R5).
- `features/tickets/store.ts` — extract `Ticket`, `TicketStore` types to `shared/types/` (R2). Seed-data subjects/descriptions translate to English (R5).
- `shared/lib/anthropic.ts`, `shared/lib/cost.ts`, `shared/lib/usage-tracker.ts` — translate comments, extract `UsageRecord`/`UsageStore`/`ModelPricing` types to `shared/types/` (R2/R6).

### Reference style

- The Task Manager AI README sample provided in the request is the voice/format target for U6. Match the Techniques table, Stack table, Architecture ASCII diagram, Setup, Scripts, Project layout, Environment variables section, License footer.

### Institutional Learnings

None recorded for this repo. The README's "Why two SDKs?" note already documents the one architectural choice worth preserving.

---

## Key Technical Decisions

- **Types live under `shared/types/` grouped by domain, not in one omnibus `types.ts`.** Files: `shared/types/ticket.ts`, `shared/types/usage.ts`, `shared/types/chat.ts` (only if the `ChatWindow` split surfaces shared message-part shapes worth naming). Rationale: keeps imports specific and avoids a barrel that grows into a dumping ground. A single `index.ts` re-export is fine but optional.
- **`ChatWindow` becomes a thin orchestrator that owns hooks/state.** Presentational pieces (`ChatHeader`, `MessageList`, `MessageBubble`, `ToolCallIndicator`, `FilePreview`, `ChatComposer`, `TypingDots`, `EmptyState`) are sibling files in `features/chat/components/`. The submit handler — the only non-trivial logic — stays in `ChatWindow` because moving it into a hook for one caller is premature abstraction.
- **Home page is a Server Component, no client JS.** Pure presentation. No interactivity beyond `<Link>`s.
- **Brand palette stays neutral + a single accent.** The current accent is blue. The reference portfolio uses orange. Pick one accent and apply consistently via Tailwind tokens in `globals.css`. The plan does not mandate a specific color — implementer picks blue (current) or orange (matches reference portfolio) and applies it throughout. Whichever is chosen, the `bg-blue-600` literals across components migrate to a single token.
- **No barrel `index.ts` for the `features/chat/components/` split.** Each component imports its siblings directly. Avoids the import-tree noise that barrels create in App Router.
- **Translation is done in-place, not behind an i18n framework.** Adding `next-intl` for a portfolio demo is overkill; the project is single-language by design.
- **Comments policy.** Default to no comments. Keep a comment only when it explains a non-obvious *why* (e.g., "fire-and-forget so streaming isn't blocked"). Remove sprint-history references, "same technique as project X" notes, and restate-the-code lines.

---

## Open Questions

### Resolved During Planning

- **Where do types live?** `shared/types/<domain>.ts`. Decided above.
- **Brand color?** Implementer's call between current blue and portfolio-orange. Both satisfy R4.
- **Should the home page link to `/api/usage`?** No — `/api/usage` returns JSON for the README's mention of cost tracking; it isn't a user-facing dashboard. Out of scope.
- **Translate `product.md` KB content?** Yes (R5). The chat agent quotes it back to users; mixed-language quotes look broken.

### Deferred to Implementation

- Whether to introduce a `shared/types/index.ts` barrel — depends on import ergonomics once domain files exist.
- Exact component split granularity inside `ChatWindow` — the named components above are the target, but the implementer may merge two if one ends up trivial (e.g., `EmptyState` could stay inline if it's three lines after translation).
- Whether `app/layout.tsx` needs an `<html lang="en">` change beyond metadata (it currently is `lang="en"` already — verify and leave alone if so).

---

## Implementation Units

- [ ] U1. **Remove dead scaffolding and add `.env.example`**

**Goal:** Bring the source tree to "only what's used" and make first-run setup self-documenting.

**Requirements:** R1, R7

**Dependencies:** None

**Files:**
- Delete: `app/tickets/` (empty), `features/chat/hooks/` (empty), `features/tickets/components/` (empty)
- Create: `.env.example`
- Verify: `app/api/chat/`, `app/chat/`, `features/chat/components/`, `features/tickets/store.ts`, `features/knowledge-base/data/`, `shared/components/`, `shared/lib/`, `shared/types/` are all referenced before keeping them. Delete any that are still empty after the rest of the refactor.

**Approach:**
- Grep for imports of each empty folder before deleting; the listed three are confirmed empty as of planning.
- `.env.example` lists every variable the code reads via `process.env`. Today: `ANTHROPIC_API_KEY`. Add a one-line comment per var explaining what it's for, no values.
- `shared/components/` is empty today; if U4/U5 don't add anything there, delete it in U7.

**Patterns to follow:**
- Mirror the reference README's `.env.example` style: bare `KEY=` lines, optional one-line comment above.

**Test scenarios:**
- Test expectation: none — pure file deletions and a static env template, no behavior to assert. `npm run build` and `npm run dev` succeed (verification below).

**Verification:**
- `npm run build` succeeds.
- `cp .env.example .env.local` then a dev run shows the existing `ANTHROPIC_API_KEY` slot is the only required value.
- `git status` shows the deleted folders are removed.

---

- [ ] U2. **Centralize shared types under `shared/types/`**

**Goal:** Make types a contract you import, not a shape you re-declare next to the data.

**Requirements:** R2

**Dependencies:** U1 (so `shared/types/` is the only types location post-refactor)

**Files:**
- Create: `shared/types/ticket.ts` — `Ticket`, `TicketPriority`, `TicketStatus`, `TicketStore`
- Create: `shared/types/usage.ts` — `UsageRecord`, `UsageStore`, `UsageSummary`, `ModelPricing`
- Modify: `features/tickets/store.ts` — import from `@/shared/types/ticket`, drop local interface declarations
- Modify: `shared/lib/usage-tracker.ts` — import from `@/shared/types/usage`
- Modify: `shared/lib/cost.ts` — import `ModelPricing` from `@/shared/types/usage`
- Modify: `app/api/chat/route.ts` — if it inlines a `ToolPriority` union (`'low' | 'medium' | 'high'`), replace with `TicketPriority` from `@/shared/types/ticket`

**Approach:**
- Move type declarations verbatim, then update imports. No behavior change; tsc is the lint.
- Export `TicketPriority` and `TicketStatus` as named string-literal unions so the `createTicket` tool's Zod enum and the store stay in sync (consider `z.enum(...)` constructed from a `const` array in `shared/types/ticket.ts` if it reduces duplication, but only if it doesn't pull Zod into a "types" file — if it does, keep the duplication and add a `// keep in sync with TicketPriority` comment).

**Patterns to follow:**
- Path alias `@/shared/types/...` — verify `tsconfig.json` `paths` already supports `@/*` (it does, based on existing imports like `@/features/...`).

**Test scenarios:**
- Test expectation: none — pure type relocation. Type-checked by `tsc --noEmit` via the build.

**Verification:**
- `npm run build` succeeds.
- `grep -R "interface Ticket\b" features shared` returns no matches outside `shared/types/`.

---

- [ ] U3. **Translate to English and prune comments**

**Goal:** One language across the entire codebase; comments only where the *why* is non-obvious.

**Requirements:** R5, R6, R11

**Dependencies:** U2 (so types renamed/moved aren't re-translated mid-flight)

**Files:**
- Modify: `app/api/chat/route.ts` — system prompt, tool `description` strings, the in-prompt rules list
- Modify: `app/api/analyze/route.ts` — system prompt, error message ("Formato no soportado…"), default question fallback
- Modify: `features/knowledge-base/search.ts` — comments and the "no encontré información" return string
- Modify: `features/knowledge-base/data/product.md` — translate KB content (the agent quotes this back to users)
- Modify: `features/tickets/store.ts` — translate seed-data `subject`/`description` fields and any comments
- Modify: `features/chat/components/ChatWindow.tsx` (or its split successors after U4 — coordinate ordering): all UI strings — header, suggestions, placeholders, "Analyzing file…", "New conversation", file-preview text, button labels
- Modify: `shared/lib/anthropic.ts`, `shared/lib/cost.ts`, `shared/lib/usage-tracker.ts` — comments only
- Modify: `app/layout.tsx` — `metadata.title` and `metadata.description` (R8 overlap)

**Approach:**
- Walk the file list once; translate strings and comments, delete comments that only restate the code or reference sprint history / other portfolio projects / AI tooling.
- Preserve technical comments that explain *why* (e.g., "fire-and-forget — does not block the stream" stays, translated).
- No mention of "Claude generated this", "AI-assisted", or similar (R11).
- Coordinate with U4: if U4 runs first, translate inside the new component files. If this unit runs first, translate in `ChatWindow.tsx` and U4 carries the translated copy into the splits.

**Patterns to follow:**
- The reference README's tone for system prompts: imperative, terse, no exclamation marks, no emoji in prompts.

**Test scenarios:**
- Happy path: `npm run dev`, open `/chat`, send "What plans do you offer?" — agent replies in English, citing the translated KB.
- Happy path: send "Show my tickets" — `getTickets` tool returns the seeded tickets with English subjects/descriptions.
- Happy path: attach a screenshot to the chat composer — `/api/analyze` returns an English analysis bubble.
- Edge case: send a message in Spanish — system prompt rule ("respond in the user's language") is preserved post-translation, so the agent replies in Spanish. Confirm the prompt rule survives translation.

**Verification:**
- `grep -RE "[áéíóúñ¿¡]" app features shared --include='*.ts' --include='*.tsx' --include='*.md'` returns no matches (allow exceptions only in `features/knowledge-base/data/product.md` if the implementer intentionally keeps a Spanish dictionary entry — none are expected).
- Smoke test the three flows above in the browser.

---

- [ ] U4. **Decompose `ChatWindow` into focused components**

**Goal:** No single chat component mixes more than one concern; `ChatWindow` becomes the orchestrator.

**Requirements:** R3

**Dependencies:** U2 (shared types are in place if message-part shapes need extracting)

**Files:**
- Create: `features/chat/components/ChatHeader.tsx` — avatar, title, "New conversation" reset button. Props: `{ hasMessages: boolean; onReset: () => void }`.
- Create: `features/chat/components/EmptyState.tsx` — welcome panel + suggestion chips. Props: `{ onPick: (text: string) => void }`.
- Create: `features/chat/components/MessageList.tsx` — scroll container + map over messages + auto-scroll ref. Props: `{ messages, isAnalyzing, isStreaming }`.
- Create: `features/chat/components/MessageBubble.tsx` — single message rendering, owns user-vs-assistant styling and the `parts.map` split.
- Create: `features/chat/components/ToolCallIndicator.tsx` — the "Consultando {toolName}…" pill currently inside `parts.map`.
- Create: `features/chat/components/TypingDots.tsx` — the three-dot streaming indicator.
- Create: `features/chat/components/FilePreview.tsx` — the attached-file strip above the composer. Props: `{ file: File; onClear: () => void }`.
- Create: `features/chat/components/ChatComposer.tsx` — file input + text input + submit button. Props: `{ input, onInputChange, file, onPickFile, onClearFile, onSubmit, isLoading, isAnalyzing }`.
- Modify: `features/chat/components/ChatWindow.tsx` — keep `useChat`, `handleSubmit`, `handleFileChange`, state for `input`/`file`/`analyzing`. Render the seven children above.

**Approach:**
- The split is presentational: `ChatWindow` is the only client component that needs `useChat`, `useState`, `useRef`, `useEffect`. Children receive props and render.
- `MessageBubble` keeps the `parts` discrimination (text vs tool-call) but delegates the tool indicator to `ToolCallIndicator`.
- Do not introduce a context. Drilling props one level is fine and cheaper than a provider for this size.
- Keep file naming PascalCase to match the existing `ChatWindow.tsx` convention.
- All new components are client components (`'use client'`) only if they own state; pure presentational ones can be server components if it simplifies anything — implementer's call. Default to `'use client'` for the whole subtree to avoid serialization issues with `File` objects in `FilePreview`.

**Patterns to follow:**
- Existing Tailwind class strings in `ChatWindow.tsx` carry over verbatim; only the brand color tokens get refactored once U5 lands. If U5 lands first, use the new tokens here directly.

**Test scenarios:**
- Happy path: empty chat shows `EmptyState` with three English suggestion chips; clicking a chip calls `sendMessage` with that text.
- Happy path: after the user sends a text-only message, `MessageBubble` renders the user (right, accent bg) and assistant (left, white bg) bubbles with text.
- Happy path: while the agent is calling a tool, `ToolCallIndicator` shows the spinning gear + tool name; after the tool returns, the indicator switches to the ✅ state.
- Happy path: streaming response shows `TypingDots` until the first text chunk arrives, then transitions cleanly to the assistant bubble.
- Happy path: attaching a file populates `FilePreview` above the composer; the ✕ clears `file` state.
- Edge case: submitting with both empty `input` and no `file` is a no-op (button disabled or `handleSubmit` early-returns).
- Edge case: submitting while `isLoading` is true is a no-op.
- Integration: file-only submit (no text) sends to `/api/analyze` only — no `/api/chat` call. Verify in the Network tab.
- Integration: text-only submit sends to `/api/chat` only.

**Verification:**
- `ChatWindow.tsx` is < 80 lines and contains no JSX deeper than two levels.
- Each new component file is single-concern and < 60 lines.
- All five smoke-test paths above pass in the browser.

---

- [ ] U5. **Redesign the home page as a portfolio showcase**

**Goal:** The home page reads like a portfolio piece: it tells a recruiter what AI techniques are demonstrated and where to find them in the code, and offers a clear CTA into the live chat.

**Requirements:** R4, R5, R8

**Dependencies:** U3 (English copy ready), U2 (no shared types are needed but consistent state)

**Files:**
- Modify: `app/page.tsx` — full rewrite. Server Component. Sections:
  1. **Hero** — project name, one-sentence positioning ("A production-style support agent that showcases the LLM patterns I reach for: streaming, tool-calling, file analysis, and cost tracking."), portfolio attribution ("Portfolio project — Julian Lopez · AI Engineer"), primary CTA `Open chat →` to `/chat`.
  2. **Techniques** — table mirroring the reference README: rows for Streaming chat, Tool calling, File analysis, Cost tracking + prompt caching. Columns: Technique / What it does here / Where to look (file paths).
  3. **Stack** — table: Framework (Next.js 16), AI — streaming/tools (Vercel AI SDK v6), AI — file analysis (`@anthropic-ai/sdk`), Model (Claude Haiku 4.5), Language (TypeScript 5), Styling (Tailwind 4).
  4. **Architecture** — small ASCII or simple Tailwind-styled diagram block showing Client → Route Handlers → AI SDK / Anthropic SDK → Anthropic API + in-memory store. Match the reference README's vibe; prose-light.
  5. **Footer / secondary CTA** — repeat the chat link.
- Modify: `app/layout.tsx` — set `metadata.title` to "TaskFlow AI Support Agent — Julian Lopez" (or similar) and `metadata.description` to the hero one-liner.
- Modify: `app/globals.css` — introduce `--color-accent` (and a darker hover variant) under `@theme inline`. Replace `bg-blue-600` / `hover:bg-blue-700` literals across `app/` and `features/chat/components/` with the token-backed utility.

**Approach:**
- Server Component, no `'use client'`, no client JS on the home page.
- Keep the page within the same content width as `/chat` (`max-w-2xl` or wider for two-column tables — `max-w-3xl` is a reasonable choice). Center on the page.
- Use Tailwind's typography defaults; do not pull in `@tailwindcss/typography` for one page.
- The Techniques table is the centerpiece — it is the artifact that signals "I know this domain". Use real file paths so a reviewer can click through.
- The brand color token is a refactor, not a redesign — picking blue or orange both pass R4. Document the choice in the commit message.

**Patterns to follow:**
- Reference README's table structure, terse sentence cadence, and "Built on Next.js 16 (App Router) with the Vercel AI SDK v6, …" framing.
- Existing rounded-2xl, soft-shadow vocabulary from `ChatWindow` for consistency.

**Test scenarios:**
- Happy path: load `/` — hero, two tables, architecture block, and CTA render. CTA navigates to `/chat`.
- Happy path: page is responsive — tables don't overflow on a 360px viewport (use horizontal scroll on `<table>` if needed, or stack rows on small screens).
- Happy path: View page source on `/` shows no `__next` client-component boundary for the home page (it's a Server Component).
- Edge case: dark mode (system preference) doesn't make text unreadable — verify against the existing `prefers-color-scheme: dark` block in `globals.css`. Either commit to light-only and remove the dark override, or apply matching dark variants in the new page.

**Verification:**
- Lighthouse "Best Practices" and "Accessibility" both ≥ 95 on `/` (run locally, no need to wire CI).
- All file paths cited in the Techniques table actually exist post-refactor.
- `grep -R "bg-blue-600" app features` returns no matches if the brand-token migration is done; or, if blue is kept, the literal is replaced with the token utility throughout.

---

- [ ] U6. **Rewrite `README.md` in the reference portfolio format**

**Goal:** README mirrors the Task Manager AI README's structure and voice, with content accurate to *this* project.

**Requirements:** R9, R11

**Dependencies:** U1 (`.env.example` exists), U2 (final type locations), U3 (final feature copy), U5 (final home-page positioning so the README hero matches)

**Files:**
- Modify: `README.md` — full rewrite. Sections, in order:
  1. Title + one-sentence positioning + "Built on Next.js 16 (App Router) with the Vercel AI SDK v6, the Anthropic SDK, and Tailwind v4."
  2. `> **Portfolio project** — Julian Lopez · AI Engineer`
  3. `## AI techniques demonstrated` — table: Streaming chat, Tool calling, File analysis (image + PDF), Cost tracking with prompt caching. "Where to look" columns reference the post-refactor file paths.
  4. `## Stack` — table.
  5. `## Architecture` — ASCII diagram. Reflect the actual flow: Client → Server Components / Client Components → Route Handlers → Vercel AI SDK (`streamText`, tools) + Anthropic SDK (`messages.create` for files) → Anthropic API; data layer is the in-memory ticket and KB stores.
  6. `## Setup` — `npm install`, `cp .env.example .env.local`, fill `ANTHROPIC_API_KEY`, `npm run dev`.
  7. `## Scripts` — `dev`, `build`, `start`, `lint`.
  8. `## Project layout` — tree of `app/`, `features/`, `shared/` matching the post-refactor state.
  9. `## Environment variables` — table; only `ANTHROPIC_API_KEY` is required today.
  10. `## Roadmap` — keep the existing four bullets, translate to English, drop sprint references.
  11. `## License` — MIT (one line) only if a `LICENSE` file is added or already implied; otherwise omit.

**Approach:**
- Rewrite, do not patch — the current README has structural mismatches that aren't worth surgical edits.
- No mention of AI assistance in authoring (R11). The "AI techniques demonstrated" header refers to runtime AI features, not to who wrote the code.
- Keep the "Why two SDKs?" callout as a short subsection or footnote under the Stack table — it's a real architectural choice that recruiters will ask about.

**Patterns to follow:**
- Reference README, verbatim section order and table formatting.

**Test scenarios:**
- Test expectation: none — documentation file. Render-check on GitHub-flavored markdown.

**Verification:**
- Every file path in the Techniques table and Project layout block exists after the refactor.
- `cp .env.example .env.local` followed by `npm install && npm run dev` works for a fresh clone (smoke test).

---

- [ ] U7. **Update `AGENTS.md` with project conventions**

**Goal:** A contributor (human or agent) reading `AGENTS.md` learns the conventions this refactor establishes, in addition to the existing Next.js-version warning.

**Requirements:** R10, R11

**Dependencies:** U1–U5 (so the conventions documented match the actual repo state)

**Files:**
- Modify: `AGENTS.md` — keep the `<!-- BEGIN:nextjs-agent-rules -->` block as-is. Add new sections beneath it.

**Approach:**

Sections to add (concise, imperative voice):

- **Folder boundaries.** `app/` is routing only — pages, layouts, route handlers. Feature logic lives in `features/<name>/`. Cross-feature primitives (clients, pricing, types, UI atoms) live in `shared/`. Route handlers never import from another route handler; they import from `features/` or `shared/`.
- **Where types live.** All shared types live in `shared/types/<domain>.ts`. Don't redeclare them in feature files; import them.
- **Two-SDK split.** Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`) for streaming chat and tool calling. `@anthropic-ai/sdk` for file analysis. Don't mix them in the same route.
- **Language.** All user-facing strings, system prompts, and code comments are English. The chat agent's system prompt instructs it to respond in the user's language — preserve that rule.
- **Comments policy.** Default to no comments. Keep one only when it explains a non-obvious *why*. No sprint-history notes, no cross-portfolio references, no "AI-assisted" markers.
- **Brand tokens.** Use `var(--color-accent)` / Tailwind token utilities, not raw color literals like `bg-blue-600`.

**Patterns to follow:**
- Reference README's terse cadence; one paragraph per rule, no bullet bloat.

**Test scenarios:**
- Test expectation: none — documentation file.

**Verification:**
- `AGENTS.md` length is < 80 lines.
- The Next.js-version warning is preserved verbatim inside the `BEGIN/END:nextjs-agent-rules` markers.

---

## System-Wide Impact

- **Interaction graph:** Translation in U3 touches the chat agent's system prompt. The "respond in the user's language" rule must survive translation; otherwise multilingual users get English-only replies.
- **Error propagation:** No new error paths. The `/api/analyze` 400 response message is translated in U3; clients don't currently parse the body, so the change is cosmetic.
- **State lifecycle risks:** None. The in-memory `globalThis` ticket and usage stores are untouched in shape; only the seed-data text changes.
- **API surface parity:** Public route surfaces (`/api/chat`, `/api/analyze`, `/api/usage`) are unchanged. Request/response shapes are unchanged.
- **Integration coverage:** The U4 component split is the only place where regressions are plausible — file-attached submits and tool-call rendering are the two flows to smoke-test in a browser.
- **Unchanged invariants:**
  - The `useChat` transport, the `setMessages` injection pattern for analysis bubbles, and the `result.usage.then(...)` cost-tracking shape all remain.
  - `searchKnowledge` continues to be a keyword splitter; no RAG.
  - The in-memory ticket and usage stores stay backed by `globalThis`.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Translating the chat system prompt drops the "respond in user's language" rule, breaking Spanish users | Keep the rule explicitly in U3's translation pass; smoke-test with one Spanish prompt before merging. |
| `ChatWindow` split (U4) regresses one of the loading states or the file-preview flow | Manual smoke-test of all five paths in U4's "Test scenarios" before merging. |
| Brand-token migration leaves stragglers (`bg-blue-600` hardcoded somewhere) | Final `grep` per U5's verification step. |
| The KB markdown gets translated incorrectly, breaking `searchKnowledge` keyword matches | After translating, send sample queries from the EmptyState chips and confirm hits; re-tune keywords if needed. |
| `.env.example` drifts from actual code reads | U6's final smoke test (`cp .env.example .env.local && npm run dev`) catches any missing variable. |

---

## Documentation / Operational Notes

- README and AGENTS.md updates are part of the refactor (U6, U7); no separate docs PR.
- No deployment, monitoring, or rollout work — this is a self-contained portfolio repo.
- After merge, the next natural follow-up is the README's existing Roadmap (Supabase, RAG, auth, extended thinking). Not in scope here.

---

## Sources & References

- Reference portfolio README (Task Manager AI) — provided in the request, used as the voice/format target for `README.md` and the home page.
- `app/api/chat/route.ts` — current system prompt and tool definitions.
- `features/chat/components/ChatWindow.tsx` — split target.
- `features/tickets/store.ts`, `shared/lib/usage-tracker.ts`, `shared/lib/cost.ts` — current type-declaration sites.
