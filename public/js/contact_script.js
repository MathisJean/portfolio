
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-orange').trim();

background_hex_color(color)