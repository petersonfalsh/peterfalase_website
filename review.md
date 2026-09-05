# Code Review — `my_website`

Date: 2026-08-23  
Scope: `my_website` only. Application code was not modified.

## Executive summary

The project is a small, understandable Next.js 16 portfolio with a polished responsive layout and a server-side OpenRouter integration. The production build succeeds, secrets remain server-side, user/model text is rendered through React rather than injected as HTML, and the dependency audit found no known vulnerabilities.

It is not yet production-hardened. The principal risk is the public chat endpoint: anyone can consume the owner's model quota, and requests have neither rate limiting nor a provider timeout. The endpoint also parses the complete request before applying its limits and trusts client-supplied `assistant` messages. Separately, the configured lint command is broken under Next.js 16, there are no automated tests, several small text styles fail WCAG AA contrast, and the chat input has its browser focus indicator removed without a replacement.

Recommended release decision: the static portfolio is buildable, but do not expose the AI endpoint with a funded API key until findings F1 and F2 are addressed. F3–F6 should follow before calling the site production-ready.

## Verification performed

| Check | Result |
| --- | --- |
| `npm run build` | Pass. Next.js 16.3.1 compiled and prerendered `/`; `/api/chat` was emitted as a dynamic route. |
| `npm run lint` | Fail. `next lint` was removed in Next.js 16; Next interprets `lint` as a project directory and exits with `Invalid project directory provided`. |
| `npm audit --omit=dev --json` | Pass at review time: 0 known production dependency vulnerabilities across 60 total dependencies. |
| Production HTTP smoke check | `/` returned 200. `/api/chat` rejected an empty message list with 400. |
| Secret handling | `.env` contains the expected variable name and is ignored. Its value was not read or recorded. |
| Asset check | The root and `public/` resume PDFs are byte-for-byte duplicates. |

No automated browser suite or provider-billed chat request was run. Generated/vendor directories (`.next`, `node_modules`, and screenshot output) were not treated as source code.

## Findings

### F1 — High: the paid chat API has no abuse controls

Evidence: `app/api/chat/route.js:26-60` accepts every valid POST and forwards it to OpenRouter using the owner's key. There is no authentication, per-IP/user quota, rate limiter, bot challenge, concurrency ceiling, or global spend guard. The UI disabling its Send button does not protect the route; an attacker can call it directly. The tutorial itself acknowledges this at `tutorial.md:997`.

Impact: a public deployment can be scripted to exhaust credits, hit provider limits, degrade availability for legitimate visitors, or create an unexpectedly large bill.

Remedial actions:

1. Add server-side rate limiting backed by a shared store suitable for the deployment platform; do not rely on in-memory counters in a multi-instance/serverless deployment.
2. Apply short-window request limits, a daily quota/spend ceiling, and a small concurrency limit. Return `429` with `Retry-After` when exceeded.
3. Add bot protection or an authenticated usage layer if the chat is intended for more than low-volume demonstration use.
4. Configure provider-side budget alerts and hard limits. Log request IDs, latency, status, and token usage without logging the API key or unnecessary message content.

### F2 — High: unbounded request parsing and no upstream timeout enable resource exhaustion

Evidence: `app/api/chat/route.js:33` calls `request.json()` before any size check. The later `slice(0, 4000)` and `.slice(-12)` at lines 35-39 limit only the already-parsed data. A client can therefore make the server allocate and parse a much larger body. The provider call at lines 45-60 has no `AbortSignal` or explicit deadline.

Impact: oversized or slow requests can consume memory and execution time. A stalled provider connection can hold serverless invocations/connections open and amplify the abuse described in F1.

Remedial actions:

1. Reject missing/invalid content types and a `Content-Length` above a small documented limit before parsing. Also enforce the platform/proxy body limit, since `Content-Length` can be absent or dishonest.
2. Validate the decoded payload against an explicit schema, including array length, allowed roles, string length, and total character budget. Add a matching `maxLength` in the textarea for honest clients.
3. Use `AbortSignal.timeout(...)` or an `AbortController` with a short provider deadline, and map timeouts to `504` or `503`.
4. Add tests for oversized bodies, malformed JSON, slow upstream responses, and upstream non-JSON responses.

### F3 — Medium: conversation authority is delegated to the client

Evidence: `app/api/chat/route.js:35-39` accepts both `user` and `assistant` roles supplied by the requester, then appends them directly after the system prompt at line 55. Any caller can forge arbitrary assistant history. In the browser client, error messages are stored as `role: "assistant"` (`app/components/DigitalTwinChat.jsx:64-73`) and every later submission serializes all messages without excluding `isError` entries (`app/components/DigitalTwinChat.jsx:49-60`).

Impact: forged assistant history can steer the model away from the intended grounded behavior. In the normal UI, a provider/network error becomes part of the next model prompt, which can confuse responses and send internal/provider wording back upstream.

Remedial actions:

1. Treat only user turns as authoritative input, or keep conversation history server-side in a signed/session-bound store.
2. If assistant history must round-trip through the client, sign it or reconstruct it from server-owned data; never accept arbitrary assistant text as trusted history.
3. Keep display errors separate from conversational messages and exclude them from API payloads.
4. Add prompt-injection and forged-role tests. Keep the current output rendering approach, which safely relies on React escaping instead of raw HTML.

### F4 — Medium: the quality gate is broken and coverage is absent

Evidence: `package.json:7-11` defines `"lint": "next lint"`, but Next.js 16 removed that command. There is no ESLint/Biome configuration and no test script or test files. `next build` no longer runs linting in this major version, so the successful build does not compensate for the missing check.

Impact: accessibility mistakes, React hook problems, unsafe patterns, regressions in API validation, and formatting drift can reach production without an automated signal.

Remedial actions:

1. Replace the script with the ESLint CLI (using the current Next.js flat-config plugin) or Biome, add the required development dependencies/configuration, and make CI run it.
2. Add unit/integration tests for the API route with a mocked provider: missing key, malformed input, role rejection, limits, timeout, provider 4xx/5xx, invalid provider JSON, empty result, and success.
3. Add component tests for submission, Enter versus Shift+Enter, loading/disabled states, suggestions, errors, and error exclusion from later history.
4. Add one browser smoke test covering navigation, resume availability, responsive layout, keyboard focus, and a mocked chat exchange.

### F5 — Medium: keyboard focus and text contrast do not meet accessibility expectations

Evidence:

- `app/globals.css:176` removes the textarea outline (`outline: 0`) and supplies no `:focus-visible` replacement anywhere in the stylesheet.
- The 9px chat note (`app/globals.css:181`) uses `#979b93` on `#e8e9e2`, approximately 2.31:1 contrast.
- The 8px message label (`app/globals.css:164`) uses `#92968e` on the same background, approximately 2.46:1.
- The 10px section kicker (`app/globals.css:76`) uses `#7e817d` on `#f1f0eb`, approximately 3.46:1.
- The generic `div` at `app/components/DigitalTwinChat.jsx:97` has an accessible label but no landmark/widget role or `aria-labelledby` relationship, so the label may not provide useful navigation semantics.

Impact: keyboard users can lose track of focus in the primary interactive control, and low-vision users may be unable to read small informational text. WCAG AA requires 4.5:1 for normal-sized text.

Remedial actions:

1. Add a high-contrast `:focus-visible` treatment for links, buttons, prompt chips, and the textarea or a focus-within treatment for its form container. Do not remove the native outline without an equivalent.
2. Darken the failing foreground colors and verify all normal text at 4.5:1 or better; automated contrast checks should be supplemented by keyboard and zoom testing.
3. Give the chat an appropriate named `section`/`region`, label the transcript as a log where appropriate, and announce loading/errors with deliberate live-region semantics.
4. Verify touch targets; the 35×35 send button is smaller than the commonly recommended 44×44 CSS-pixel target.

### F6 — Medium: the UI claims live availability without checking it

Evidence: `app/components/DigitalTwinChat.jsx:91` always renders `ONLINE`, and lines 97-98 always render `LIVE`, even when `OPENROUTER_API_KEY` is absent, the model is unavailable, rate-limited, or the provider is down. The API reports missing configuration only after a user submits (`app/api/chat/route.js:28-31`).

Impact: the interface can make a false operational claim and invites users into a flow that is known to be unavailable.

Remedial actions:

1. Use neutral copy such as “AI CAREER ASSISTANT” unless availability is actually measured.
2. Alternatively, expose a non-secret readiness check and render available/degraded/offline state. A readiness check should not make a billable model request on every page load.
3. Disable submission with a useful message when the feature is not configured.

### F7 — Medium: the entire page is unnecessarily a client component

Evidence: `app/page.jsx:1` marks the whole portfolio as `"use client"`, although only `DigitalTwinChat` uses state/effects and is already isolated as its own client component.

Impact: the static timeline, portfolio, navigation, and contact content are included in the client component graph and hydrated unnecessarily. This increases shipped JavaScript and hydration work and reduces the architectural benefit of the App Router's server components.

Remedial actions:

1. Remove `"use client"` from `app/page.jsx` and leave it on `DigitalTwinChat.jsx` only.
2. Confirm the resulting client bundle and interaction behavior with a production build and browser smoke test.

### F8 — Low: mobile navigation disappears with no equivalent menu

Evidence: `app/globals.css:255` sets `.nav-links { display: none; }` below 620px. The header retains only the brand and contact link, so About, Journey, AI Twin, and Portfolio are no longer exposed as primary navigation on small screens.

Impact: mobile and zoomed users lose a useful way to reach long-page sections.

Remedial actions: provide an accessible compact menu or horizontally scrollable navigation, with an operable button, focus management, Escape handling, and correct expanded-state semantics if a disclosure menu is used.

### F9 — Low: upstream details and deployment attribution are handled poorly

Evidence: `app/api/chat/route.js:50` hard-codes OpenRouter's `HTTP-Referer` as `http://localhost:3000`, and lines 62-65 return the provider's message and status directly to the browser. The generic catch at lines 74-76 also maps all local failures, including malformed client JSON, to 500.

Impact: production attribution is inaccurate; provider implementation/configuration details can be exposed; and clients receive inconsistent error classification.

Remedial actions:

1. Build the referer from a validated deployment configuration value and omit it when unset.
2. Log sanitized provider detail server-side with a correlation ID, while returning stable public error codes/messages (for example, rate-limited, temporarily unavailable, or invalid request).
3. Distinguish malformed JSON (`400`), validation failures (`400`/`422`), upstream timeout (`504`), and upstream failure (`502`/`503`).

### F10 — Low: baseline HTTP hardening headers are absent

Evidence: the production response included `X-Powered-By: Next.js` but no Content Security Policy, `X-Content-Type-Options`, frame-ancestor protection, Referrer Policy, or Permissions Policy. `next.config.js:1-6` configures only strict mode and development origins.

Impact: this does not create an immediate exploit by itself, but it leaves avoidable browser-side defense-in-depth gaps and exposes framework information.

Remedial actions: disable `poweredByHeader`; add a deployment-appropriate CSP and security headers through Next configuration or the hosting layer. Start CSP in report-only mode, account for Next.js scripts, and avoid copying a permissive policy that nullifies the protection.

### F11 — Low: repository and deployment hygiene need cleanup

Evidence:

- `.gitignore` contains only `.env`; it does not ignore `.next/`, `node_modules/`, `.npm-cache/`, local logs, or generated screenshots.
- `Peter_Falase_Professional_Resume_2026.pdf` and `public/Peter_Falase_Professional_Resume_2026.pdf` have identical SHA-256 hashes; only the `public/` copy is needed for the current URL.
- Installed dependencies include extraneous optional Sharp/WASM packages according to `npm ls --depth=0`, indicating the working `node_modules` tree is not cleanly represented by the manifest.
- There is no concise README or `.env.example`; setup information exists only in the much longer beginner tutorial.

Impact: generated files can be committed accidentally, clones/deployments become larger or confusing, and setup is less reproducible for a new maintainer.

Remedial actions:

1. Expand `.gitignore` using the standard Next.js entries while continuing to ignore every real environment file.
2. Keep the served PDF under `public/` and remove the duplicate only after confirming no external workflow depends on it.
3. Validate reproducibility with a clean `npm ci`; do not manually curate `node_modules`.
4. Add a short README and a secret-free `.env.example` containing only `OPENROUTER_API_KEY=` plus deployment notes.

### F12 — Low: styling and affordance contracts are inconsistent

Evidence: `.section-shell` establishes horizontal padding at `app/globals.css:20`, but the immediately following `.section-padding { padding: 130px 0; }` shorthand resets that horizontal padding for every element using both classes. Also, non-interactive capability/project cards animate on hover and display arrow icons (`app/globals.css:121-130`, `185-186`, and `app/page.jsx:175,185-187`), which visually suggests they are actionable.

Impact: alignment is harder to reason about and future spacing changes may produce surprising results. Pointer users may attempt to click cards that have no destination.

Remedial actions: make vertical spacing use `padding-block`, preserve the shell's inline padding intentionally, and either make cards real links with meaningful destinations/focus states or remove the link-like arrows and hover lift.

## Strengths worth preserving

- The API key is read only on the server (`app/api/chat/route.js:28`) and `.env` is ignored.
- Input history is already reduced to 12 non-empty messages of at most 4,000 characters each after parsing (`app/api/chat/route.js:35-39`). Preserve these limits while adding the pre-parse controls from F2.
- User and model content is rendered as React text nodes (`app/components/DigitalTwinChat.jsx:19-23`), avoiding `dangerouslySetInnerHTML` and straightforward stored/reflected HTML injection.
- The external resume link uses `rel="noreferrer"` with `target="_blank"` (`app/page.jsx:111`).
- Semantic headings, labeled primary navigation, form labels, decorative SVG hiding, responsive breakpoints, and a reduced-motion media query provide a good accessibility foundation.
- The production build succeeds and the home route is statically prerendered.

## Suggested remediation order

1. Protect the chat spend and availability: F1 and F2.
2. Correct conversation trust and error handling: F3, F6, and F9.
3. Restore enforceable quality controls: F4, then add API/component/browser tests.
4. Fix keyboard focus and contrast: F5; verify with keyboard, 200% zoom, and automated accessibility checks.
5. Reduce client-side work and improve mobile navigation: F7 and F8.
6. Apply HTTP, repository, documentation, and styling cleanup: F10–F12.

After remediation, rerun lint, unit/integration tests, the production build, dependency audit, a keyboard/accessibility pass, and a provider-mocked end-to-end chat test. Use one tightly capped real-provider smoke test only in a protected staging environment.
