CapyPal — static prototype

What I built
- A small static prototype based on your Figma link: landing screen with video background, sign up / login modals, and a simple `home.html` dashboard.

Files added/changed
- `index.html` — updated landing page and links to `style.css` + `app.js`
- `style.css` — styles for the entrance and dashboard
- `app.js` — minimal JS to open modals and navigate to `home.html`
- `home.html` — a basic dashboard

How to try locally
- Open `index.html` in your browser (double-click or use Live Server extension in VS Code).

Notes & next steps
- I couldn't automatically export assets from the Figma prototype; if you want the design matched exactly I can either:
  - Use exported images/SVGs you provide, or
  - Use a Figma access token to pull assets programmatically and continue implementing exact styles.

What I suggest next
1) Tell me which screens from your Figma you want prioritized (e.g., tasks flow, focus timer, onboarding).
2) If you want exact styles, upload exported assets or grant Figma access.
3) I can wire a small backend (Node/Express + SQLite) for auth and task persistence, or implement localStorage first for a quick demo.
