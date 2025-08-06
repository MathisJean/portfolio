
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-green').trim();

background_hex_color(color)