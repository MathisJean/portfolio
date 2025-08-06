
//----Elements from DOM----//
const showcase = document.querySelector(".hex_background")
const hero_title = document.querySelector(".hero_title") ? document.querySelector(".hero_title") : null;
const hero_subtitle = document.querySelector(".hero_subtitle") ? document.querySelector(".hero_subtitle") : null;
const centerpiece = document.querySelector("form") ? document.querySelector("form") : document.querySelector(".terminal") ? document.querySelector(".terminal") : null;

//----Fade Content In and Out----//

//Fade in Content on Load
window.addEventListener("DOMContentLoaded", () => 
{
    showcase.classList.add("fade_in");
});

//Fade out Content on Link Click
document.querySelectorAll("a").forEach(link =>
{
    link.addEventListener("click", (event) =>
    {
        const href = link.getAttribute("href");
        const is_blank = link.target === "_blank";

        //Ignore Anchor, Mailto, or target="_blank" Links
        if(is_blank || href.startsWith("#") || href.startsWith("mailto:")) return;

        //Prevent Default Behavior, Fade out, then Navigate
        event.preventDefault();
        showcase.classList.remove("fade_in");

        setTimeout(() => {
            window.location.href = href;
        }, 400);
    });
});

//----Scroll Zoom----//

let scale = 2; //Initial zoom
const min_scale = 1; //Min zoom out
const max_scale = 2.5; //Max zoom in
const scale_step = 0.05; //Zoom speed

let opacity = 0; //Inital opacity
const min_opacity = 0; //Min opacity
const max_opacity = 1; //Max opacity
const opacity_step = 0.05; //Opacity Fill Speed

//On Wheel Input
function scroll_zoom(event)
{
    event.preventDefault();

    if(event.deltaY < 0)
    {
        scale = Math.min(scale + scale_step, max_scale);

        opacity = Math.max(opacity - opacity_step, min_opacity);
    }
    else   
    { 
        scale = Math.max(scale - scale_step, min_scale);

        opacity = Math.min(opacity + opacity_step, max_opacity);
    }

    showcase.style.transform = `scale(${scale})`;    

    if(hero_title)
    {
        hero_title.style.opacity = opacity;
        hero_subtitle.style.opacity = opacity;
    }

    if(centerpiece)
    {
        centerpiece.style.opacity = 1 - opacity

        if(centerpiece.style.opacity == 0)
        {
            centerpiece.style.pointerEvents = "none"
        }
        else
        {
            centerpiece.style.pointerEvents = "all"
        };
    }
};

document.addEventListener("wheel", scroll_zoom, { passive: false })

//Remove Hint Once Scrolling
const hint = document.querySelector(".hint");
function scroll_handler(event)
{
    event.preventDefault();

    hint.style.animation = "none"; //Stop Animation
    void hint.offsetHeight; //Force Reflow
    hint.style.opacity = 0;

    document.removeEventListener("wheel", scroll_handler, { passive: false }); //Remove Event Listener
}

document.addEventListener("wheel", scroll_handler, { passive: false });

//Hex Animation on Hover
Array.from(showcase.querySelectorAll(".hex")).forEach(hex => 
{
    hex.addEventListener("mouseenter", rotate_hex)
    hex.addEventListener("click", reset_hex);
})

//Function to Rotate Hexes
function rotate_hex(event)
{
    let hex = event.target.classList.contains("hex") ? event.target : event.target.parentNode;
    let p = hex.querySelector("p");

    hex.style.transform = "rotateY(180deg)";
    hex.style.backgroundImage = "none";
    hex.style.backgroundColor = hex.dataset.bgColor || "#e0e0e0"; //Fallback

    if(p)
    {
        p.style.opacity = "1";
        p.style.backgroundColor = "transparent"
    }
}

//Function to Reset Hexes
function reset_hex(event)
{
    let hex = event.target.classList.contains("hex") ? event.target : event.target.parentNode;
    let p = hex.querySelector("p");

    hex.style.transform = "rotateY(0deg)";
    hex.style.backgroundImage = `url(${hex.dataset.bgImg})` || "none";
    hex.style.backgroundColor = "#f1f1f1";

    if(p)
    {
        p.style.opacity = "0";
        p.style.backgroundColor = "transparent"
    }

    //Remove Hover Effect Temporarily
    hex.removeEventListener("mouseenter", rotate_hex)

    setTimeout(() => { hex.addEventListener("mouseenter", rotate_hex); }, 400);
}

//Update All Special Hexes Background to Have the Same Color
function background_hex_color(color = "#ffffff")
{
    const hexes = document.querySelectorAll('.hex[data-bg-color]');

    hexes.forEach(hex =>
    {
        hex.dataset.bgColor = color;
    });
}
