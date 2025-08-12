
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-green').trim();

background_hex_color(color);

slide_index = 4;

//Initial Slideshow render
go_to_slide(slides[3]);