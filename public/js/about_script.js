
const root = document.documentElement;
const color = getComputedStyle(root).getPropertyValue('--accent-purple').trim();

background_hex_color(color);

slide_index = 6;

//Initial Slideshow render
go_to_slide(slides[5]);

feature_cards = feature_cards.filter((_, index) => index !== 5);

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