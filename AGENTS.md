<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Folder boundaries

`app/` is routing only — pages, layouts, and route handlers. Feature logic lives in `features/<name>/`. Cross-feature primitives (clients, pricing, types, UI atoms) live in `shared/`. Route handlers never import from another route handler; they import from `features/` or `shared/`.

## Where types live

All shared types live in `shared/types/<domain>.ts`. Don't redeclare them inline in feature files — import them. New domain types get their own file rather than piling into a single barrel.

## Two-SDK split

Streaming chat and tool calling go through the Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`). File analysis (images, PDFs, plain-text documents) goes through `@anthropic-ai/sdk` directly. Don't mix them inside the same route handler.

## Language

All user-facing strings, system prompts, comments, and identifiers are English. The chat agent's system prompt instructs the model to reply in the user's language — preserve that rule when editing the prompt.

## Comments

Default to no comments. Keep one only when it explains a non-obvious *why* — a constraint, an invariant, or a workaround. No sprint-history notes, no cross-portfolio references, no markers about how the code was authored.

## Brand

Single accent color: `orange-600` (with `orange-50/100/400/700` for hover and surface variants). When changing it, update every component file in lockstep — there are no theme tokens to lean on.
