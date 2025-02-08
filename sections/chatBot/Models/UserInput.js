import eventBus from '../../../core/pubSub.js';

export class UserInput {
  /**
   * @param {HTMLElement} formElement        - O elemento <form> do DOM.
   * @param {HTMLTextAreaElement} inputElement - O elemento <textarea> onde o usuário digita.
   * @param {HTMLButtonElement} sendBtnElement - O elemento <button> responsável por enviar o texto.
   */
  constructor(formElement, inputElement, sendBtnElement) {
    this.form = formElement;
    this.userInput = inputElement;
    this.sendButton = sendBtnElement;

    // Adiciona o event listener para capturar o texto ao clicar no botão
    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });
    
    this.userInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Evita a quebra de linha
        this.sendMessage();
      }
    });

    // Habilita o input e o botão quando o chatbot responder
    eventBus.subscribe("chatBotResponse", () => {
      this.toggleInput(true);
    });
  }

  sendMessage() {
    const text = this.userInput.value.trim();
    if (text === '') {
      return; // Não envia a mensagem se estiver vazia
    }

    eventBus.publish("userSentMessage", text);

    // Desabilita o input e o botão e so libera quando o chatbot responder
    this.toggleInput(false);

  }


  /**
   * Recebe um valor booleano: 
   *   - true  => habilita o textarea e o botão
   *   - false => desabilita o textarea e o botão
   */
  toggleInput(isEnabled) {
    if(isEnabled) {
      this.userInput.disabled = false;
      this.sendButton.disabled = false;
    } else {
      this.userInput.value = '';
      this.userInput.disabled = true;
      this.sendButton.disabled = true;
    }

  }
}
