# 🌏 Which State Am I? — H2S Mini Challenge 2

![CI](https://github.com/Anuj23105/which-state-am-i/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)

An interactive web app that captures the **culture, food & vibe** of my home state through an AI-generated image and a set of clues — **without ever naming the state**. Visitors read the clues, view the image, and guess!

🔒 The answer is stored only as a **one-way SHA-256 hash**, so the state name appears nowhere in the code, the page, or the image. The secret stays secret — and the challenge stays fair.

## 🚀 Live Demo
> Deployed link goes here after you deploy (see steps below).

## 🛠️ Tech
- Pure HTML, CSS & vanilla JavaScript (ES modules, no build step)
- Web Crypto API for hash-based answer checking
- Vitest for unit tests

## ✅ Testing
Logic lives in small, pure functions (`normalize`, `sha256`, `buildResult`,
`checkAnswer`) so it can be tested in isolation.

```
npm install   # one-time
npm test      # run the unit tests
npm run coverage  # run with coverage report
```

## ♿ Accessibility
- Skip-to-content link, semantic landmarks and labelled sections
- A real `<label>` for the input and a `role="status"` / `aria-live` result region
- Visible keyboard focus styles and `prefers-reduced-motion` support
- Explicit image dimensions to avoid layout shift

## 🖼️ Add your AI image
Generate an image with the prompt below, save it as `assets/state.jpg`.

**Image prompt (no state name, no text):**
```
A breathtaking cinematic wide shot of a vast horseshoe-shaped waterfall in a dense
central-Indian forest, milky monsoon water cascading over a wide red-rock ledge into
a misty gorge, surrounded by lush green sal trees. In the foreground, a tribal artisan
weaves intricate bell-metal "dhokra" figurines using the lost-wax technique. Nearby,
women in handwoven kosa silk sarees with tribal silver jewelry carry brass pots,
golden paddy fields stretching to the horizon. Warm golden-hour light, soft mist,
earthy red-and-ochre palette, photorealistic, 8k, National Geographic style.
no text, no watermark, no letters.
```

## 💻 Run locally
Just open `index.html` in a browser. (Or run a tiny server: `python -m http.server`.)

## 📂 Structure
```
index.html         # page markup (semantic + accessible)
style.css          # styling
script.js          # hash-based guess checker (ES module, exported pure fns)
tests/             # Vitest unit tests
vitest.config.js   # test config (jsdom)
assets/            # put state.jpg here
```
