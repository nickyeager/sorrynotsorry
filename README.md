# Sorry Not Sorry (Pickleball Ledger)

Companion project for an upcoming talk. This app tracks pickleball games, scores, locations, and money won/lost between players.

## Why the Name?

In pickleball, it’s common to get hit by the ball or see a ball clip the net and drop in. Players often say “sorry not sorry” in a playful, ironic way: you’re being polite, but secretly not sorry at all.

## Overview

**What it does**
- Tracks singles and doubles matches.
- Records game location and final score.
- Supports live scoring or post-game entry.

**Tech stack**
- Frontend: Next.js + shadcn-admin UI
- Backend: Supabase

**Future ideas**
- Optional DUPR integration: https://backend.mydupr.com/swagger-ui/index.html

## Getting Started

### Prerequisites
- Node.js 18+ (or 20+)
- npm (or your preferred Node package manager)

### Setup
1. Install dependencies:
	- `npm install`
2. Create your environment file:
	- `cp .env.local.example .env.local`
	- Fill in Supabase keys and any required values.
3. Start the dev server:
	- `npm run dev`
4. Open http://localhost:3000

### Common Scripts
- `npm run dev` — run the app locally
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — lint the project

## Project Structure
- `src/` — application code
- `public/` — static assets
- `supabase/` — migrations and seed data

## Talk Steps (from slide deck)

### 1) Initial research / planning phase
- Treat planning as critical. Maintain an instruction file that includes:
	- High-level project organization
	- External dependencies and constraints
	- Positive and negative examples
- Watch token usage; keep prompts scoped and disciplined.
- Use helpers like /init-project and /create-prd.
- Be judicious about how much code gets generated.

### 2) Demo flow
- Run /create-prd and walk through the generated documentation.
- Emphasize security and architecture standards.
- Show the live context window.
- Show the validation workflow end-to-end.
- Use hooks to run linting/formatting after each turn.
- Build and reuse prompt/instruction libraries over time.

### 3) Task planning (part 2)
- Break work into linear, well-scoped tasks.
- Include testing requirements (TDD when possible).
- Require docs and organization updates as part of each task.
- Integrate into existing structure; avoid unnecessary new files.

### 4) Validation: “trust (kinda) but verify”
- Use /validation:validate or /test.
- For bugs: /debug plus clear repro steps.
- Maintain unit tests plus an e2e test (Playwright or Chrome MCP).

### 5) Implementation (part 2)
- Combine RAG, memory, prompt engineering, and task management as needed.
- Memory can be hardcoded logs or a tool like claude-mem.
- Task management can be off-the-shelf tools or custom workflows.

### 6) Validation (agentic + dev)
- Agentic validation: unit/integration tests, plus MCP integrations.
- Chrome MCP is powerful but can be tedious unless using a -yolo mode.
- Dev validation: review code; if it’s too much to review, the task was too big.
- Always document manual validation steps.

### 7) Example: Pickleball game tracker
- Requirements: basic auth, teams, leagues support.
- /skills-brainstorming can help generate ideas.
- Start with a plan.md outlining stack, user profile, and MVP milestones.
- Use /superpowers:brainstorm or /create-prd to build a detailed PRD.
- Highlight MVP checkboxes, docs, API references, and codebase structure.
- Leave as little ambiguity as possible.

### 8) Debugging
- Same process, smaller loops.
- Use a debug-focused skill/profile (e.g., “smart debug”).
- TDD preferred; can be skipped for tiny fixes.

### 9) Common gotchas
- Illusion of productivity: lots of prompts, little progress.
- Tools change rapidly; a working method may break later.
- “Copy-paste bot” loop: fix one error, create another.
- The escape hatch is to zoom out and return to planning.

### 10) Active development loop
- When validation reveals a missed requirement, update the docs.
- Core loop:
	- /core_piv_loop:prime
	- /core_piv_loop:plan-feature
	- /core_piv_loop:execute
	- /validation:validate
	- /validation:code-review
	- /validation:code-review-fix
	- /validation:execution-report
	- /validation:system-review
- Reference: https://github.com/thedotmack/claude-mem
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

