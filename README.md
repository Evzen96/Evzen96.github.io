# Lukáš Gajdoš — Personal CV Website

Live site: [evzen96.github.io](https://evzen96.github.io)

Personal portfolio and CV website built with vanilla HTML, CSS and JavaScript. No frameworks, no dependencies.

---

## Features

- **Animated intro splash** with smooth fade-out
- **Particle background** canvas animation in the hero section
- **Typewriter effect** cycling through job titles
- **Interactive timeline** — click to expand/collapse each role
- **Animated skill bars** triggered on scroll
- **Radar chart** for skill distribution overview
- **Dark / Light mode** toggle with localStorage persistence
- **Scroll progress bar** at the top of the page
- **Copy to clipboard** for email and phone number
- **Print / PDF export** via browser print dialog
- **Fully responsive** — mobile, tablet, desktop
- **Keyboard accessible** — timeline navigable via keyboard

---

## Project Structure

```
evzen96.github.io/
├── index.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS, CSS Variables, CSS Grid, Flexbox |
| Logic | Vanilla JavaScript (ES6+) |
| Animations | CSS keyframes, IntersectionObserver API |
| Background | HTML5 Canvas |
| Hosting | GitHub Pages |

---

## Local Development

No build step required. Just clone and open in a browser:

```bash
git clone https://github.com/Evzen96/evzen96.github.io.git
cd evzen96.github.io
# Open index.html in your browser, or use a local server:
npx serve .
```

---

## Deployment

The site is deployed automatically via **GitHub Pages** from the `main` branch of the `evzen96.github.io` repository. Any push to `main` triggers a redeploy within ~1 minute.

---

## License

This project is open source and available under the [MIT License](LICENSE).
