import eventBus from '../../core/pubSub.js';

export function initsideBarPlat() {
    const sidebarPlat = document.getElementById("sidebarPlat");
    const closeBtnPlat = document.getElementById("close-btn-plat");

    eventBus.subscribe("openSideBarPlat", () => {
        sidebarPlat.style.right = "0";
    })

    closeBtnPlat.addEventListener("click", () => {
        sidebarPlat.style.right = "-100%";
    });
}