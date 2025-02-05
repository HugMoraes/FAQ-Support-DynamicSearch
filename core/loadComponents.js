// Carrega arquivo HTML e insere no container
async function loadHtmlFile(path, containerId) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Erro ao carregar o arquivo: ${path}`);
      }
      const html = await response.text();
      document.getElementById(containerId).innerHTML = html;
    } catch (error) {
      console.error(error);
    }
  }
  
  /**
   * Função para carregar e inicializar tanto um componente quanto uma seção
   * @param {'component'|'section'} type - Define se é um 'component' ou 'section'
   * @param {string} name - Nome do componente ou seção
   * @param {string} containerId - ID do elemento em que o conteúdo HTML será inserido
   */
  async function loadAndInit(type, name, containerId) {
    // Definir basePath de acordo com o tipo
    const basePath = type === 'component' ? '../components' : '../sections';
  
    // Carrega o HTML
    await loadHtmlFile(`${basePath}/${name}/${name}.html`, containerId);
  
    // Carrega e anexa o CSS
    const linkCss = document.createElement('link');
    linkCss.rel = 'stylesheet';
    linkCss.href = `${basePath}/${name}/${name}.css`;
    document.head.appendChild(linkCss);
  
    // Carrega e executa o JS (caso exista)
    try {
      const module = await import(`${basePath}/${name}/${name}.js`);
      // Esperamos que a função de inicialização seja init + Nome (ex: initNavBar, initHome, etc.)
      const initFunction = module[`init${name}`];
      if (initFunction) {
        initFunction();
      } else {
        console.warn(`Função init${name} não encontrada em ${name}.js`);
      }
    } catch (error) {
      console.warn(`Não foi possível importar o JS de ${name}.js`, error);
    }
  }
  
  // Exemplo de uso
  (async function initApp() {
    // Carregando componentes
    await loadAndInit('component', 'navBar', 'navBar');
    await loadAndInit('component', 'sideBar', 'sideBar');
    await loadAndInit('component', 'sideBarPlat', 'sideBarPlat');
    await loadAndInit('component', 'footer', 'footer');
  
    // Carregando uma seção
    await loadAndInit('section', 'FAQ', 'searchSection');
  })();
  