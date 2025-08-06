
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-purple').trim();

background_hex_color(color)