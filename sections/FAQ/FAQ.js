import { FaqContainer } from "./Models/FaqContainer.js";
import { LoadingContainer } from "./Models/LoadingContainer.js";
import { NoResultsContainer } from "./Models/NoResultsContainer.js";
import { SearchArrows } from "./Models/SearchArrows.js";
import eventBus from "../../core/pubSub.js"

export function initFAQ() {
    // Procura os elementos do DOM
    const faqContainerElement = document.getElementById('faqContainer');
    const loadingContainerElement = document.getElementById('loadingContainer');
    const noResultsContainerElement = document.getElementById('noResultsContainer');
    const rightArrowElement = document.getElementById('rightArrow');
    const leftArrowElement = document.getElementById('leftArrow');

    // Instancia as classes dos elementos do DOM
    const faqContainer = new FaqContainer(faqContainerElement);
    const loadingContainer = new LoadingContainer(loadingContainerElement);
    const noResultsContainer = new NoResultsContainer(noResultsContainerElement);
    const searchArrows = new SearchArrows(leftArrowElement, rightArrowElement);

    // Lê o arquivo .json com as FAQs e renderiza
    faqContainer.loadFaqs("../../data/FAQ.json");

    const searchInput = document.getElementById('searchInput');
    let debounceTimer; // variável que guardará o timer

    // Evento para buscar em tempo real
    searchInput.addEventListener('input', (event) => {
      const searchText = event.target.value.toLowerCase();

      // Limpa os Faqs e o não encontrado se tiver
      faqContainer.cleanFaqs();
      noResultsContainer.toggleNoResults(false);
    
      // Mostra loading sempre que o usuário começa a digitar
      loadingContainer.toggleLoading(true)
    
      // Limpa o timer anterior para evitar múltiplas chamadas
      clearTimeout(debounceTimer);
    
      // Define um novo timer de 1 segundo
      debounceTimer = setTimeout(() => {
        // Passou 1s sem digitar? Então filtra as FAQs
        const searchResult = faqContainer.searchFaqs(searchText);
    
        // Exibe ou oculta a mensagem "sem resultados"
        if (!searchResult) {
          noResultsContainer.toggleNoResults(true)
        } else {
          noResultsContainer.toggleNoResults(false)
        }
    
        // Depois que terminamos o filtro, ocultamos o loading
        loadingContainer.toggleLoading(false)
      }, 500); // 500 ms de atraso
    });
}