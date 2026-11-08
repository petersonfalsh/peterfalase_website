# Portfolio Hardening and AI Chat Setup Plan

> **For implementation:** Work through the phases in order. Each task has a checkable result. Do not commit secrets or generated output.

**Goal:** Make the portfolio safer and easier to maintain, and make the Digital Twin usable in local development and an explicitly chosen deployment environment.

**Architecture:** Keep the portfolio page mostly server-rendered, with the existing chat UI as the interactive client component and the existing Next.js route as the only place that calls OpenRouter. Configure provider credentials as server-only environment variables. Add request controls and automated checks before enabling a funded public chat endpoint.

**Tech stack:** Next.js 16, React 19, JavaScript/JSX, CSS, npm, OpenRouter chat completions API.

**Source review:** `review.md` findings F1–F12 and the Git hygiene update; repository guide: `docs.md`.

## Global constraints

- Never put an OpenRouter key in source code, browser code, screenshots, Git history, or a variable prefixed with `NEXT_PUBLIC_`.
- Keep the key in a local ignored environment file for development and in the selected hosting provider's secret manager for deployment.
- Do not expose a funded public chat endpoint until rate limits, request limits, timeouts, and provider spending controls are in place.
- Preserve the portfolio page and resume link while making changes to the chat.
- Do not commit `node_modules/`, `.next/`, `.npm-cache/`, local logs, or incidental Playwright screenshots.
- Read the installed Next.js 16 documentation under `node_modules/next/dist/docs/` before changing Next.js-specific application code, as required by `AGENTS.md`.
- Use provider mocks for automated tests. Any live provider smoke test must be an intentional, single, low-cost check after budget controls are configured.

## Review focus

- Missing or invalid provider key: chat gives a clear unavailable response; the secret is never returned to the browser.
- Malformed, oversized, or unusually long requests: endpoint rejects them before expensive work.
- Forged assistant history or a previous UI error: it cannot be treated as trusted conversation context.
- Provider timeout, non-JSON response, and provider errors: endpoint returns stable safe errors and releases resources.
- Keyboard, mobile, and reduced-motion use: controls remain reachable, readable, and operable.

---

## Phase 0 — Confirm the deployment and chat-key setup

**Outcome:** Decide where the site will run and configure a private development key without putting it in Git. No application code changes are required for a local key.

### Task 0.1 — Choose and record the deployment target

- [ ] Identify whether this is local-only, a preview deployment, or a public production site.
- [ ] If deploying, identify the hosting platform and whether it supports server-side environment secrets and a shared rate-limit store.
- [ ] Record the deployment URL for the later OpenRouter referer configuration and browser checks.
- [ ] Do not enable a public paid endpoint while its abuse controls are incomplete.

**Done when:** the deployment target and secret storage location are known, or the project is explicitly marked local-only.

### Task 0.2 — Create a local OpenRouter key if AI chat is wanted

- [ ] In the OpenRouter account, create a dedicated key for this project. Check current account funding, model availability, and spending limits in the provider dashboard before making requests.
- [ ] In the repository root, create a local `.env.local` file containing `OPENROUTER_API_KEY=your_actual_key` (replace the placeholder locally; do not send the actual key in chat or add it to a tracked file).
- [ ] Confirm `.env.local` is ignored by Git. Add ignore coverage before saving any key there if it is not.
- [ ] Restart the local dev server after adding or changing the key.
- [ ] Test a single short chat prompt only after the API protections in Phase 1 are complete. Until then, validate the missing-key path without contacting OpenRouter.

**Done when:** the app can read the key on the server and a controlled test can use it without the value appearing in browser requests, source, or Git status.

**If you do not want paid AI chat:** skip key creation and choose neutral unavailable/configuration messaging in Phase 4. The rest of the portfolio works without the key.

---

## Phase 1 — Protect the chat endpoint and provider spend (F1, F2, F9)

**Outcome:** The public route has bounded inputs, bounded upstream work, and abuse controls before the AI key is used in a public deployment.

### Task 1.1 — Decide rate-limit rules and backing store

**Files:** deployment configuration and, if needed, a new server utility under `app/`.

- [ ] Based on the Phase 0 host, select a shared rate-limit store supported by that host; do not use process-memory counters for a multi-instance/serverless deployment.
- [ ] Set explicit per-client short-window limits, a global/daily quota or spend ceiling, and a concurrency ceiling. Choose concrete values appropriate to expected portfolio traffic and provider budget, and record them in deployment notes.
- [ ] Return `429` and a `Retry-After` header when a request exceeds the limit.
- [ ] Configure provider-side budget limits/alerts where available.

**Check:** unit/integration tests show a request over each configured limit receives `429` without calling OpenRouter.

### Task 1.2 — Bound and validate requests before provider work

**Files:** `app/api/chat/route.js`; chat textarea in `app/components/DigitalTwinChat.jsx`; API route tests added in Phase 2.

- [ ] Reject unsupported content types and obviously excessive `Content-Length` values before parsing; also configure a request-body ceiling at the host/proxy because headers can be missing or false.
- [ ] Handle malformed JSON as `400`, not as a generic server error.
- [ ] Validate the body shape, message count, allowed roles, per-message length, and total character budget. Preserve a documented limit no larger than the current 12 messages and 4,000 characters per message; set a reasonable overall budget.
- [ ] Add a matching input `maxLength` for normal browser users.
- [ ] Return stable validation errors that do not include provider or server internals.

**Check:** tests cover malformed JSON, absent/invalid body, unsupported media type, too many messages, oversized message, and total-budget rejection.

### Task 1.3 — Set an upstream deadline and safe error handling

**Files:** `app/api/chat/route.js`.

- [ ] Give the OpenRouter request a short explicit timeout using a supported abort signal.
- [ ] Map a provider timeout to `504` (or a documented temporary-unavailable response) and provider failures to a stable `502`/`503` response.
- [ ] Handle non-JSON provider replies and empty model responses without throwing an unclassified error.
- [ ] Keep useful sanitized diagnostics server-side; never log the API key or full user conversation by default.
- [ ] Return public error codes/messages rather than raw provider error text/status.
- [ ] Use a validated configured production referer; do not send `http://localhost:3000` for a deployed site.

**Check:** mocked provider tests cover timeout, non-JSON, provider 4xx/5xx, empty response, and success. Confirm all error responses have a consistent shape.

---

## Phase 2 — Add repeatable quality checks (F4)

**Outcome:** A clean install, lint, automated API tests, and build can catch regressions without depending on a live AI request.

### Task 2.1 — Repair the lint command

**Files:** `package.json`; ESLint configuration and dependencies as selected after checking the installed Next.js 16 guidance.

- [ ] Replace the unsupported `next lint` script with a supported linter CLI and compatible Next.js rules/configuration.
- [ ] Keep the linter setup minimal and include it in the lockfile.
- [ ] Run lint and fix reported issues without suppressing meaningful rules globally.

**Check:** `npm run lint` exits successfully from a clean checkout.

### Task 2.2 — Test the API route without spending money

**Files:** new test files and test script in `package.json`.

- [ ] Select a test runner compatible with the project's Node/Next versions and mock `fetch` to OpenRouter.
- [ ] Cover missing key, malformed body, role handling, request limits, timeout, provider failure, invalid provider JSON, empty answer, and successful answer.
- [ ] Assert that secrets are not returned and that rejected requests never call the provider.

**Check:** tests pass with no real `OPENROUTER_API_KEY` configured and no network request to OpenRouter.

### Task 2.3 — Test chat interactions and browser-critical paths

**Files:** new chat component and browser test files; test configuration.

- [ ] Cover successful submission, suggestions, loading/disabled state, Enter versus Shift+Enter, and error display.
- [ ] Confirm display-only error messages are not sent as trusted conversation history on the next request (see Phase 3).
- [ ] Add a browser smoke test for home page load, section navigation, resume response, mobile layout, keyboard focus, and mocked chat reply.

**Check:** component and browser tests pass with provider calls mocked.

---

## Phase 3 — Correct chat trust boundaries (F3)

**Outcome:** The client cannot invent trusted assistant history, and errors shown to a person do not become model context.

### Task 3.1 — Separate displayed transcript from request history

**Files:** `app/components/DigitalTwinChat.jsx`.

- [ ] Keep transient error messages out of the conversation payload.
- [ ] Send only the conversational turns needed for the next answer, using an explicit allowlist when constructing the request body.
- [ ] Preserve visible error feedback in the chat UI without marking it as model-generated profile content.

**Check:** a test triggers a failed request, sends another question, and verifies the error text is absent from the second request.

### Task 3.2 — Make server handling of assistant turns explicit

**Files:** `app/api/chat/route.js` and its tests.

- [ ] Prefer sending user turns and rebuilding assistant context from server-controlled data; if multi-turn assistant responses are retained from the browser, document why and add a tamper-resistant/session-bound approach appropriate to the chosen deployment.
- [ ] Reject unsupported roles and test forged assistant text.
- [ ] Preserve the system profile prompt as server-owned data.

**Check:** tests prove caller-supplied assistant text cannot override or masquerade as trusted system/profile instructions.

---

## Phase 4 — Make availability and errors honest (F6, F9)

**Outcome:** The page does not claim that AI is live when the required key or service is unavailable.

### Task 4.1 — Replace always-live status claims

**Files:** `app/components/DigitalTwinChat.jsx`; optionally a non-billable readiness endpoint if required.

- [ ] Change unconditional `ONLINE`/`LIVE` claims to neutral wording unless the UI has a reliable readiness signal.
- [ ] If showing availability, expose only configuration/service readiness; never expose whether a secret is set or its value.
- [ ] Do not make a billable model call during page load just to determine status.
- [ ] Show a useful unavailable message when the key is missing or the provider is down.

**Check:** browser test covers missing-key and available-state UI, and no provider call is made when the homepage loads.

### Task 4.2 — Verify local key workflow

**Files:** `.gitignore`, optional `.env.example`, setup documentation.

- [ ] Ensure `.env`, `.env.local`, and related real environment files are ignored.
- [ ] Add `.env.example` with only `OPENROUTER_API_KEY=` and safe, non-secret comments if useful.
- [ ] Explain local setup and hosting secret configuration in `docs.md`.
- [ ] Restart dev server after changing environment configuration.

**Check:** `git status` does not show a populated local env file, and the missing-key path is tested without a provider key.

---

## Phase 5 — Accessibility and responsive behavior (F5, F8)

**Outcome:** Keyboard, low-vision, and mobile visitors can operate the page and chat.

### Task 5.1 — Restore visible keyboard focus and readable text

**Files:** `app/globals.css`; chat markup as needed.

- [ ] Add visible `:focus-visible` styling for links, buttons, prompt chips, and the chat textarea/form.
- [ ] Darken text colors identified in F5 until normal text meets WCAG AA contrast (4.5:1); recheck actual foreground/background combinations.
- [ ] Give chat region/transcript/loading/error messages useful semantics and deliberate live announcement behavior.
- [ ] Increase the send control's touch target to at least 44 by 44 CSS pixels where layout allows.

**Check:** keyboard-only walkthrough and contrast checks pass; browser test asserts focus is visible and chat status/error announcements are present.

### Task 5.2 — Provide mobile section navigation

**Files:** `app/page.jsx`; `app/globals.css`; optional small client navigation component if needed.

- [ ] Replace the hidden mobile navigation with an accessible compact menu or a usable horizontally scrolling navigation.
- [ ] If implementing a menu button, provide expanded state, keyboard operation, focus behavior, and Escape handling.
- [ ] Keep every destination reachable at mobile widths and 200% zoom.

**Check:** browser test reaches About, Journey, AI Twin, and Portfolio on a narrow viewport using keyboard and touch-sized controls.

---

## Phase 6 — Reduce client work and fix UI contracts (F7, F12)

**Outcome:** Only interactive parts require client-side React, spacing stays predictable, and decorative project cards do not pretend to be links.

### Task 6.1 — Keep the portfolio page server-rendered

**Files:** `app/page.jsx`, `app/components/DigitalTwinChat.jsx`.

- [ ] Remove the page-level `"use client"` directive if no page-level browser APIs/state are introduced.
- [ ] Keep the client directive on `DigitalTwinChat.jsx` where React state and browser events are needed.
- [ ] Confirm importing the client chat into the server page works in the installed Next.js version.

**Check:** production build succeeds; browser test confirms the page and chat still render and operate.

### Task 6.2 — Fix section spacing and card affordances

**Files:** `app/globals.css`, `app/page.jsx`.

- [ ] Change `.section-padding` to set vertical padding without overriding `.section-shell` horizontal padding.
- [ ] Either make portfolio/capability cards functional links with real destinations and focus states, or remove arrow/hover cues that suggest they are clickable.
- [ ] Check desktop and mobile alignment after changes.

**Check:** visual review confirms consistent left/right section padding and every apparent interactive card has a working destination—or no link-like affordance.

---

## Phase 7 — Repository hygiene and maintained docs (Git update, F11)

**Outcome:** Git history contains source and intentional assets, not generated output or secrets.

### Task 7.1 — Expand ignore rules

**Files:** `.gitignore`.

- [ ] Ignore `.next/`, `node_modules/`, `.npm-cache/`, local environment files, local logs, and `output/playwright/` if screenshots are not approved reference assets.
- [ ] Keep an intentional placeholder `.env.example` trackable.
- [ ] Check the existing tracked paths so ignore patterns do not hide source assets that should stay committed.

**Check:** `git check-ignore` reports generated/private paths ignored, while source and intended public assets remain visible to Git.

### Task 7.2 — Untrack generated files without deleting local data

**Files:** Git index entries under `.next/` and, if agreed, `output/playwright/`.

- [ ] Review the exact staged deletion list before committing.
- [ ] Use cached/index-only removal for `.next/` so the local directory remains available; untrack Playwright screenshots only if no selected reference set is being kept.
- [ ] Do not stage or revert the existing modified `.next/` files as if they were source changes.
- [ ] Inspect `git status` and staged diff to ensure no environment secrets or unrelated user work is included.

**Check:** generated paths no longer appear as tracked files after cleanup is committed, remain ignored afterward, and local files are preserved where intended.

### Task 7.3 — Remove duplicate resume only after confirmation

**Files:** root `Peter_Falase_Professional_Resume_2026.pdf`; keep `public/Peter_Falase_Professional_Resume_2026.pdf` if public download is intended.

- [ ] Compare hashes and confirm which copy is the maintained source.
- [ ] Remove the root copy from the repository if it has no separate workflow purpose.
- [ ] Verify the public resume URL still serves the intended document.

**Check:** one authoritative source remains and the resume link continues to work.

### Task 7.4 — Keep beginner setup documentation accurate

**Files:** `docs.md`, `tutorial.md`, `review.md`, optional `README.md`.

- [ ] Ensure the install/run steps match the scripts and file names in the current repository.
- [ ] Correct stale statements in `tutorial.md` (for example, old paths or claims about files that no longer exist) or clearly label it historical.
- [ ] Decide whether `docs.md` is the maintained beginner guide or add a short README that links to it.
- [ ] Update review dates and verification results only when the associated checks are run again.

**Check:** a new maintainer can follow the documented commands from a clean checkout and reach the homepage without needing an AI key.

---

## Phase 8 — HTTP hardening and release verification (F10)

**Outcome:** The deployed site has considered browser security headers and passes an end-to-end release checklist.

### Task 8.1 — Add deployment-appropriate response headers

**Files:** `next.config.js` or hosting configuration.

- [ ] Disable the framework identification header if supported.
- [ ] Add `X-Content-Type-Options`, frame protection via CSP `frame-ancestors` or equivalent, a Referrer Policy, and a least-privilege Permissions Policy.
- [ ] Develop a Content Security Policy based on actual script/style/provider needs; begin with report-only if deployment permits, then enforce after checking reports.
- [ ] Validate headers on the actual deployment because a hosting proxy may override app configuration.

**Check:** inspect response headers on the deployment and confirm the page, chat, and required static assets still work under the policy.

### Task 8.2 — Run the release checklist

- [ ] Install reproducibly from the lockfile (`npm ci`).
- [ ] Run lint, API/component tests, browser smoke tests, production build, and dependency audit.
- [ ] Verify keyboard operation, narrow mobile width, 200% zoom, reduced motion, contrast, and resume download.
- [ ] Verify rate limits and timeout behavior using mocks or staging controls.
- [ ] If live AI is enabled, make one controlled staging prompt after confirming provider and application budget limits; inspect logs for secrets and unnecessary conversation data.
- [ ] Review the final Git diff/status and ensure only intended files are staged.

**Release gate:** do not enable public AI traffic until Phase 1, Phase 2, Phase 3, and Phase 4 have passed. If AI is intentionally disabled, the static portfolio may be released once its own build, accessibility, and repository hygiene checks pass.

## Suggested order at a glance

1. Decide target and whether to enable chat; configure a private local key only if wanted.
2. Add request limits, rate limiting, provider timeout, and safe errors.
3. Add lint and mocked automated tests.
4. Fix forged history and separate UI errors from conversation context.
5. Make chat availability truthful and document secret setup.
6. Address accessibility and mobile navigation.
7. Reduce client rendering and fix spacing/card affordances.
8. Clean Git tracking and documentation.
9. Add deployment headers and run the full release gate.
