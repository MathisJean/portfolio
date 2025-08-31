
//----Elements from DOM----//
const showcase = document.querySelector(".hex_background")
const hero_title = document.querySelector(".hero_title") ? document.querySelector(".hero_title") : null;
const hero_subtitle = document.querySelector(".hero_subtitle") ? document.querySelector(".hero_subtitle") : null;
const centerpiece = document.querySelector("form") ? document.querySelector("form") : document.querySelector(".terminal") ? document.querySelector(".terminal") : null;
const slideshow = document.querySelector('.slideshow');

//----Centered Mobile Grid----//
window.addEventListener('load', () =>
{
    if(!showcase) return;

    const scrollableWidth = showcase.scrollWidth;  
    const scrollableHeight = showcase.scrollHeight;

    const clientWidth = showcase.clientWidth;
    const clientHeight = showcase.clientHeight;

    showcase.scrollLeft = (scrollableWidth / 2) - (clientWidth / 2);
    showcase.scrollTop = (scrollableHeight / 2) - (clientHeight / 2);
});


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

const mobile_media_query = window.matchMedia("(max-width: 480px)");

//Get last known state
let last_state = sessionStorage.getItem("is_mobile") === "true";

function handle_change(mobile_media_query)
{
    //Compare with previous state to decide reload
    if(mobile_media_query.matches !== last_state)
    {
        sessionStorage.setItem("is_mobile", mobile_media_query.matches);
        location.reload();
        return;
    };

    //Attach/remove scroll listener based on current state
    if(mobile_media_query.matches)
    {
        document.removeEventListener("wheel", scroll_zoom, { passive: false });
    }
    else
    {
        document.addEventListener("wheel", scroll_zoom, { passive: false });
    };
};

mobile_media_query.addEventListener("change", handle_change);

// Save initial state and run logic immediately
sessionStorage.setItem("isMobile", mobile_media_query.matches);
handle_change(mobile_media_query);


//Move Hexes from Grid to Slideshow
if(mobile_media_query.matches)
{
    const img = [];

    showcase.querySelectorAll('.hex').forEach(hex =>
    {
        if(hex.hasAttribute('data-bg-color'))
        {
            img.push(hex);
            hex.remove();
        };
    });

    img.forEach(element => slideshow.appendChild(element));
};

//Slideshow Function
let slides = Array.from(document.querySelectorAll(".hex[data-bg-color]"));
let slide_index = 0;
let offset = 0;

function go_to_slide(element)
{
    if(!mobile_media_query.matches) return

    temp_index = slides.indexOf(element);

    if(slide_index == temp_index) return

    slide_index < temp_index ? offset = "100%" : offset = "-100%";
    slide_index === 0 && temp_index === slides.length - 1 ? offset = "-100%" : slide_index === slides.length - 1 && temp_index === 0 ? offset = "100%" : null;

    slide_index = temp_index

    //Clear the container
    slideshow.innerHTML = '';

    //Wrap-Around Helper
    const prevIndex = (slide_index - 1 + slides.length) % slides.length;
    const nextIndex = (slide_index + 1) % slides.length;

    slides[prevIndex].style.transform = `translateX(${offset})`;
    slides[slide_index].style.transform = `translate(${offset}, 0)`;
    slides[nextIndex].style.transform = `translateX(${offset})`;

    //Append in Order
    slideshow.appendChild(slides[prevIndex]);
    slideshow.appendChild(slides[slide_index]);
    slideshow.appendChild(slides[nextIndex]);

    slides[prevIndex].offsetWidth;
    slides[slide_index].offsetWidth;
    slides[nextIndex].offsetWidth;

    slides[prevIndex].style.transform = "translateX(0%)";
    slides[slide_index].style.transform = "translate(0%, -10px)";
    slides[nextIndex].style.transform = "translateX(0%)";
}

let touch_start
let touch_end

window.addEventListener("touchstart", event => 
{
    touch_start = event.touches[0].clientX
})

window.addEventListener("touchend", event => 
{
    touch_end = event.changedTouches[0].clientX

    let index = touch_start - touch_end > 50 ? slide_index + 1 : touch_start - touch_end < -50 ? slide_index - 1: undefined

    if(index == -1) index = 7
    if(index == 8) index = 0

    if(index != undefined)
    {
        go_to_slide(slides[index])

        click_handler(event)
    }
});

//Remove Hint Once Scrolling
const hint_zoom = document.querySelector("#zoom");

function scroll_handler(event)
{
    event.preventDefault();

    hint_zoom.style.animation = "none"; //Stop Animation
    void hint_zoom.offsetHeight; //Force Reflow
    hint_zoom.style.opacity = 0;

    document.removeEventListener("wheel", scroll_handler, { passive: false }); //Remove Event Listener
}

document.addEventListener("wheel", scroll_handler, { passive: false });

//Remove on Click
const hint_click = document.querySelector("#click");
let feature_cards = Array.from(document.querySelectorAll(".hex[data-bg-color]"));

//Hex Animation on Hover
Array.from(showcase.querySelectorAll(".hex")).forEach(hex => 
{
    if(!mobile_media_query.matches)
    {
        hex.addEventListener("mouseenter", rotate_hex)
        hex.addEventListener("click", reset_hex);
    };
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
