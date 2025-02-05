export function initFAQ() {
    const searchInput = document.getElementById('searchInput');
    const faqContainer = document.getElementById('faqContainer');
    
    if (!searchInput || !faqContainer) {
        console.error("searchInput or faqContainer not found.");
        return;
    }

    const faqItems = Array.from(faqContainer.getElementsByClassName('faqItem')); // Convert to array
    const noResults = document.getElementById('noResults');

    // Evento para buscar em tempo real
    searchInput.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();
        let hasResults = false;

        // Percorre todas as perguntas e respostas do FAQ
        for (let i = 0; i < faqItems.length; i++) {
            const item = faqItems[i];
            const question = item.getElementsByTagName('h2')[0].textContent.toLowerCase();
            const answer = item.getElementsByTagName('p')[0].textContent.toLowerCase();

            // Verifica se o texto pesquisado está na pergunta ou na resposta
            if (question.includes(searchText) || answer.includes(searchText)) {
                item.style.display = 'block';
                hasResults = true;
            } else {
                item.style.display = 'none';
            }
        }

        // Exibe a imagem se não houver resultados, caso contrário, oculta
        noResults.style.display = hasResults ? 'none' : 'block';
    });

    // 1) Identifica quais textos são curtos (<= 70px de altura).
    faqItems.forEach((item) => {
        const textElement = item.querySelector(".faqText");
        if (textElement) {
            // Força o estilo para medir o "scrollHeight"
            const originalMaxHeight = textElement.style.maxHeight;
            textElement.style.maxHeight = "none";
            const contentHeight = textElement.scrollHeight;
            textElement.style.maxHeight = originalMaxHeight; // Volta para 70px

            // Se o texto for menor ou igual a 70px, remove gradiente
            if (contentHeight <= 70) {
                textElement.classList.add("shortContent");
            }
        }
    });

    // 2) Ao clicar em um item, fecha os outros e expande ou recolhe o atual
    faqItems.forEach((item) => {
        item.addEventListener("click", () => {
        // Fecha outros itens
        faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
            otherItem.classList.remove("expanded");
            }
        });

        // Se for texto curto, não expande
        const textElement = item.querySelector(".faqText");
        if (textElement && textElement.classList.contains("shortContent")) {
            return;
        }

        // Expande/recolhe o item clicado
        item.classList.toggle("expanded");
        });
    });
}