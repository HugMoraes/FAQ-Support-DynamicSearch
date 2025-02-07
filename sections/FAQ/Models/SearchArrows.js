import eventBus from '../../../core/pubSub.js';

export class SearchArrows{
    /**
     * @param {HTMLElement} searchArrowLeft - Elemento DOM da seta esquerda.
     * @param {HTMLElement} searchArrowRight - Elemento DOM da seta direita.
     */
    constructor(searchArrowLeft, searchArrowRight) {
        // Referência ao elemento DOM
        this.searchArrowLeft = searchArrowLeft;
        this.searchArrowRight = searchArrowRight;

        // Armazena a coluna atual dos FAQs (4 perguntas por coluna)
        this.currentColumn = 1;
        this.currentColumnCount;

        eventBus.subscribe("faqColumnCount", (faqColumnCount) => {
            this.currentColumnCount = faqColumnCount;
            this.currentColumn = 1
            this.renderArrows();
            
        });

        this.searchArrowRight.addEventListener('click', (event) => {
            
            if(this.currentColumn + 1 <= this.currentColumnCount) {
                this.currentColumn += 1;
                eventBus.publish("renderFAQ", this.currentColumn);
                this.renderArrows();
            } else {
                console.error("Tentado acessar uma coluna que não existe");
            }
        });

        this.searchArrowLeft.addEventListener('click', (event) => {

            if(this.currentColumn - 1 >= 1 && this.currentColumn - 1 < this.currentColumnCount) {
                this.currentColumn -= 1;
                eventBus.publish("renderFAQ", this.currentColumn);
                this.renderArrows();
            } else {
                console.error("Tentado acessar uma coluna que não existe");
            }
        });
    }

    
    renderArrows() {
        if (this.currentColumnCount === 0 || this.currentColumnCount === 1) {
            this.toggleLeftArrow(false);
            this.toggleRightArrow(false);
        } else if (this.currentColumn === 1 && this.currentColumnCount > 1){
            this.toggleLeftArrow(false);
            this.toggleRightArrow(true);
        } else if (this.currentColumn > 1 && this.currentColumn < this.currentColumnCount ) {
            this.toggleLeftArrow(true);
            this.toggleRightArrow(true);
        } else if (this.currentColumn === this.currentColumnCount) {
            this.toggleLeftArrow(true);
            this.toggleRightArrow(false);
        }
    }


    /**
     * @param {boolean} show - Se verdadeiro, mostra o elemento. Se falso, esconde ele.
     */
    toggleLeftArrow(show) {
        if (show) {
            this.searchArrowLeft.style.visibility = 'visible';
        } else {
            this.searchArrowLeft.style.visibility = 'hidden';
        }
    }

    /**
     * @param {boolean} show - Se verdadeiro, mostra o elemento. Se falso, esconde ele.
     */
    toggleRightArrow(show) {
        if (show) {
            this.searchArrowRight.style.visibility = 'visible';
        } else {
            this.searchArrowRight.style.visibility = 'hidden';
        }
    }
}