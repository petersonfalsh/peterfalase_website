# Current plan: improve the AI chat and portfolio

**Updated:** 15 November 2026
**Based on:** Current findings C1–C13 in `review.md`.

## How we will work

We will take one step at a time: explain the intended change, implement it, review the result together, and create a separate commit before moving on. Steps are unchecked until their work and review are complete. The site currently works locally; public deployment is postponed. Never put the OpenRouter key in code, documentation or Git.

Some protections depend on the hosting service. We can prepare and check the local application now, but a local-only solution does not prove the public service is protected. We will decide the hosting-specific parts when a deployment platform is chosen.

### Step 1 — Limit repeated chat requests (C1)

**Progress:** Local development has a shared limit of 10 requests per minute per running server. The endpoint is disabled outside development until shared production protection is configured. Hosting-specific rate limiting, monitoring and deployment checks remain open, so this step is not yet complete.

**Where:** The server-side chat endpoint, and eventually the hosting service.

**What and why:** Add a limit on how often someone can ask the chat a question, plus a clear message when the limit is reached. Consider a shared overall limit and monitoring. This helps keep the service available and protects the OpenRouter account's allowance.

**If skipped:** A person or automated program could repeatedly call the endpoint, exhaust the free allowance, make the chat unavailable to others, or incur costs if account settings or provider pricing change.

**Tasks:**

- [ ] Choose limits that are reasonable for ordinary visitors and explain what happens when they are reached.
- [ ] Choose a local development approach and a shared, multi-instance protection for the eventual hosting platform; do not describe an in-memory limit as sufficient for a public deployment.
- [ ] Add a safe response for exceeded limits and an approach to monitor overall usage without exposing the key or private messages.
- [ ] Check normal requests and requests over the limit. Record any hosting-specific work that remains.

**Suggested commit:** `feat: protect chat against excessive requests`

### Step 2 — Limit the size of incoming requests (C2)

**Progress:** The application checks a 256 KB limit while reading requests and validates up to 12 messages. A hosting-level limit remains to be configured when a platform is chosen.

**Where:** `app/api/chat/route.js` and, later, the hosting service.

**What and why:** Set a maximum size for a request before the server reads and processes the whole thing. A request is the message package sent to the chat endpoint.

**If skipped:** Someone could send an extremely large request and use excessive server memory or processing time. Invalid input may also produce a confusing server error.

**Tasks:**

- [ ] Choose a sensible maximum request size and enforce it while reading, even when a size header is missing or incorrect.
- [ ] Validate the message structure and number of messages; respond clearly to invalid or oversized requests.
- [ ] Add an appropriate hosting-level limit when the platform is known.
- [ ] Check normal, malformed and oversized requests.

**Suggested commit:** `fix: limit and validate chat requests`

### Step 3 — Protect the chat's career context (C3)

**Progress:** Local development stores recent conversation history in server memory using random session IDs; the browser sends only its new question. Sessions expire after 30 minutes of inactivity or on server restart. A shared, protected production store and adversarial evaluation remain before deployment; AI answers can still be wrong.

**Where:** The chat endpoint and conversation handling.

**What and why:** Stop treating earlier messages supplied by the browser as automatically trustworthy. Decide how the server can recognise or safely handle conversation history and keep answers tied to Peter's reviewed career facts.

**If skipped:** A caller could submit invented earlier assistant answers, and the AI might repeat or build on those inventions. Instructions alone cannot guarantee that an AI will always ignore misleading text.

**Tasks:**

- [ ] Choose a suitable conversation design, considering trusted server-side history and its storage requirements, or clearly marked untrusted history if a simpler approach is chosen.
- [ ] Prevent browser-supplied messages from being treated as authoritative career facts.
- [ ] Check known facts, unknown facts and attempts to insert invented history; document remaining limitations.

**Suggested commit:** `fix: improve chat conversation trust`

### Step 4 — Handle slow or unavailable AI responses (C4)

**Where:** The server's OpenRouter request and the chat interface.

**What and why:** Stop waiting after a reasonable time and handle provider failures, including responses that are not in the expected format. Show a helpful message without revealing private details.

**If skipped:** Visitors may wait indefinitely, the input can stay disabled, and server resources can remain occupied. Some provider errors may appear as confusing generic failures.

**Tasks:**

- [ ] Set a reasonable timeout and handle cancellation or slow responses.
- [ ] Handle unavailable, rate-limited, empty and unexpected provider responses safely.
- [ ] Check that visitors can continue using the chat after an error and that logs do not reveal the key or private conversations.

**Suggested commit:** `fix: handle chat provider timeouts and errors`

### Step 5 — Make failed questions easy to retry (C5)

**Where:** `app/components/DigitalTwinChat.jsx`.

**What and why:** Keep error messages separate from the conversation sent to the AI and let a visitor retry a failed question or restore its text.

**If skipped:** Visitors may need to retype questions, and the AI may receive an error message as if it were a previous assistant answer.

**Tasks:**

- [ ] Decide how failed questions appear and how visitors retry them.
- [ ] Exclude interface error messages from AI conversation history.
- [ ] Check that retrying does not accidentally duplicate a question or mix failed and successful responses.

**Suggested commit:** `fix: improve chat retry and error history`

### Step 6 — Make question length limits clear (C6)

**Where:** The chat input and server validation.

**What and why:** Tell visitors the maximum question length and reject questions that are too long instead of silently cutting them off. Keep the server limit even if the browser also enforces it.

**If skipped:** A visitor could see their whole question on screen while the AI receives only part of it, resulting in a misleading answer.

**Tasks:**

- [ ] Agree on a suitable length and show or explain it in the interface.
- [ ] Apply matching checks in the browser and on the server.
- [ ] Check short, maximum-length and too-long questions.

**Suggested commit:** `fix: make chat message limits clear`

### Step 7 — Restore quality checks (C7)

**Where:** `package.json` and project checking tools.

**What and why:** Replace the outdated lint command and establish useful repeatable checks. Linting looks for common code problems; automated checks help catch changes that accidentally break existing behaviour.

**If skipped:** Problems in request handling, mobile navigation or chat recovery may go unnoticed until a visitor encounters them.

**Tasks:**

- [ ] Configure a lint command supported by the installed project versions.
- [ ] Add focused checks for validation, limits, provider failures and chat recovery, using a mock provider where appropriate.
- [ ] Add a small browser check for important navigation and chat behaviour.
- [ ] Document the commands and run the checks appropriate to the work.

**Suggested commit:** `chore: restore project quality checks`

### Step 8 — Show honest chat availability (C8)

**Where:** AI Twin labels and status messages.

**What and why:** Replace the permanent “LIVE” and “ONLINE” claims with neutral wording, or show status only when it is actually checked.

**If skipped:** Visitors may believe the AI service is available when its key, provider or free allowance is not working.

**Tasks:**

- [ ] Choose clear wording or an actual availability approach.
- [ ] Check loading, unavailable and rate-limited states.

**Suggested commit:** `fix: clarify AI chat availability`

### Step 9 — Keep career facts consistent (C9)

**Where:** The AI profile, portfolio page and public resume.

**What and why:** Organise the reviewed career information so changes can be kept consistent across the page and chat, and document how the PDF is updated.

**If skipped:** The site, resume and AI can give different or outdated details about Peter's work.

**Tasks:**

- [ ] Identify a practical shared source for facts used in the page and AI prompt, where suitable.
- [ ] Review facts against the resume and decide how the PDF will be kept current.
- [ ] Check known facts and missing information after updates.

**Suggested commit:** `refactor: organise shared career information`

### Step 10 — Review provider privacy and availability (C10)

**Where:** OpenRouter, the selected model provider and the chat's visitor notice.

**What and why:** Check current provider terms, how messages are handled, free-model limits and what happens during outages. Decide what information is appropriate to send.

**If skipped:** Visitors may misunderstand where their messages go, and the service could become unavailable or operate under terms you did not expect.

**Tasks:**

- [ ] Review current terms for the exact selected model and provider before public launch.
- [ ] Decide which profile facts can be sent and keep the visitor notice clear.
- [ ] Record an approach for provider outages and allowance limits.

**Suggested commit, if files change:** `docs: clarify AI provider privacy and availability`

### Step 11 — Improve chat accessibility (C11)

**Where:** Chat styling, loading status and messages.

**What and why:** Ensure bold text remains readable and loading and errors are communicated clearly, including for keyboard and screen-reader users.

**If skipped:** Some visitors may be unable to read their message or understand whether the chat is working.

**Tasks:**

- [ ] Fix bold text contrast inside user messages.
- [ ] Provide clear loading and error announcements.
- [ ] Review keyboard focus, zoom, reduced motion and screen-reader behaviour in a browser.

**Suggested commit:** `fix: improve chat accessibility`

### Step 12 — Connect cards when real destinations exist (C12)

**Where:** Capabilities and “Proof is in the build” cards.

**What and why:** Keep the arrows and hover effects you preferred, and add real, keyboard-accessible links when there are pages or projects to link to.

**If skipped:** Visitors may try to click the cards and find that nothing happens.

**Tasks:**

- [ ] Keep the portfolio work deferred until real project details and destinations are ready.
- [ ] Add meaningful links only where real destinations exist, and check mouse, keyboard and phone use.

**Suggested commit, when ready:** `feat: link portfolio cards to projects`

### Step 13 — Prepare deployment details (C13)

**Where:** Provider attribution, website metadata and hosting configuration.

**What and why:** Replace the local-only provider attribution with the actual site details when the public address is known, and add useful information for search and social previews.

**If skipped:** Provider attribution may point to localhost, and shared links may lack accurate previews.

**Tasks:**

- [ ] Choose a hosting platform and public address when you are ready to deploy.
- [ ] Configure the provider attribution and secret key safely for that environment.
- [ ] Add accurate site and social metadata, then check the deployed site and chat.

**Suggested commit, when ready:** `chore: prepare deployment metadata`

## Previous plan — historical reference

The plan below is preserved from an earlier review. Some of its findings and proposed tasks may already be complete or may no longer match the current application. Use the current plan above as the working agenda, and check the current code before using historical instructions.

---

# Previous plan: Portfolio Hardening and AI Chat Setup

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
