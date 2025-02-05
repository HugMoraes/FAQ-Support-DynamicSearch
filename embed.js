 (function() {
  // Função principal que realmente constrói o widget
  function initializeWidget(scriptEl) {
    if (!scriptEl) {
      console.warn("voicembed.js: não foi possível localizar o script com atributos.");
      return;
    }

    // Ler os atributos do script
    const mode = scriptEl.getAttribute('mode') || 'chat';
    const projectId = scriptEl.getAttribute('data-project-id') || '';
    const voiceId = scriptEl.getAttribute('data-voice-id') || '';
    const buttonColor = scriptEl.getAttribute('data-button-color') || '#4A90E2';

    if (!projectId) {
      console.warn('voicembed.js: "data-project-id" não foi fornecido.');
      return;
    }

    // Montar URL do iframe
    let iframeUrl;
    if (mode === 'call') {
      if (!voiceId) {
        console.warn('voicembed.js: "data-voice-id" não foi fornecido para mode="call".');
        return;
      }
      // Exemplo: https://stec.cx/merlin/beta/test?id=xxx&voice=yyy
      iframeUrl = `https://stec.cx/merlin/beta/test?id=${projectId}&voice=${voiceId}`;
    } else {
      // mode=chat => https://stec.cx/merlin/talk?p=xxx
      iframeUrl = `https://stec.cx/merlin/talk?p=${projectId}`;
    }

    // ----------------------------------------------------------
    // Injetar estilos básicos (CSS)
    // ----------------------------------------------------------
    const style = document.createElement('style');
    style.innerHTML = `
      .merlin-embed-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        z-index: 99999;
        transition: background-color 0.3s ease;
      }
      .merlin-embed-button:hover {
        filter: brightness(0.9);
      }
      .merlin-embed-iframe-container {
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 360px;
        height: 560px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 99999;
        display: none; /* oculto por padrão no CSS */
        overflow: hidden;
      }
      .merlin-embed-iframe-container iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
      }
      .merlin-embed-close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        border-radius: 4px;
        background-color: rgba(0,0,0,0.1);
        color: #000;
        font-weight: bold;
      }
      .merlin-embed-close-btn:hover {
        background-color: rgba(0,0,0,0.2);
      }
      /* Responsivo (mobile): fullscreen */
      @media (max-width: 767px) {
        .merlin-embed-iframe-container {
          width: 100% !important;
          height: 100% !important;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          border-radius: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // ----------------------------------------------------------
    // Criar botão flutuante
    // ----------------------------------------------------------
    const button = document.createElement('div');
    button.className = 'merlin-embed-button';
    button.style.backgroundColor = buttonColor;

    // Ícone conforme o modo
    button.innerHTML = (mode === 'call') ? '📞' : '💬';

    // ----------------------------------------------------------
    // Criar container e iframe
    // ----------------------------------------------------------
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'merlin-embed-iframe-container';
    // **CORREÇÃO**: forçar inline style "display = none" para bater com o if
    iframeContainer.style.display = 'none'; // Adicionado para corrigir o bug do clique duplo

    // Botão fechar (X)
    const closeButton = document.createElement('div');
    closeButton.className = 'merlin-embed-close-btn';
    closeButton.innerHTML = '×';
    closeButton.addEventListener('click', () => {
      iframeContainer.style.display = 'none';
    });

    // Iframe
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;

    iframeContainer.appendChild(closeButton);
    iframeContainer.appendChild(iframe);

    // ----------------------------------------------------------
    // Evento de clique no botão -> mostra/esconde iframe
    // ----------------------------------------------------------
    button.addEventListener('click', () => {
      if (iframeContainer.style.display === 'none') {
        iframeContainer.style.display = 'block';
      } else {
        iframeContainer.style.display = 'none';
      }
    });

    // ----------------------------------------------------------
    // Anexar ao body
    // ----------------------------------------------------------
    document.body.appendChild(button);
    document.body.appendChild(iframeContainer);
  }

  // Função que detecta o script "atual"
  function getCurrentScript() {
    let scriptEl = document.currentScript;
    if (!scriptEl) {
      const scripts = document.getElementsByTagName('script');
      scriptEl = scripts[scripts.length - 1];
    }
    return scriptEl;
  }

  // Chamamos a criação do widget no DOMContentLoaded ou se o DOM já tiver carregado
  function autoInit() {
    const scriptEl = getCurrentScript();
    initializeWidget(scriptEl);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    autoInit();
  } else {
    document.addEventListener('DOMContentLoaded', autoInit);
  }
})();
 