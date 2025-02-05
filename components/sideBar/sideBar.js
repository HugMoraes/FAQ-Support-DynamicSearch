import eventBus from '../../core/pubSub.js';

export function initsideBar() {
  const sideBar = document.getElementById("sidebar");
  const sideBarPlatOpener = document.getElementById("openSideBarPlat");
  const closeBtn = document.getElementById("close-btn");

  // Quando receber o evento "abrirSidebar", mostrar a sideBar
  eventBus.subscribe("openSideBar", () => {
    sideBar.style.right = "0";
  });

  sideBarPlatOpener.addEventListener("click", () => {
    eventBus.publish("openSideBarPlat");
  })

  // Botão de fechar
  closeBtn.addEventListener("click", () => {
    sideBar.style.right = "-100%";
  });
}