
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-purple').trim();

background_hex_color(color);

slide_index = 6;

//Initial Slideshow render
go_to_slide(slides[5]);