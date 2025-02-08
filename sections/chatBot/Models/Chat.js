import eventBus from '../../../core/pubSub.js';

export class Chat {
    constructor(chatContainer) {
        this.chatContainer = chatContainer;
        this.sessionId = this.getSessionId();
        
        this.loadChatHistory();

        eventBus.subscribe("userSentMessage", (text) => {
            this.sendMessage(text, "user");
            this.toggleTyping(true);

            // Chama API para responder
            eventBus.publish("chatBotInput", text);
        });

        eventBus.subscribe("chatBotResponse", (res) => {
            this.toggleTyping(false);
            if(this.sessionId === null) {
                this.sessionId = this.getSessionId();
                this.saveMessage(res.question, "user");
            }
            this.sendMessage(res.text, "chatBot");
        });

        eventBus.subscribe("chatLoaded", () => {
            if (!this.hasChatHistory()) {
                this.sendMessage("Olá! 🧙 Como posso te ajudar?", "chatBot", true);
            }
        });

        eventBus.subscribe("clearSession", () => {
            this.clearSession();
        });
        
    }

    getSessionId() {
        let match = document.cookie.match(/chatbot_session_id=([^;]+)/);
        return match ? match[1] : this.resetChatHistory();
    }

    saveMessage(text, sender) {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory_" + this.sessionId)) || [];
        chatHistory.push({ sender, text });
        localStorage.setItem("chatHistory_" + this.sessionId, JSON.stringify(chatHistory));
    }

    loadChatHistory() {
        if (!this.sessionId) return;
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory_" + this.sessionId)) || [];
        this.sendMessage("Olá! 🧙 Como posso te ajudar?", "chatBot", true);
        chatHistory.forEach(({ sender, text }) => {
            this.sendMessage(text, sender, true);
        });
    }

    hasChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory_" + this.sessionId));
        return chatHistory && chatHistory.length > 0;
    }

    resetChatHistory() {
        localStorage.removeItem("chatHistory_" + this.sessionId);
        return null;
    }

    toggleTyping(show) {
        const existingTypingRow = document.getElementById('typingRow');
        
        if (show) {
            if (!existingTypingRow) {
                // Cria a "linha" da mensagem
                const messageRow = document.createElement('div');
                messageRow.setAttribute('id', 'typingRow');
                
                // Cria a "caixa" da mensagem
                const messageBox = document.createElement('div');
                messageBox.setAttribute('id', 'messageBox');
                
                // Cria a estrutura de digitação
                const typingContainer = document.createElement('div');
                typingContainer.classList.add('typing');
                
                for (let i = 0; i < 3; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    typingContainer.appendChild(dot);
                }
                
                // Adiciona a estrutura na caixa de mensagem
                messageBox.appendChild(typingContainer);
                
                // Adiciona a caixa de mensagem na linha de mensagem
                messageRow.appendChild(messageBox);
                
                // Adiciona a linha ao contêiner do chat
                const chatContainer = document.getElementById('chat');
                chatContainer.prepend(messageRow);

                setTimeout(() => {
                    messageBox.classList.add("mostrar");
                }, 10); 
            }
        } else {
            if (existingTypingRow) {
                existingTypingRow.remove();
            }
        }
    }
  
    async sendMessage(message, from, lodingHistory = false) {
        // Cria o elemento para a "linha" da mensagem
        const messageRow = document.createElement('div');
        messageRow.setAttribute('id', 'messageRow');
        
        // Se for mensagem do usuário, adiciona a classe "leftSide"
        if (from === 'user') {
            messageRow.classList.add('leftSide');
        } else if (from === 'chatBot') {

            message = marked.parse(message);
        }
        
        // Cria a "caixa" da mensagem
        const messageBox = document.createElement('div');
        messageBox.setAttribute('id', 'messageBox');
        
        // Cria o elemento para o texto da mensagem
        const messageText = document.createElement('div');
        messageText.setAttribute('id', 'messageText');
        messageText.innerHTML = message;
    
        // Adiciona o texto à caixa de mensagem
        messageBox.appendChild(messageText);
        
        // Adiciona a caixa de mensagem à linha da mensagem
        messageRow.appendChild(messageBox);
        
        // Adiciona a linha da mensagem ao contêiner do chat
        const chatContainer = document.getElementById('chat');
        chatContainer.prepend(messageRow); // Use appendChild para adicionar no final

        setTimeout(() => {
            messageBox.classList.add("mostrar");
        }, 10); 

        // Scrolla para o final do chat
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;

        if (!lodingHistory && this.sessionId) {
            this.saveMessage(message, from);
        }
    }

    clearSession() {
        this.sessionId = this.resetChatHistory();
        this.chatContainer.innerHTML = '';
        this.sendMessage("Olá! 🧙 Como posso te ajudar?", "chatBot", true);
    }

}