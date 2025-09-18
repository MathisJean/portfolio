
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-orange').trim();

background_hex_color(color);

slide_index = 2;

//Initial Slideshow render
go_to_slide(slides[1]);

feature_cards = feature_cards.filter((_, index) => index !== 0);

function click_handler(event)
{
    event.preventDefault();

    hint_click.style.animation = "none"; //Stop Animation
    void hint_click.offsetHeight; //Force Reflow
    hint_click.style.opacity = 0;

    feature_cards.forEach(card => 
    {
        card.removeEventListener("mousedown", click_handler, { passive: false }); //Remove Event Listener
    });
}

feature_cards.forEach(card => 
{
    card.addEventListener("mousedown", click_handler, { passive: false }); //Remove Event Listener
});

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