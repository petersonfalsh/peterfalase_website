# Peter Falase Portfolio: Beginner Tutorial

This tutorial explains how the website works, how to run it, and how the Digital Twin chat was added.

It is written for someone who is new to frontend coding. You do not need to understand every line immediately. The goal is to give you a mental model of the project so you can safely explore it and gradually make changes.

## 1. What was built

The project is a professional portfolio website for Peter Falase. It combines:

- A bold, editorial-style portfolio layout.
- A career summary based on the supplied professional profile.
- An about section.
- A career journey timeline.
- A capabilities section.
- A future portfolio section for case studies.
- Contact links for email and phone.
- A conversational AI Digital Twin that answers questions about Peter's career.

The website is currently available locally at:

```text
http://localhost:3000
```

The Digital Twin is available on the page under the section titled **Ask the operator**.

## 2. Technology summary

### Next.js

Next.js is the main application framework. It provides:

- A way to build pages with React.
- File-based routing.
- Server-side code through API routes.
- Production builds and local development tools.

This project uses the Next.js App Router. In this style of Next.js project, files inside the `app` folder define pages and server endpoints.

### React

React is the user-interface library underneath Next.js. The page is made from components. A component is a reusable piece of interface, such as:

- A navigation bar.
- A timeline item.
- A chat message.
- A button or form.

React also manages interactive state. For example, the Digital Twin uses React state to remember:

- The messages currently visible in the conversation.
- The text currently typed into the input.
- Whether a response is being loaded.

### JavaScript and JSX

The application uses JavaScript files with JSX syntax:

- `.js` files contain regular JavaScript.
- `.jsx` files can contain JavaScript plus HTML-like JSX markup.

For example:

```jsx
const greeting = <p>Hello, Peter.</p>;
```

JSX is not a separate language. Next.js compiles it into JavaScript that the browser can understand.

### CSS

The visual design is built with regular CSS in:

```text
app/globals.css
```

There is no utility CSS framework in this project. The styles are written directly using class names, CSS variables, responsive media queries, gradients, borders, shadows and animations.

### OpenRouter

OpenRouter provides the AI model request. The website uses the OpenRouter chat completions endpoint and sends the model name:

```text
stealth/ox-alpha
```

The browser does not call OpenRouter directly. Instead, it calls the local Next.js API route. The API route reads the secret key from the server environment and then calls OpenRouter.

This separation is important because an API key must not be placed in browser code.

## 3. Project structure

The important files are:

```text
my_website/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js
│   ├── components/
│   │   └── DigitalTwinChat.jsx
│   ├── globals.css
│   ├── layout.js
│   └── page.jsx
├── public/
│   └── Peter_Falase_Professional_Resume_2026.pdf
├── .env
├── next.config.js
├── package.json
├── package-lock.json
└── tutorial.md
```

### `app/page.jsx`

This is the main portfolio page. It contains:

- The navigation header.
- The hero section.
- The ticker strip.
- The about section.
- The career timeline.
- The capabilities cards.
- The Digital Twin component.
- The future portfolio cards.
- The contact section.

### `app/components/DigitalTwinChat.jsx`

This is the interactive browser-side chat component. It displays messages, handles the form, sends questions to `/api/chat`, and displays the response.

### `app/api/chat/route.js`

This is a server-side API endpoint. It receives chat messages from the browser, adds the Digital Twin instructions, calls OpenRouter, and sends the model response back to the browser.

### `app/globals.css`

This contains the design system and layout rules for the entire site:

- Colors.
- Spacing.
- Typography.
- Hero layout.
- Timeline layout.
- Cards.
- Chat panel.
- Mobile responsive behavior.

### `app/layout.js`

This is the outer application layout. It imports the global stylesheet and defines the browser metadata, such as the page title and description.

### `public/`

Files in `public` can be requested directly by URL. The resume is copied there so the resume button can open it at:

```text
/Peter_Falase_Professional_Resume_2026.pdf
```

### `.env`

This stores environment variables for the local application. The key name used by the chat route is:

```text
OPENROUTER_API_KEY=your-private-key
```

The real value should remain private. Never paste the real key into `page.jsx`, `DigitalTwinChat.jsx`, CSS, screenshots, GitHub, or documentation.

## 4. How to run the project

Open PowerShell in the `my_website` directory.

### Install dependencies

If dependencies have not been installed yet:

```powershell
npm install
```

This reads `package.json` and installs the packages listed there. `package-lock.json` records the exact dependency tree used by npm.

### Start development mode

```powershell
npm run dev
```

Then open:

```text
http://localhost:3000
```

Development mode watches for file changes and refreshes the browser when you save.

### Build for production

```powershell
npm run build
```

This checks whether Next.js can compile and optimize the application.

### Start the production build

```powershell
npm run start
```

This serves the build created by `npm run build`.

## 5. High-level walkthrough

The application can be understood as four layers:

```text
Browser page
    ↓
React components and CSS
    ↓
Next.js server route
    ↓
OpenRouter model
```

For the normal portfolio content:

1. The browser requests `/`.
2. Next.js renders `app/page.jsx`.
3. `app/globals.css` provides the layout and styling.
4. The browser displays the completed portfolio page.

For the Digital Twin:

1. A visitor types a question into the chat box.
2. React stores the text in component state.
3. The browser sends the conversation to `/api/chat`.
4. The Next.js route reads `OPENROUTER_API_KEY` from `.env`.
5. The route adds the career profile instructions.
6. The route sends the request to OpenRouter using `stealth/ox-alpha`.
7. OpenRouter returns a response.
8. The route sends only the response text back to the browser.
9. React adds the response to the chat window.

The key is never sent to the browser.

## 6. Reviewing the main page

### The page starts as a client component

At the top of `app/page.jsx`:

```jsx
"use client";

import DigitalTwinChat from "./components/DigitalTwinChat";
```

`"use client"` tells Next.js that this page can use browser-side React behavior. The import brings the Digital Twin component into the page.

The Digital Twin itself also has `"use client"`, because it uses state and browser event handlers.

### Reusable SVG icons

The page defines small icon components instead of adding an icon package:

```jsx
const ArrowUpRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 19 19 5M8 5h11v11"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
```

Important ideas:

- `const ArrowUpRight = ...` creates a reusable component.
- `{ size = 18 }` provides a default size.
- `currentColor` makes the SVG use the CSS text color of its parent.
- `aria-hidden="true"` tells assistive technology that this icon is decorative because nearby text explains the action.

### Data-driven career timeline

The career entries are kept in an array:

```jsx
const timeline = [
  {
    year: "2024 — now",
    role: "IT & Digital Operations Lead",
    company: "Monoliza Sport & Recreational Center",
    tag: "OPERATIONS / SYSTEMS",
    body: "Keeping workplace technology dependable while turning booking, membership, invoicing and tournament administration into clearer, repeatable digital workflows.",
  },
  // More entries follow...
];
```

Then the page loops through the array:

```jsx
{timeline.map((item, index) => (
  <article
    className={`timeline-item ${index === 0 ? "current" : ""}`}
    key={`${item.year}-${item.company}`}
  >
    <div className="timeline-meta">
      <span className="timeline-number">0{index + 1}</span>
      <span>{item.year}</span>
    </div>

    <div className="timeline-content">
      <div className="tag">{item.tag}</div>
      <h3>{item.role}</h3>
      <p className="company">{item.company}</p>
      <p>{item.body}</p>
    </div>
  </article>
))}
```

This is better than writing five separate blocks by hand because changing a role only requires changing the data object. The layout remains consistent automatically.

### Navigation and page anchors

The navigation uses anchor links:

```jsx
<a href="#about">About</a>
<a href="#journey">Journey</a>
<a href="#digital-twin">AI Twin</a>
<a href="#portfolio">Portfolio</a>
```

Each target section has a matching `id`:

```jsx
<section className="digital-twin section-shell section-padding" id="digital-twin">
```

When a visitor clicks `AI Twin`, the browser scrolls to the element with `id="digital-twin"`.

The smooth scrolling effect is set in CSS:

```css
html {
  scroll-behavior: smooth;
}
```

### Adding the Digital Twin to the page

The page imports and renders the component like this:

```jsx
import DigitalTwinChat from "./components/DigitalTwinChat";

// ...other sections...

<DigitalTwinChat />

// ...portfolio and contact sections...
```

This keeps the chat code separate from the long portfolio page. A separate component is easier to test and maintain.

## 7. Reviewing the Digital Twin component

### Initial conversation state

The chat begins with a welcome message:

```jsx
const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hi — I’m Peter’s Digital Twin. Ask me about his career journey, systems work, current roles or technical background.",
  },
];
```

Each message has:

- An `id`, which React uses as a stable key.
- A `role`, either `user` or `assistant`.
- The visible `content`.

### React state

Inside the component:

```jsx
const [messages, setMessages] = useState(initialMessages);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
```

This creates three pieces of state:

1. `messages` stores the conversation.
2. `input` stores the current textarea value.
3. `isLoading` prevents duplicate requests and shows that the model is working.

When state changes, React re-renders the affected interface.

### Controlled textarea

The input field is controlled by React:

```jsx
<textarea
  value={input}
  onChange={(event) => setInput(event.target.value)}
  placeholder="Ask about Peter's career..."
  rows="1"
  aria-label="Ask the Digital Twin a question"
  disabled={isLoading}
/>
```

The important relationship is:

```text
User types → onChange runs → setInput updates state → textarea reflects state
```

The button is disabled when there is no question or when a request is already in progress:

```jsx
<button
  type="submit"
  disabled={!input.trim() || isLoading}
>
  <SendIcon />
</button>
```

### Submitting a question

The form handler first creates a user message:

```jsx
const content = input.trim();
if (!content || isLoading) return;

const userMessage = {
  id: `${Date.now()}-user`,
  role: "user",
  content,
};

const nextMessages = [...messages, userMessage];
setMessages(nextMessages);
setInput("");
setIsLoading(true);
```

The spread operator creates a new array containing the previous messages and the new message. React state should be updated with new values rather than mutating the old array directly.

### Calling the local API route

The browser calls the local endpoint:

```jsx
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: nextMessages.map(({ role, content: text }) => ({
      role,
      content: text,
    })),
  }),
});
```

This is a normal HTTP `POST` request. The body contains the conversation in JSON format.

The browser does not include the API key. It only sends the messages to the local Next.js route.

### Handling success and failure

On success, the returned response is added to the message list:

```jsx
const payload = await response.json();

if (!response.ok) {
  throw new Error(payload?.error || "Unable to reach the Digital Twin.");
}

setMessages((current) => [
  ...current,
  {
    id: `${Date.now()}-assistant`,
    role: "assistant",
    content: payload.message,
  },
]);
```

The `catch` block adds a friendly error message instead of leaving the visitor wondering what happened:

```jsx
catch (error) {
  setMessages((current) => [
    ...current,
    {
      id: `${Date.now()}-error`,
      role: "assistant",
      content: error.message || "I could not reach the Digital Twin just now. Please try again.",
      isError: true,
    },
  ]);
}
```

Finally, `finally` resets the loading state whether the request succeeded or failed:

```jsx
finally {
  setIsLoading(false);
}
```

### Scrolling the chat window

The component uses a `ref` to scroll the message panel to the newest message:

```jsx
const messagesRef = useRef(null);

useEffect(() => {
  if (messagesRef.current) {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }
}, [messages, isLoading]);
```

Whenever `messages` or `isLoading` changes, the effect runs and moves the scroll position to the bottom.

### Rendering safe formatting

The model may return simple Markdown-style bold text, such as:

```text
**IT operations**
```

The component converts bold markers into React `<strong>` elements instead of rendering raw asterisks:

```jsx
const renderMessageContent = (content) => content
  .split(/(\*\*[^*]+\*\*)/g)
  .map((part, index) => (
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
      : <span key={`${part}-${index}`}>{part}</span>
  ));
```

This is deliberately small and limited. It is not a full Markdown renderer.

## 8. Reviewing the server API route

The API route is located at:

```text
app/api/chat/route.js
```

In the App Router, a `route.js` file can export functions such as `POST`. The function name matches the HTTP method.

### Model configuration

The model is kept in a constant:

```js
const MODEL = "stealth/ox-alpha";
```

This makes the model easy to find and change later.

### The Digital Twin system prompt

The system prompt explains the role of the AI and supplies the career context:

```js
const SYSTEM_PROMPT = `You are Peter Falase's Digital Twin: a grounded, polished career assistant built from his professional profile.

Use only the profile facts below. Do not invent employers, dates, job titles, projects, awards, metrics, links or personal details.

PROFILE FACTS:
- Name: Peter Falase. Based in Abuja, Nigeria.
- Positioning: IT and digital operations professional focused on systems, automation and technical project coordination.
- Current roles: IT & Digital Operations Lead at Monoliza Sport & Recreational Center; IT & Project Coordination Officer at Threemplus Integrated Enterprises Ltd.
// More grounded profile facts follow...
`;
```

The prompt performs two jobs:

1. It tells the model how to behave.
2. It gives the model the facts it should use to answer questions.

The instruction not to invent facts is especially important for a career assistant. If the profile does not contain a detail, the assistant should say so instead of guessing.

### Reading the environment variable

The route reads the API key on the server:

```js
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  return NextResponse.json(
    { error: "OPENROUTER_API_KEY is not configured." },
    { status: 500 }
  );
}
```

`process.env` is Node.js and Next.js's interface for environment variables.

The key is intentionally not prefixed with `NEXT_PUBLIC_`. Variables with `NEXT_PUBLIC_` are designed to be exposed to browser code. This key must remain server-only.

### Validating and limiting messages

The route only accepts user and assistant messages:

```js
const cleanMessages = messages
  .filter(
    (message) =>
      ["user", "assistant"].includes(message?.role) &&
      typeof message?.content === "string"
  )
  .map((message) => ({
    role: message.role,
    content: message.content.trim().slice(0, 4000),
  }))
  .filter((message) => message.content.length > 0)
  .slice(-12);
```

This provides basic protection against:

- Unsupported message roles.
- Empty messages.
- Extremely long individual messages.
- An unlimited conversation growing forever.

The route also checks that at least one user message exists:

```js
if (!cleanMessages.some((message) => message.role === "user")) {
  return NextResponse.json(
    { error: "Please ask a question about Peter's career." },
    { status: 400 }
  );
}
```

### Calling OpenRouter

The actual provider request is made here:

```js
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Peter Falase Digital Twin",
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...cleanMessages,
    ],
    temperature: 0.45,
    max_tokens: 500,
  }),
  cache: "no-store",
});
```

Important pieces:

- `Authorization` sends the secret key as a bearer token.
- `model` selects `stealth/ox-alpha`.
- The system prompt is sent before the conversation.
- `temperature` controls how varied the answer may be. A lower value helps keep career answers focused.
- `max_tokens` limits the length of the generated response.
- `cache: "no-store"` avoids caching a personalized chat request.

### Reading the response

OpenRouter returns a chat completion object. The answer is extracted from the first choice:

```js
const payload = await response.json();

if (!response.ok) {
  const providerMessage =
    payload?.error?.message ||
    "OpenRouter could not complete the request.";

  return NextResponse.json(
    { error: providerMessage },
    { status: response.status }
  );
}

const message = payload?.choices?.[0]?.message?.content?.trim();

return NextResponse.json({ message, model: MODEL });
```

The browser receives only the response text and the model label. It never receives the API key.

## 9. Reviewing the layout and styling

### Design tokens

The stylesheet begins with CSS variables:

```css
:root {
  --ink: #0b0d0d;
  --paper: #f1f0eb;
  --acid: #adcf68;
  --acid-ink: #849c46;
  --lavender: #b9adff;
  --orange: #ff7257;
}
```

This is a small design system. Instead of repeating the same color everywhere, the styles refer to variables:

```css
.button-primary {
  background: var(--acid);
  color: var(--ink);
}
```

If you want to change the overall green accent, you can update `--acid` in one place.

### Section shell

Most sections use the `section-shell` class:

```css
.section-shell {
  width: min(1320px, calc(100% - 80px));
  margin: 0 auto;
  padding-inline: 32px;
}
```

This means:

- The section can grow up to 1320 pixels.
- It keeps space around itself on smaller screens.
- `margin: 0 auto` centers it.
- Horizontal padding protects text from touching the edges.

That last detail fixed the text clipping issue on the dark sections.

### Responsive layout

Responsive CSS changes the layout at different screen widths:

```css
@media (max-width: 950px) {
  .about-layout,
  .journey-intro,
  .portfolio-top,
  .capabilities-intro,
  .contact-layout,
  .twin-layout {
    grid-template-columns: 1fr;
    gap: 34px;
  }
}
```

On large screens, the twin introduction and chat panel sit side-by-side. Below 950 pixels, they stack vertically.

At a smaller mobile width, the chat panel becomes narrower and the message area gets slightly shorter:

```css
@media (max-width: 620px) {
  .twin-chat {
    box-shadow: 7px 7px 0 var(--acid);
  }

  .twin-messages {
    height: 310px;
  }
}
```

### The chat panel styles

The chat panel is intentionally a lighter surface against the dark section:

```css
.twin-chat {
  width: 100%;
  max-width: 620px;
  justify-self: end;
  background: #e8e9e2;
  color: var(--ink);
  border: 1px solid rgba(241, 240, 235, 0.4);
  box-shadow: 12px 12px 0 var(--acid);
}
```

The acid-colored shadow ties the chat panel back to the rest of the portfolio without making the chat text itself too bright.

## 10. How to customize the website

### Change your introduction

Open `app/page.jsx` and search for:

```jsx
Technology-focused operator and builder helping teams move from scattered processes to systems that work — reliably, visibly and with a little more intent.
```

Replace the text while keeping the surrounding `<p>` element.

### Add a career entry

Find the `timeline` array in `app/page.jsx` and add another object:

```jsx
{
  year: "2026 — now",
  role: "Your new title",
  company: "Your new company",
  tag: "NEW AREA",
  body: "A short, factual summary of the work.",
},
```

Do not forget the comma after the previous object.

### Change the accent colors

Edit the variables in `app/globals.css`:

```css
:root {
  --acid: #adcf68;
  --acid-ink: #849c46;
  --orange: #ff7257;
  --lavender: #b9adff;
}
```

The `--acid-ink` color is darker so it remains readable on the light paper sections.

### Change the Digital Twin's knowledge

Open:

```text
app/api/chat/route.js
```

Edit the `PROFILE FACTS` section inside `SYSTEM_PROMPT`.

Keep this information factual. If you add a new role, update the actual profile content and then update the prompt. Avoid adding confidential information that should not be sent to an AI provider.

### Change suggested questions

Open `app/components/DigitalTwinChat.jsx` and edit:

```jsx
const prompts = [
  "What does Peter do best?",
  "Tell me about his current roles.",
  "What kind of role is he open to?",
];
```

These buttons place a question in the chat input. The visitor can edit it before sending.

## 11. A safe beginner workflow for making changes

Use this cycle:

1. Make one small change.
2. Save the file.
3. Refresh the browser.
4. Check both desktop and mobile widths.
5. Check the browser console if something looks broken.
6. Run `npm run build` before considering the change finished.

For content changes, start with `app/page.jsx`.

For layout and colors, use `app/globals.css`.

For chat UI behavior, use `app/components/DigitalTwinChat.jsx`.

For the model, grounding instructions and API request, use `app/api/chat/route.js`.

## 12. Common beginner mistakes

### Putting the API key in a client file

Do not do this:

```jsx
const apiKey = "sk-or-v1-your-key";
```

Anything in client-side code can be sent to a visitor's browser and inspected. Keep the key in `.env` and only read it in `app/api/chat/route.js`.

### Using the wrong environment variable name

The route expects:

```text
OPENROUTER_API_KEY
```

If the name changes in `.env`, it must also change in `route.js`.

### Forgetting to restart after changing `.env`

Environment variables are usually loaded when Next.js starts. If you change the key, stop the server and run it again.

### Forgetting the `id` for an anchor target

This link:

```jsx
<a href="#digital-twin">AI Twin</a>
```

only works if the page includes:

```jsx
<section id="digital-twin">
```

### Mutating React state directly

Avoid:

```jsx
messages.push(newMessage);
setMessages(messages);
```

Prefer:

```jsx
setMessages((current) => [...current, newMessage]);
```

The second version creates a new array, which makes it easier for React to detect the update.

## 13. What was tested

The finished project was checked in several ways:

- The Next.js production build completed successfully.
- The homepage returned HTTP 200 locally.
- The Digital Twin API returned HTTP 200 for a real career question.
- The response came from the configured `stealth/ox-alpha` model.
- A real browser test filled the chat input, clicked Send, waited for the provider response and displayed the answer.
- The Digital Twin layout was checked at desktop and mobile widths.
- The resume file remained available through the public URL.

## 14. Five self-review suggestions

1. **Add rate limiting and abuse protection.** The current route validates messages and limits their size, but it does not limit how many requests one visitor can send. A production version should add rate limiting, bot protection or an authenticated usage layer.

2. **Use a real Markdown renderer with sanitization.** The current chat supports a small subset of bold formatting. A carefully configured Markdown renderer could support headings and lists more reliably, as long as the output is sanitized before rendering.

3. **Move career facts into a dedicated data file.** The profile facts currently live inside the long system prompt. Moving them into a structured file would make it easier to update the website copy and the AI knowledge together, while reducing duplication.

4. **Add automated tests for the API route and chat component.** The current behavior was manually tested in a real browser. Automated tests could verify invalid requests, missing API keys, provider errors, loading states and successful responses on every future change.

5. **Add streaming responses and stronger observability.** The current chat waits for the complete model response before displaying it. Streaming would make the chat feel faster, while structured server logs and provider request IDs would make production troubleshooting easier.
