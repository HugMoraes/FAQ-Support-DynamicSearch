import eventBus from '../../core/pubSub.js';

export function initnavBar() {
  const hamburger = document.getElementById("hamburger");
  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    eventBus.publish("openSideBar");
  });
}