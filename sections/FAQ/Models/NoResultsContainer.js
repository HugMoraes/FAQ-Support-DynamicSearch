export class NoResultsContainer{
    /**
     * @param {HTMLElement} noResultsContainer - Elemento DOM que exibe o "não encontrado".
     */
    constructor(noResultsContainer) {
        // Referência ao elemento DOM
        this.noResultsContainer = noResultsContainer;
    
    }

    /**
     * @param {boolean} show - Se verdadeiro, mostra o container de sem resultados. Se falso, esconde ele.
     */
    toggleNoResults(show) {
    
        if (show) {
            this.noResultsContainer.style.display = "block"; // Torna visível antes da animação
            requestAnimationFrame(() => {
                this.noResultsContainer.classList.add("show");
            });
        } else {
            this.noResultsContainer.classList.remove("show"); // Remove a classe instantaneamente
            this.noResultsContainer.style.transition = "none"; // Remove transição ao esconder
    
            setTimeout(() => {
                this.noResultsContainer.style.display = "none"; // Esconde completamente
                this.noResultsContainer.style.transition = ""; // Restaura a transição ao exibir novamente
            }, 0);
        }
    }
}