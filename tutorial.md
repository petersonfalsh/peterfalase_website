# Peter Falase's Website: A Beginner's Guide

This guide explains what this project is, where its files live, and how the website and AI chat work. You can read it even if you have never built a website. The guide describes the project as it exists today; if the code changes later, update this guide too.

## 1. What is this project?

This is Peter Falase's **portfolio website**: a website that introduces him, explains his career and skills, and gives people ways to contact him. It also has an AI chat called the **Digital Twin**. A visitor can ask that chat about Peter's professional background.

Think of the website as a shop:

- The **page** is what visitors see when they walk in.
- The **styles** decide the colours, spacing and size of things.
- The **server** is the helper behind the counter that handles requests.
- The **Digital Twin** is an AI assistant that answers using a written career profile.
- The **repository**, often called a **repo**, is the project folder and its saved history.

The website has a home section, About, Career Journey, Capabilities, AI Twin, a future Portfolio section and Contact. The portfolio cards currently say “Coming next”; they are placeholders for work to be added later.

## 2. A few words to know

- **Browser:** A program such as Chrome or Edge that displays websites.
- **Code:** Instructions written for a computer.
- **File:** A saved piece of information, like a document or code file. A **folder** holds files and other folders.
- **Terminal:** A place to type commands. The commands in this guide are for **Git Bash**.
- **Local:** Running on your own computer. Other people cannot automatically see your local website.
- **Server:** A program that receives a request and sends a response. This project runs a server locally during development.
- **Component:** A reusable piece of a page, such as the chat box.
- **API:** A way for programs to communicate. An **endpoint** is a particular address where one program can send a request.
- **Environment variable:** A named setting given to a program, such as a secret API key.
- **Git:** A tool that records versions of a project. **GitHub** is a service that can store a copy of those versions online.
- **Deploy:** Put the website on a hosting service so other people can visit it online.

## 3. What tools make the website work?

- **Node.js** runs JavaScript outside the browser. It runs the development server on your computer.
- **npm** comes with Node.js and installs the packages the project uses. A package is code made available for a project to use.
- **Next.js** is the main website framework. It helps build and serve the page and provides the chat endpoint.
- **React** helps build the page from components and keep track of things that change, such as the text in the chat box.
- **JavaScript** describes how the website behaves. **JSX** lets the page code describe what to display using tags that look like HTML.
- **CSS** controls how the site looks: colours, sizes, spacing, screen layouts and animations.
- **OpenRouter** is the service the server contacts to use an AI model. The requested model is `nvidia/nemotron-3.5-super-vl:free`.

You do not have to install each of React and Next.js separately. The project lists its packages in `package.json`, and npm installs them together.

## 4. A map of the files and folders

The **root** is the main project folder. The important things inside it are shown below. Some folders appear only after you install or run the site. `.env` is private and is not normally included when someone clones the repo.

```text
peterfalase_website/
├── app/
│   ├── api/chat/route.js         # Server-side chat endpoint
│   ├── components/DigitalTwinChat.jsx  # Chat box and its behaviour
│   ├── globals.css               # Visual styles for the site
│   ├── layout.js                 # Outer page layout and metadata
│   └── page.jsx                  # Main portfolio page
├── public/
│   └── Peter_Falase_Professional_Resume_2026.pdf
├── UI/Ux.md                      # UI improvement plan, if present
├── .env                          # Private settings on your computer
├── .gitignore                    # Files Git should normally ignore
├── AGENTS.md                     # Project instructions for AI agents
├── docs.md                       # Additional project guide
├── do_not_commit.md              # Git and file-sharing guide, if present
├── next.config.js                # Next.js settings
├── package.json                  # Project packages and commands
├── package-lock.json             # Exact package versions
├── Peter_Falase_Professional_Resume_2026.pdf  # Root copy of resume
├── plan.md                       # Project improvement plan
├── review.md                     # Code review notes
└── tutorial.md                   # This guide
```

### The `app` folder

`app/page.jsx` builds the main page. It contains the header, hero, scrolling strip, About section, career journey, capabilities, portfolio and contact section. It also places the separate chat component on the page. The `timeline` list near the top contains career roles. The `capabilityCards` list contains the capabilities cards. When a visitor taps a section link, the browser goes to a matching section ID, such as `#journey`.

`app/components/DigitalTwinChat.jsx` builds the chat box visitors see. It holds the welcome message and suggested questions, remembers the messages and input while the page is open, sends questions to `/api/chat`, shows answers or errors, and scrolls to the newest message. Enter sends a question; Shift+Enter adds a new line. This file does **not** contain the API key.

`app/api/chat/route.js` handles the chat request on the server. It chooses the AI model, contains instructions and a written profile based on the resume, reads the private key from the server's environment, and contacts OpenRouter. This is the right place to update the chat's career facts or model selection. Its address in the website is `/api/chat`.

`app/globals.css` is the site's visual rule book. It controls colours, text sizes, section alignment, cards, the mobile menu, timeline and chat. Rules inside `@media` apply to particular screen sizes or preferences. For example, the smaller-screen rules change the layout for phones. Reduced-motion rules reduce some movement for people who request it.

`app/layout.js` wraps the page in the basic HTML document. It imports the global styles and sets the page title and description that browsers and search engines can use.

### The public files and resume

`public/` holds files the website can serve directly to visitors. The “View resume” button opens the PDF inside this folder. Since visitors can open it, check the PDF for information you are comfortable sharing publicly.

The root folder also contains a copy of the resume. At the last comparison it was identical to the public copy. The website link uses the `public/` copy. If you update a resume, make sure the public copy and the career facts in the chat route are updated as needed; updating the PDF alone does **not** update the AI's written profile.

### Settings and package files

`package.json` gives the project a name, lists its packages, and defines commands such as `npm run dev` and `npm run build`.

`package-lock.json` records the exact versions in the installed package tree. Keeping it with `package.json` helps others install a consistent set of packages. Do not edit it by hand for ordinary dependency updates.

`next.config.js` contains Next.js settings for this project, including development settings for localhost. Change it only when you know why the setting is needed.

`.env` contains private local settings, including `OPENROUTER_API_KEY`. It belongs on your own machine, not in GitHub. The site reads its value on the server. Do not paste the key into chat, screenshots, documentation or browser code.

`.gitignore` tells Git which untracked files to ignore. This project ignores `.env`, `.env.*`, `node_modules`, `.next`, `.npm-cache/` and `output/playwright/`. Ignore rules do not automatically stop tracking files that Git already tracks. See `do_not_commit.md` for an explanation.

### Project documents

`AGENTS.md` gives instructions to AI coding agents working in the repository. It includes a reminder to consult this installed Next.js version's documentation before changing code.

`docs.md` is another introductory project guide. `plan.md` records a plan for improvements and hardening. `review.md` contains code review findings. These are notes from particular points in time; check the current code before assuming every note still applies.

`UI/Ux.md`, if present, records the UI improvement plan. Its portfolio-content step was deferred until real project details are available. `do_not_commit.md`, if present, explains what to share in Git. Both may exist locally without being committed.

`tutorial.md` is this guide. These `.md` files use **Markdown**, a simple way to write headings, lists and code blocks.

### Folders created on your computer

`node_modules/` is created when npm installs packages. The app needs those packages to run, but the folder can be recreated and should not normally be committed.

`.next/` is created by Next.js while developing or building. It contains generated files and caches. It can be recreated; do not commit it. Stop the development server before removing its generated files.

`.npm-cache/` may contain a local npm cache and logs. `output/playwright/` may contain screenshots from browser checks. These are normally local output, not website source. A screenshot deliberately kept as documentation or a test reference is a separate decision.

`.git/` stores Git's local history and settings. Git manages it; do not edit or delete it casually.

## 5. Set up and run the website on your computer

### Before you start

You need Node.js, npm, Git Bash, a copy of this project and an internet connection to install packages. The chat also needs an OpenRouter API key and internet access. A code editor makes it easier to open the files.

1. Open **Git Bash** in the project root. To check where you are, type:

   ```bash
   pwd
   ls -a
   ```

   You should see files such as `package.json` and the `app` folder. `ls -a` also shows hidden names beginning with a dot.

2. Install the packages using the committed lockfile:

   ```bash
   npm ci
   ```

   This creates `node_modules/`. You normally do this after first getting the repo or when dependencies change. The command replaces the installed dependency folder, so do not keep personal files there.

3. Create a file called `.env` in the project root if you do not already have one. Add the line below, replacing the placeholder with your own key. **Do not put the real key in this guide or commit it.**

   ```text
   OPENROUTER_API_KEY=replace-with-your-own-key
   ```

   A copy of the repo does not include your private `.env`; each developer sets up their own key. If you change `.env`, restart the development server so it picks up the setting.

4. On this Windows computer, a certificate issue was solved by telling Node to use Windows' trusted certificates. In Git Bash, run:

   ```bash
   export NODE_OPTIONS="--use-system-ca"
   npm run dev
   ```

   This uses the trusted certificates configured in Windows; it does not turn off certificate checking. The setting applies to this terminal session. If Node reports that it does not recognise the option, check your Node version. If a certificate problem persists, investigate the certificate and its issuer rather than disabling security checks.

5. Read the address printed in the terminal, usually `http://localhost:3000`, and open it in a browser. Leave the terminal running while you use the site. To stop the server, return to that terminal and press **Ctrl+C**.

When you save code, the development server normally refreshes the site. It may show an error in the browser or terminal if a change has a mistake.

## 6. How the normal website page appears

1. You open the local address in a browser.
2. The browser asks the local Next.js server for the home page, `/`.
3. Next.js uses `app/layout.js` and `app/page.jsx` to prepare the page.
4. The browser displays the page using the rules in `app/globals.css`.
5. React handles interactions, such as opening the mobile menu and using the chat.

On a large screen, the header shows navigation links. On a small screen, use the **Menu** button to find the sections. Section links such as `#about` move the page to the matching section. The green strip repeats focus areas across the screen.

## 7. How the Digital Twin answers a question

The chat interface and endpoint have different jobs:

- The **interface** is the chat box visitors see and type into.
- The **endpoint** is server-side code at `/api/chat` that handles the request behind the scenes.

Here is the trip a question takes:

```text
Visitor types a question in the browser
    ↓
DigitalTwinChat.jsx sends the new question and a session ID to /api/chat
    ↓
route.js checks the question and reads earlier messages from the local server's memory
    ↓
route.js adds instructions and its written career profile
    ↓
route.js reads OPENROUTER_API_KEY on the server
    ↓
The server sends the request to OpenRouter and the chosen model
    ↓
OpenRouter sends an answer back to the server
    ↓
The server returns the answer to the chat box
    ↓
The visitor sees the answer
```

The route accepts one new question of up to 4,000 characters and keeps up to 12 earlier messages on the local server. It rejects requests larger than 256 KB. A random session ID connects a browser to its conversation; keep that ID private because someone with it could continue the conversation. Local sessions expire after 30 minutes of inactivity or when the server restarts. The development server allows 10 requests per minute in total, and the chat is disabled outside development until shared production protections are configured. It uses `nvidia/nemotron-3.5-super-vl:free`, asks for at most 500 output tokens, and requests reasoning be disabled. A token is a small piece of text; it is not exactly the same as a word.

The server holds a **written summary** of the resume in `SYSTEM_PROMPT`. It does not read the PDF for every question. The instructions tell the model to use the profile and say when an answer is missing. AI can still make mistakes or be influenced by questions; these instructions are not a guarantee. Check answers against the resume, and do not claim the chat can know facts that are not provided.

The key is used by the server to authenticate with OpenRouter and is not deliberately sent to the browser. The messages and the career profile are sent to OpenRouter and its model provider. The chat asks visitors not to share personal or confidential information. The free model may have usage limits, be unavailable, or have provider data-handling terms that should be reviewed before deployment.

The page's “LIVE” label is a visual label; it does not automatically check whether OpenRouter is available. The endpoint has basic input limits but does not currently provide full public abuse protection or rate limiting.

## 8. How to check that the site works

With the server running, open the local address in your browser:

1. Check the page on a large screen, then make the browser narrow or use a phone-sized view. Open the mobile menu and try its links.
2. Click “View resume” and check that the PDF opens.
3. In the AI Twin, ask: “What education does Peter have?” Check the answer against the resume.
4. Ask something that the resume does not say. The assistant should say the detail is not available rather than make it up. AI answers can vary, so review them carefully.
5. Try a suggested question, send a message, and see whether the answer appears. If it fails, read the message and look in the server terminal for clues; do not copy secrets into a report.

This is a **manual check**: a person uses the site and observes it. The project does not currently define an automated test command in `package.json`. A successful local check does not prove a future hosted website will work, because the hosted environment has its own settings and network.

To check whether the website can be built for production, run:

```bash
npm run build
```

This creates generated output in `.next/`. If the build succeeds, you can start that build locally with `npm run start`; stop any other server using the same port first. The `lint` script exists in `package.json`, but do not assume it works without checking it against the installed Next.js version.

## 9. How to make common changes

### Change a career role

Open `app/page.jsx`, find `const timeline`, and edit the correct role, company, date or description. Save and check the Career Journey section. If the facts should also change the AI's answers, update the written profile in `app/api/chat/route.js` and the resume as appropriate. These are separate copies; they do not update each other automatically.

### Change a capability or page text

For the capabilities cards, find `const capabilityCards` in `app/page.jsx`. For other text, search that file for the words shown on the page. Edit carefully and check the result on desktop and mobile. The arrows and hover effects on capability and placeholder project cards are currently visual; those cards do not yet link to project pages.

### Change colours or spacing

Open `app/globals.css`. Colour variables such as `--ink` and `--acid` are near the top. Search for the class belonging to the part you want to change, such as `.timeline` or `.twin-chat`. CSS rules can affect more than one screen size, so review the result at different widths.

### Change a suggested chat question

Open `app/components/DigitalTwinChat.jsx` and find the `prompts` list. Edit a question and check that selecting it fills the input. The visitor still sends it using the send button or Enter.

### Update the AI's career knowledge

Open `app/api/chat/route.js` and find `PROFILE FACTS` inside `SYSTEM_PROMPT`. Add only facts Peter is willing to make public and send to the AI provider. Make sure they match the current resume. Do not add a secret, private customer data, or claims you cannot support. Test both a known fact and a question the profile cannot answer.

### Add real portfolio work later

The “Proof is in the build” section currently contains placeholders. Before replacing them, choose real projects, gather what problem each solved, Peter's contribution and the result, and collect any approved images or links. The deferred checklist is in `UI/Ux.md` if that file is available.

## 10. Keep secrets and generated files out of Git

An API key is like a password for a service. Never put it in source code, GitHub, a screenshot or a chat message. `.env` and `.env.*` are ignored here. A safe example file may use dummy values only, and may need an explicit exception in `.gitignore`.

Git has three useful stages:

1. A **working file** is the copy you edit.
2. The **staging area** holds the changes you choose for the next save in Git.
3. A **commit** is that saved snapshot. `git push` sends commits to the remote repository.

In Git Bash, inspect before committing:

```bash
git status --short
git diff
git diff --cached
```

`git diff` shows unstaged changes in tracked files. `git diff --cached` shows what is staged. Open untracked files separately to review them: they do not appear in a normal `git diff`. Stage only the files you intend to include:

```bash
git add tutorial.md
git diff --cached
git commit -m "docs: update beginner tutorial"
```

The commit includes **all staged changes**, not just the file most recently added. Check the whole staged diff first. If you have staged changes for another task, decide whether to commit them separately. `git push` later sends commits, not uncommitted files. See `do_not_commit.md` for more examples, including how to stop tracking generated files that were committed earlier.

## 11. Understanding Git file states

Imagine Git as a photo album for your project. Your **working folder** is where you edit files. The **staging area**, also called the **index**, is a tray where you choose what to include in the next photo. A **commit** is the saved photo. Git saves the staged version of a file, so if you edit it again after staging, the newer edit is not included until you stage it too.

| Word | What it means |
| --- | --- |
| **Untracked** | Git sees a new file but has not been asked to include it yet. For example, a new `notes.md` starts untracked unless it is ignored. |
| **Tracked** | Git knows about the file because it was added to the staging area or is part of a previous commit. A tracked file can be unchanged, modified, staged or deleted. |
| **Modified** | A tracked file has changed compared with the version Git is comparing it with. The change can be staged or unstaged. |
| **Unstaged** | The current change in your working folder has not been selected for the next commit. It stays on your computer when you commit other staged changes. |
| **Staged** | A particular version of a file or deletion has been selected for the next commit. If you edit that file again, it can have both staged and unstaged changes at once. |
| **Committed** | The staged changes have been saved in a commit in your local Git history. |
| **Ignored** | An ignore rule tells Git to normally leave a matching untracked file out of the list and out of ordinary `git add` commands. Ignoring does not make an already tracked file untracked. |
| **Deleted** | A tracked file has been removed from the working folder, or its removal from tracking has been staged. `git status` tells you which. |
| **Pushed** | Commits have been sent to a remote repository, such as GitHub. Uncommitted work is not sent by `git push`. |

For example, if you create `notes.md`, it starts untracked. Run `git add notes.md` and its current contents become staged. Run `git commit -m "docs: add notes"` and Git saves those staged contents in a local commit. Edit the file again and it becomes modified with an unstaged change. The file remains tracked throughout.

### How to see the states

In Git Bash, run:

```bash
git status
```

Git groups files under headings such as **Changes to be committed** (staged), **Changes not staged for commit** (unstaged changes to tracked files), and **Untracked files**. An untracked file can be opened in your editor for review before you add it.

For a shorter view:

```bash
git status --short
```

The first two positions on each line show the staged and unstaged state. For example, `M  tutorial.md` means a modification is staged; ` M tutorial.md` means a modification is unstaged; `MM tutorial.md` means both exist; `A  notes.md` means a new file is staged; and `?? notes.md` means it is untracked. `D` means a deletion. The space in each example matters.

### How to move changes between states

```bash
git diff                          # Review unstaged changes to tracked files
git add tutorial.md               # Stage the file's current contents
git diff --cached                 # Review all staged changes
git restore --staged -- tutorial.md  # Unstage it; keep its working file
git commit -m "docs: update tutorial" # Commit all staged changes locally
git push                          # Send local commits to the configured remote
```

`--cached` in `git diff --cached` means “compare the staging area with the last commit.” It does not mean a web cache. In `git rm --cached`, it tells Git to stage removal from tracking while keeping the local file. That removal affects future commits and checkouts after it is committed.

Be careful with `git restore -- tutorial.md`: unlike `git restore --staged`, it discards unstaged edits to the working file. It may not be possible to recover edits that were never saved in Git. Review `git status` and `git diff` before using it.

## 12. Writing clear commit messages

A commit is a saved snapshot of the changes you staged. Its message tells your future self and other people what changed. Some teams use a pattern called **Conventional Commits**. Git does not require this pattern, but it makes the history easier to scan and can help release tools understand changes.

The usual shape is:

```text
type: short description
```

For example, `feat: add mobile navigation` means the commit adds a feature. The word before the colon is the **type**; the words after it describe the change. Use a meaningful description rather than just `chore` or `fix` on its own.

These are commonly used types. Only `feat` and `fix` have special meaning in the Conventional Commits specification; the others are useful conventions that a team may choose to use. There is no single complete list required by Git.

| Type | When to use it | Example |
| --- | --- | --- |
| `feat` | Add a feature people can use. | `feat: add mobile navigation` |
| `fix` | Correct something that is broken or behaves incorrectly. | `fix: show an error when chat fails` |
| `docs` | Change documentation or explanations. Use `docs`, not `doc`, if following this common spelling. | `docs: update beginner tutorial` |
| `style` | Change formatting or visual presentation without changing the intended behaviour. | `style: improve timeline spacing` |
| `refactor` | Reorganise existing code without intentionally changing what it does. | `refactor: simplify chat message handling` |
| `perf` | Make something faster or use fewer resources. | `perf: reduce image loading time` |
| `test` | Add or update tests that check the software. | `test: add chat response checks` |
| `build` | Change how the project is built or its dependencies. | `build: update website dependencies` |
| `ci` | Change automatic checks or workflows that run on a service such as GitHub Actions. CI means continuous integration. | `ci: run checks on pull requests` |
| `chore` | Do routine project housekeeping that does not fit a more specific type. | `chore: stop tracking generated files` |
| `revert` | Undo an earlier change. | `revert: remove mobile navigation change` |

Teams may also use other labels such as `security` or `config`; agree on the meaning within the project. Use the clearest type for the main purpose of the commit. For example, a CSS change that fixes a broken mobile menu could use `fix`, even though it changes styles. A dependency update might use `build` or `chore`, depending on the team's convention.

You can add a **scope** in parentheses to say which part changed:

```text
fix(chat): handle an unavailable AI provider
docs(tutorial): explain commit messages
```

A **breaking change** is a change that requires people using the software to change something for it to keep working. If a team uses Conventional Commits, it can mark one with `!`, for example `feat(api)!: change the response format`, and explain the details in the commit body. Do not add `!` for an ordinary change.

In Git Bash, after staging and reviewing the right files, create the commit like this:

```bash
git diff --cached
git commit -m "docs: explain commit message types"
```

The quotation marks keep the message together as one piece of text. The commit includes **all** staged changes, so always review them first. For a larger change, `git commit` without `-m` opens your Git-configured editor, where you can add a short title, a blank line and a longer explanation. Save and close the editor to finish the commit.

## 13. Troubleshooting

**The website address does not open.** Check that `npm run dev` is still running and use the exact address it printed. If the port is busy, check whether another server is already running.

**The chat says the key is not configured.** Check that `.env` is in the project root and contains the correctly named `OPENROUTER_API_KEY`. Do not print or share its value. Restart the server after changing it.

**The chat is temporarily unavailable.** Check the terminal for a useful error, your connection, the configured key and provider availability or limits. The public message intentionally avoids exposing detailed provider errors. A free model can be unavailable or rate limited.

**A certificate error appears on this Windows computer.** Node may not trust a certificate used by the connection. The `--use-system-ca` setting in section 5 worked for a local endpoint check here. A certificate error can have different causes; find out why a certificate is present and trusted. Never solve this by turning off certificate validation.

**The chat gives a wrong answer.** Compare the written profile in `route.js` with the resume and check the question. AI can still make mistakes even with instructions. Correct outdated facts and test again.

**A Git status list shows generated files.** The project ignores `.next/`, but ignore rules alone do not remove files already tracked by Git. Follow the repository cleanup instructions in `do_not_commit.md`; review staged changes before committing.

## 14. When you are ready to deploy

Deployment is putting the site on a hosting service so people can visit it. It is a later task; running locally does not publish it.

Before making it public, review the site and resume, add abuse and rate-limit protections appropriate for a public chat, check the provider's current privacy and free-model terms, and configure the real `OPENROUTER_API_KEY` in the hosting service's secret environment settings. Do not upload `.env` or put the key in browser code. Deployments may have different Node versions, network and certificate settings, and provider limits. After deploying, test the chat and other links on the live address as well.

## 15. A small glossary

- **`localhost`:** Your own computer when it acts as a server.
- **`npm ci`:** Installs the project's locked dependency versions for a clean setup.
- **`npm run dev`:** Starts the local development server.
- **`npm run build`:** Produces a build intended for production.
- **`npm run start`:** Starts the built application locally.
- **Prompt:** Instructions or a question sent to an AI model.
- **Grounding:** Supplying information for the AI to use. It helps but does not guarantee correctness.
- **API key:** A secret used to identify and authorise access to a service.
- **Staged:** Selected for the next Git commit. `--cached` in `git diff --cached` refers to this staging area.
- **Tracked:** A file Git knows about. An ignored file is normally left out when it is untracked.
