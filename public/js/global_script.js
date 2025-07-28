
const showcase = document.querySelector(".hex_background")
const hero = document.querySelector(".landing_hero") ? document.querySelector(".landing_hero") : null;

//Fade in on load
window.addEventListener("DOMContentLoaded", () => 
{
    showcase.classList.add("fade_in");
});

//Fade out on link click
document.querySelectorAll("a").forEach(link =>
{
    link.addEventListener("click", (event) =>
    {
        const href = link.getAttribute("href");
        const is_blank = link.target === "_blank";

        //Ignore anchor, mailto, or target="_blank" links
        if(is_blank || href.startsWith("#") || href.startsWith("mailto:")) return;

        //Prevent default, fade out, then navigate
        event.preventDefault();
        showcase.classList.remove("fade_in");

        setTimeout(() => {
            window.location.href = href;
        }, 400);
    });
});

let scale = 2;            //Initial zoom
const min_scale = 1;     //Min zoom out
const max_scale = 2.5;       //Max zoom in
const scale_step = 0.05;    //Zoom speed

document.addEventListener("wheel", (event) =>
{
    event.preventDefault();

    if(event.deltaY < 0)
    {
        scale = Math.min(scale + scale_step, max_scale);
    }
    else
    {
        scale = Math.max(scale - scale_step, min_scale);
    }

    showcase.style.transform = `scale(${scale})`;    

    if(hero)
    {
        hero.style.transform = `scale(${scale})`;
    }
}, 
{ 
    passive: false
});

function showcase_project(hex)
{
    const rect = hex.getBoundingClientRect();
    const width = hex.offsetWidth;
    const height = hex.offsetHeight;

    const selector = hex.getAttribute("project_class_data");
    if (!selector) return;

    const project_showcase = document.querySelector(selector);
    if (!project_showcase) return;

    //Reset style for animation start
    project_showcase.style.width = `${width}px`;
    project_showcase.style.height = `${height}px`;
    project_showcase.style.opacity = 0;

    //Position it over the hex
    project_showcase.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(1)`;

    //Force reflow so the transform takes effect before animating
    void showcase.offsetWidth;

    requestAnimationFrame(() =>
    {
        const targetX = (window.innerWidth / 2) - (width / 2);
        const targetY = (window.innerHeight / 2) - (height / 2);

        project_showcase.style.transform = `translate(${targetX}px, ${targetY}px) scale(7)`;
        project_showcase.style.opacity = 1;
    });
}

document.querySelectorAll('.project_hex').forEach(hex =>
{
    hex.addEventListener('mouseenter', () =>
    {
        showcase_project(hex);
    });

    hex.addEventListener('mouseleave', () =>
    {
        const selector = hex.getAttribute("project_class_data");
        const project_showcase = document.querySelector(selector);

        if(project_showcase)
        {
            const rect = hex.getBoundingClientRect();

            project_showcase.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(1)`;
            project_showcase.style.opacity = 0;
        }
    });
});





