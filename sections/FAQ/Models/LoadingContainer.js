export class LoadingContainer{
    /**
     * @param {HTMLElement} loadingContainer - Elemento DOM que exibe o "carregando".
     */
    constructor(loadingContainer) {
        // Referência ao elemento DOM
        this.loadingContainer = loadingContainer;
    
    }

    /**
     * @param {boolean} show - Se verdadeiro, mostra o container de loading. Se falso, esconde ele.
     */
    toggleLoading(show) {
        if (show) {
            this.loadingContainer.style.display = 'flex';
        } else {
            this.loadingContainer.style.display = 'none';
        }
    }

}