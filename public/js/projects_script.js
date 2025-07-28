const hint = document.querySelector(".hint");

function scroll_handler(event)
{
    event.preventDefault();

    hint.style.animation = "none";
    void hint.offsetHeight; // force reflow
    hint.style.opacity = 0;

    document.removeEventListener("wheel", scroll_handler, { passive: false });
}

document.addEventListener("wheel", scroll_handler, { passive: false });
