
const info = document.querySelector(".info")

document.querySelectorAll(".landing_header").forEach((header) =>
{
    header.addEventListener("click", () =>
    {
        info.style.display = "block";
        info.scrollIntoView({ behavior: "smooth", block: "start" });
    })
})