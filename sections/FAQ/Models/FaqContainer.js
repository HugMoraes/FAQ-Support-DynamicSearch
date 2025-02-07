import eventBus from '../../../core/pubSub.js';

export class FaqContainer {
    /**
     * @param {HTMLElement} faqContainer - Elemento DOM onde as FAQs serão renderizadas.
     */
    constructor(faqContainer) {
        // Referência ao elemento DOM
        this.faqContainer = faqContainer;
    
        // Armazena todas as FAQs carregadas do JSON
        this.allFaqs = [];
    
        // Armazena as FAQs após filtragem ou manipulações
        this.filteredFaqs = [];

        eventBus.subscribe("renderFAQ", (column) => {
            this.renderFaqs(column);
        })
    }

    /**
     * Limpa o container das FAQs.
     */
    cleanFaqs() {
        if (this.faqContainer) {
            this.faqContainer.innerHTML = '';
        }
    }
  
    /**
     * Carrega as FAQs de um arquivo JSON e armazena em `this.allFaqs`.
     * Em seguida, chama o render para exibi-las.
     * @param {string} jsonUrl - Caminho ou URL do arquivo JSON.
     */
    async loadFaqs(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`Erro ao carregar FAQs: ${response.statusText}`);
            }
    
            const data = await response.json();
            this.allFaqs = data;
            this.filteredFaqs = data; // Inicia com todas as FAQs
    
            // Renderiza as FAQs carregadas
            eventBus.publish("faqColumnCount", Math.ceil(this.filteredFaqs.length / 4));
            this.renderFaqs(1);
        } catch (error) {
            console.error(error);
        }
    }
  
    /**
     * Filtra as FAQs com base em um texto de busca e renderiza os resultados.
     * @param {string} searchTerm - Texto a ser buscado no título ou texto das FAQs.
     */
    searchFaqs(searchTerm) {
        let searchResult = true;
        if (!searchTerm) {
            // Se não tiver termo de busca
            this.filteredFaqs = this.allFaqs;
        } else {
            const lowerSearchTerm = searchTerm.toLowerCase();
            this.filteredFaqs = this.allFaqs.filter((faq) => {
                const title = faq.title.toLowerCase();
                const text = faq.text.toLowerCase();
                return title.includes(lowerSearchTerm) || text.includes(lowerSearchTerm);
            });
        }

        if (this.filteredFaqs.length === 0) {
            searchResult = false;
        }
  
        // Renderiza as FAQs filtradas
        this.renderFaqs(1);
        eventBus.publish("faqColumnCount", Math.ceil(this.filteredFaqs.length / 4));

        return searchResult;
    }
  
    /**
     * Renderiza um array de FAQs no container. 
     * Aqui você pode incluir a lógica de animação (stagger), expandir/recolher e etc.
     * @param column - Coluna de FAQ para renderizar.
     */
    renderFaqs(column) {
        // Limpa o container antes de renderizar
        this.cleanFaqs();

        const totalColumns = Math.ceil(this.filteredFaqs.length / 4);
    
        // Se não houver FAQs, apenas sai
        if (!this.filteredFaqs || this.filteredFaqs.length === 0) {
            return;
        }

        // Verifica se a coluna é válida: inteiro, maior ou igual a 1 e menor ou igual ao total de colunas
        if (column < 1 || column > totalColumns) {
            console.error("Coluna de FAQ inválida")
            return;
        }
        
        // Calcula índice inicial e final (exclusivo) com base na coluna
        const startIndex = (column - 1) * 4;
        const endIndex = startIndex + 4;

        // Seleciona apenas os 4 itens (ou menos, se não houver tantos)
        const selectedFaqs = this.filteredFaqs.slice(startIndex, endIndex);
    
        selectedFaqs.forEach((item) => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faqItem', 'bg-white', 'shadow', 'rounded', 'p-4');
    
            const h2 = document.createElement('h2');
            h2.classList.add('faqTitle');
            h2.textContent = item.title;
    
            const p = document.createElement('p');
            p.classList.add('faqText', 'text-gray-700', 'mt-2');
            p.textContent = item.text;
    
            faqItem.appendChild(h2);
            faqItem.appendChild(p);
            this.faqContainer.appendChild(faqItem);
        });
    
        const faqItems = Array.from(this.faqContainer.querySelectorAll('.faqItem'));
    
        // Efeito "stagger" - pequeno delay para cada item
        faqItems.forEach((item, index) => {
            // Desativa pointer-events antes da animação
            item.style.pointerEvents = 'none';
        
            setTimeout(() => {
                item.classList.add('animate');
        
                // Timeout para garantir que o evento seja reativado após a duração exata da animação
                const animationDuration = parseFloat(getComputedStyle(item).animationDuration) * 1000;
                
                setTimeout(() => {
                    item.style.pointerEvents = 'auto'; // Reativa pointer-events após a animação
                }, animationDuration);
                
            }, index * 150);
        });
    
        // Identifica textos curtos e remove gradiente se menor que 70px
        faqItems.forEach((item) => {
            const textElement = item.querySelector('.faqText');
            if (textElement) {
            const originalMaxHeight = textElement.style.maxHeight;
            textElement.style.maxHeight = 'none';
            const contentHeight = textElement.scrollHeight;
            textElement.style.maxHeight = originalMaxHeight;
    
            if (contentHeight <= 70) {
                textElement.classList.add('shortContent');
            }
            }
        });
    
        // Expansão/retração ao clicar
        faqItems.forEach((item) => {
            item.addEventListener('click', () => {
            // Fecha os outros
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                otherItem.classList.remove('expanded');
                }
            });
    
            // Se o texto for curto, não expande
            const textElement = item.querySelector('.faqText');
            if (textElement && textElement.classList.contains('shortContent')) {
                return;
            }
    
            // Expande ou recolhe o item clicado
            item.classList.toggle('expanded');
            });
        });
    }
  
    /**
     * Exibe ou oculta o container de FAQs.
     * @param {boolean} show - true para exibir, false para ocultar.
     */
    toggleVisibility(show) {
        if (this.faqContainer) {
            this.faqContainer.style.display = show ? 'block' : 'none';
        }
    }
  }
  