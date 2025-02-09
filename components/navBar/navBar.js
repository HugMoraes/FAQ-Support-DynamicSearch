import eventBus from '../../core/pubSub.js';

export function initnavBar() {
  const hamburger = document.getElementById("hamburger");

  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    eventBus.publish("openSideBar");
  });

  
  const platLink = document.querySelector('.plat-link');
  const plataformaBlock = document.querySelector('.plataforma-block');

  platLink.addEventListener('mouseover', () => {
    plataformaBlock.style.display = 'block';
  });

  platLink.addEventListener('mouseout', (e) => {
    // Verifica se o mouse não está no bloco
    const toElement = e.relatedTarget;
    if (!plataformaBlock.contains(toElement)) {
      plataformaBlock.style.display = 'none';
    }
  });

  plataformaBlock.addEventListener('mouseover', () => {
    plataformaBlock.style.display = 'block';
  });

  plataformaBlock.addEventListener('mouseout', (e) => {
    // Verifica se o mouse não está na <a>
    const toElement = e.relatedTarget;
    if (!platLink.contains(toElement)) {
      plataformaBlock.style.display = 'none';
    }
  });

}
