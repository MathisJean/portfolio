
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-orange').trim();

background_hex_color(color);

slide_index = 2;

//Initial Slideshow render
go_to_slide(slides[1]);

if(mobile_media_query.matches)
{
    slides.forEach(element =>
    {
        const p = element.querySelector("p");
        const click = element.getAttribute('onclick');

        if(p && click)
        {
            const match = click.match(/window\.open\(['"](.+?)['"]/);

            if(match)
            {
                const url = match[1];
                p.onclick = () => window.open(url, '_blank');
            };
        }

        element.removeAttribute('onclick');

        element.onclick = function ()
        {
            go_to_slide(this)
        };
    });
}