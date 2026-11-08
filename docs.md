# Peter Falase Portfolio: Beginner's Guide

This guide assumes you are new to websites and coding. It explains what is in this repository, what the important files do, and how the pieces work together.

## What this website is

This is a personal portfolio website for Peter Falase. A portfolio is a public profile that introduces someone's work and gives visitors ways to contact them. This one presents Peter as an IT and digital operations professional in Abuja, Nigeria. It contains an introduction, career timeline, skills/capabilities, example work themes, contact details, a resume link, and an optional AI chat called the Digital Twin.

The portfolio content is served by the website itself. The Digital Twin is different: when a visitor asks a question, the browser sends it to this project's server, which forwards it to OpenRouter using a private API key. The chat will not return AI answers without that key.

## First: understand the folders

The **project root** is this repository's main folder: `C:\Users\DELL\Software Projects\peterfalase_website`. It is the folder containing `package.json`. Run npm commands from here.

| Folder | What it is for | Should it normally be committed? |
| --- | --- | --- |
| `.git/` | Git's private database of commits, branches, and repository history. | No; Git manages it. |
| `app/` | The website source: page, layout, CSS, chat interface, and chat server endpoint. | Yes. |
| `public/` | Files that the browser can request directly, such as the resume PDF. | Yes, when they are intentional site assets. |
| `output/playwright/` | Browser screenshots captured while reviewing the design. | Usually no; keep only if a particular screenshot is deliberately being used as a project reference. |
| `.next/` | Files Next.js generates while developing or building the site. | No. Git currently tracks this folder, which should be corrected. |
| `node_modules/` | Installed JavaScript packages downloaded by npm. | No; recreate from the package files. |

The repository also has root-level configuration and documentation files described below. There is no separate `src/` folder; the `app/` folder is the application source.

## How the pieces work together

```text
Visitor's browser
  ├─ requests the home page ──> app/page.jsx
  │                              ├─ app/globals.css styles it
  │                              └─ DigitalTwinChat.jsx runs the interactive chat UI
  └─ submits a chat question ──> app/api/chat/route.js
                                 └─ OpenRouter AI service (needs a private API key)
```

Next.js is the framework that runs this project. React is the user-interface library used by Next.js. JSX is JavaScript with HTML-like tags, used to describe the page. CSS controls appearance. npm installs and runs the packages listed in `package.json`.

## Every project file

### Git and setup

- **`.gitignore`** — Tells Git which files to leave out of future commits. It currently ignores `.env` and `node_modules`, but it needs to ignore `.next/`, `.npm-cache/`, and temporary outputs too. It cannot untrack files already committed by itself.
- **`AGENTS.md`** — Instructions for coding agents working in this repository. It contains a project-specific warning that this installation of Next.js can differ from familiar versions and says to read its local documentation before changing application code.
- **`CLAUDE.md`** — Contains `@AGENTS.md`, so Claude Code can reuse the shared repository instructions instead of maintaining a second copy.
- **`package.json`** — The project identity, dependency list, and named npm commands. `npm run dev` starts development mode; `npm run build` creates an optimized build; `npm run start` serves a completed build. The current `lint` script uses `next lint`, which the existing review reports is not supported by this Next.js version.
- **`package-lock.json`** — npm's exact dependency-version record. Commit this alongside `package.json` so different computers can install a consistent dependency tree with `npm ci`.
- **`next.config.js`** — Small Next.js configuration file. It enables React strict mode and lists accepted local development origins.
- **`.env` (if present locally)** — Private local settings such as `OPENROUTER_API_KEY`. Never commit a real key. The repository ignores `.env`; create a local environment file yourself if you want the chat to call OpenRouter.

### Website source (`app/`)

- **`app/layout.js`** — The outer wrapper for every page. It imports the global CSS and sets the browser page title and description. The root layout also provides the HTML and body elements.
- **`app/page.jsx`** — The home page at `/`. It contains the hero/introduction, navigation, about section, career timeline, capability cards, portfolio placeholders, contact details, and resume link. The career and capability cards are stored as JavaScript arrays and rendered in loops, so the same markup pattern can display multiple entries. It imports the Digital Twin chat component.
- **`app/globals.css`** — The site-wide visual styling: colors, typography, layout, animation, and smaller-screen rules. The CSS class names in this file are used by elements in `page.jsx` and `DigitalTwinChat.jsx`.
- **`app/components/DigitalTwinChat.jsx`** — The interactive chat panel. React state stores what the visitor typed, the displayed conversation, and whether a reply is loading. On submit it sends the conversation to `/api/chat`, then displays the reply or an error.
- **`app/api/chat/route.js`** — The server endpoint for `POST /api/chat`. It adds Peter's career profile and behavior instructions, sends the request to OpenRouter, and returns the answer. The API key is read on the server from `OPENROUTER_API_KEY`; it should never be put in browser code or a `NEXT_PUBLIC_` variable.

### Public assets and supporting documents

- **`public/Peter_Falase_Professional_Resume_2026.pdf`** — The resume exposed as a public website file. The page links to `/Peter_Falase_Professional_Resume_2026.pdf`. Anyone who can visit the deployed site can download it, so include only a resume intended for public sharing.
- **`Peter_Falase_Professional_Resume_2026.pdf`** — A second copy at the repository root. The existing review reports that it is identical to the `public/` copy. The web app uses the `public/` file. Keep the root copy only if it serves a separate human workflow; otherwise remove it after confirming no outside process depends on it.
- **`tutorial.md`** — A longer earlier beginner walkthrough, including an explanation of the chat implementation. Some paths and descriptions in older walkthroughs can drift as the app changes; use this guide and the current source as the reference for the current layout.
- **`review.md`** — Code review notes: findings, their impact, and recommended fixes. It is advisory documentation, not code that the website runs.
- **`docs.md`** — This beginner-oriented map of the repository and instructions for running it.

### Generated files and review captures

- **`.next/`** — Generated build and development output. Next.js recreates it. It is not source code and should not be committed. It is currently tracked in Git, so it must be removed from Git's index (without deleting a developer's local copy) after adding an ignore rule.
- **`output/playwright/*.png`** — Saved browser screenshots such as desktop, mobile, and chat captures. They document past visual checks, not application inputs. Usually remove them from version control; retain selected ones only if the team wants them as approved design references.
- **`node_modules/`** — Downloaded package files. It can be large and is recreated by npm. Do not commit it.

## Run the website, step by step

You need Node.js and npm installed. Open PowerShell and enter the project root:

```powershell
cd "C:\Users\DELL\Software Projects\peterfalase_website"
```

Install dependencies the first time (or after dependency files change):

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Leave that PowerShell window running, then visit **http://localhost:3000** in a browser. To stop the server, focus the PowerShell window and press **Ctrl+C**.

The regular portfolio page does not need an AI key. For AI replies, configure `OPENROUTER_API_KEY` in a local `.env` file in the project root, then restart the dev server. Keep that file private and never paste the key into source files, screenshots, or Git. If the key is missing, the chat endpoint reports a configuration error.

For a production-style local check, run `npm run build` from the same root folder and then `npm run start`. A build must exist before the start command can serve it.

## Git: what to commit

Commit files that are source, configuration, or useful human documentation: `app/`, `public/` assets that belong on the site, `package.json`, `package-lock.json`, `next.config.js`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `docs.md`, `review.md`, and `tutorial.md` when they are current and maintained. Commit the public resume only if it is approved for public distribution.

Do not commit `.env` or any real API key, `node_modules/`, `.next/`, `.npm-cache/`, temporary logs, or incidental browser screenshots. Do not remove a file just because it is generated if it has already been committed without first cleaning the Git index and agreeing on whether the file is a retained reference.

## Useful beginner vocabulary

- **Repository / repo:** the project folder plus its Git history.
- **Dependency:** code this project uses but did not write itself, such as Next.js and React.
- **Install:** download dependencies into `node_modules/` using npm.
- **Development server:** a local server that lets you preview the site while editing it.
- **Route:** an address handled by the app. `/` is the home page; `/api/chat` is the chat server endpoint.
- **Environment variable:** a setting provided to the server at runtime. It is a safer place for secrets than source code.
- **Build output:** generated files made for running or deploying the site; these can generally be recreated from source.
