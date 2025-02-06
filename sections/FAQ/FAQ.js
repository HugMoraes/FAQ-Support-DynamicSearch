function showLoading() {
  if (loadingContainer) {
      loadingContainer.style.display = 'flex';
  }
}

function hideLoading() {
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}


export function initFAQ() {
    const searchInput = document.getElementById('searchInput');
    const faqContainer = document.getElementById('faqContainer');
    const loadingContainer = document.getElementById('loadingContainer');

    // Se os elementos básicos não existirem no DOM, sai da função
    if (!searchInput || !faqContainer) {
        console.error("searchInput or faqContainer not found.");
        return;
    }

    // Variável para manter todos os dados do FAQ carregados do JSON
    let allFaqs = [];

    // Renderiza as FAQs no container
    function renderFaqs(data) {
      // Limpa o container anterior
      faqContainer.innerHTML = '';
      
      data.forEach((item) => {
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
        faqContainer.appendChild(faqItem);
      });

      const faqItems = Array.from(faqContainer.querySelectorAll('.faqItem'));

      // Aplica o "stagger" (uma animação em sequência)
      faqItems.forEach((item, index) => {
        // Adiciona um pequeno delay para cada item
        setTimeout(() => {
          // Aqui adicionamos a classe que ativa a animação
          item.classList.add('animate');
        }, index * 150); // 150 ms de diferença entre cada item
      });

      // 1) Identifica quais textos são curtos (<= 70px de altura).
      faqItems.forEach((item) => {
        const textElement = item.querySelector('.faqText');
        if (textElement) {
          const originalMaxHeight = textElement.style.maxHeight;
          textElement.style.maxHeight = 'none';
          const contentHeight = textElement.scrollHeight;
          textElement.style.maxHeight = originalMaxHeight; // Volta para 70px se definido

          // Se o texto for menor ou igual a 70px, remove gradiente
          if (contentHeight <= 70) {
            textElement.classList.add('shortContent');
          }
        }
      });

      // 2) Ao clicar em um item, fecha os outros e expande ou recolhe o atual
      faqItems.forEach((item) => {
        item.addEventListener('click', () => {
          // Fecha os outros
          faqItems.forEach((otherItem) => {
            if (otherItem !== item) {
              otherItem.classList.remove('expanded');
            }
          });

          // Se for texto curto, não expande
          const textElement = item.querySelector('.faqText');
          if (textElement && textElement.classList.contains('shortContent')) {
            return;
          }

          // Expande ou recolhe o item clicado
          item.classList.toggle('expanded');
        });
      });
    }

    // Função para carregar os dados do JSON e salvar em `allFaqs`
    async function loadFaqs() {
      try {
        showLoading();
        const response = await fetch('../../assets/FAQ.json');
        if (!response.ok) {
          throw new Error(`Erro ao carregar FAQs: ${response.statusText}`);
        }
        const data = await response.json();
        allFaqs = data; // Guarda os dados na variável
        renderFaqs(allFaqs); // Renderiza inicialmente todas as FAQs
      } catch (error) {
        console.error(error);
      } finally {
        hideLoading();
      }
    }

    function toggleNoResults(show) {
      const element = document.getElementById("noResults");
  
      if (show) {
          element.style.display = "block"; // Torna visível antes da animação
          requestAnimationFrame(() => {
              element.classList.add("show");
          });
      } else {
          element.classList.remove("show"); // Remove a classe instantaneamente
          element.style.transition = "none"; // Remove transição ao esconder
  
          setTimeout(() => {
              element.style.display = "none"; // Esconde completamente
              element.style.transition = ""; // Restaura a transição ao exibir novamente
          }, 0);
      }
    }

    // Carrega FAQs assim que a função initFAQ é iniciada
    loadFaqs();

    let debounceTimer; // variável que guardará o timer

    // Evento para buscar em tempo real
    searchInput.addEventListener('input', (event) => {
      const searchText = event.target.value.toLowerCase();

      // Limpa os Faqs e o não encontrado se tiver
      faqContainer.innerHTML = '';
      toggleNoResults(false)
    
      // Mostra loading sempre que o usuário começa a digitar
      showLoading();
    
      // Limpa o timer anterior para evitar múltiplas chamadas
      clearTimeout(debounceTimer);
    
      // Define um novo timer de 1 segundo
      debounceTimer = setTimeout(() => {
        // Passou 1s sem digitar? Então filtra as FAQs
        const filteredFaqs = allFaqs.filter((faq) => {
          const question = faq.title.toLowerCase();
          const answer = faq.text.toLowerCase();
          return question.includes(searchText) || answer.includes(searchText);
        });
    
        // Exibe ou oculta a mensagem "sem resultados"
        if (filteredFaqs.length === 0) {
          toggleNoResults(true)
        } else {
          toggleNoResults(false)
        }
    
        // Re-renderiza apenas os resultados filtrados
        renderFaqs(filteredFaqs);
    
        // Depois que terminamos o filtro, ocultamos o loading
        hideLoading();
      }, 500); // 1000 ms de atraso
    });
}