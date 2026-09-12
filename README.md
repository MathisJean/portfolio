# Portfolio

**A hex-grid personal portfolio site** — zoom-based navigation, no scrollbars, built entirely around a hexagon interaction model.

![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat-square&logo=ejs&logoColor=black)
![Status](https://img.shields.io/badge/status-offline%20%28domain%20expired%29-lightgrey?style=flat-square)

> [!NOTE]
> The live domain has since expired. This repo is the source for reference — see below for what it looked like and how it worked.

---

## The concept

The entire site is a grid of hexagons on a pulsing grey background with a blue navbar. Every hex flips and darkens on hover, then reverts when you move away. Certain hexes are special — they hold an image and expand on hover instead of just flipping.

**Navigation is zoom, not scroll.** You move between and within pages using the mouse wheel to zoom in and out — there's no traditional scrolling anywhere on the site.

## Pages

| Page | What's on it |
|---|---|
| **Home** | Photos of me, with the tagline *"this is me"* |
| **Projects** | Screenshots of my projects, plus a terminal window that fades in as you zoom out — the terminal actually runs my [terminal graphing calculator](https://github.com/MathisJean/graphing_calculator) live |
| **About Me** | An image of the languages and tools I work with, plus a fractured image of my face split across the center hexes |
| **Contact** | A fading contact form and links to Credly, GitHub, itch.io, and LinkedIn |

## Stack

Server-rendered with EJS. The hex-grid interactions, hover states, and zoom-based navigation are hand-built rather than pulled from a UI framework.

---

*Personal project — status: offline pending domain renewal.*
