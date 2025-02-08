import eventBus from "../../../core/pubSub.js";

export class ChatBot {
    /**
     * Construtor da classe ChatBot
     * @param {string} clientId - ID do cliente requisitante
     * @param {string} projectId - ID do projeto associado
     */
    constructor(clientId, projectId) {
      if (!clientId || !projectId) {
        throw new Error("É necessário fornecer clientId e projectId.");
      }
  
      this.clientId = clientId;
      this.projectId = projectId;
      this.endpoint = "https://ai.stec.cx/single";
      this.cookieName = "chatbot_session_id";
  
      // Tenta recuperar sessionId do cookie (se existir)
      this.sessionId = this.getCookie(this.cookieName) || null;

      eventBus.subscribe("chatBotInput", (text) => {
        this.sendMessage(text).then(res => {
          eventBus.publish("chatBotResponse", (res));
        });
      });

      eventBus.subscribe("clearSession", () => {
        this.clearSession();
      });

    }
  
    /**
     * Lê o valor de um cookie pelo nome
     * @param {string} name
     * @returns {string|null}
     */
    getCookie(name) {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    }
  
    /**
     * Seta um cookie simples com valor e prazo em dias
     * @param {string} name - nome do cookie
     * @param {string} value - valor do cookie
     * @param {number} days - validade do cookie em dias
     */
    setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
    }
  
    /**
     * Envia uma mensagem (prompt) para a IA Merlin, mantendo a sessão se existir.
     * @param {string} prompt - Texto da solicitação do usuário
     * @param {object} [extraPayload] - Campo opcional para enviar parâmetros extras
     *   ex: { websearch: true, attach: [...], habits: [...], etc. }
     * @returns {Promise<object>} - Retorna o objeto completo de resposta da API
     */
    async sendMessage(prompt, extraPayload = {}) {
      if (!prompt) {
        throw new Error("O parâmetro 'prompt' é obrigatório.");
      }

      // Monta o payload de envio
      const payload = {
        prompt,
        service: "merlin-v1",
        clientid: this.clientId,
        projectid: this.projectId,
        ...extraPayload
      };
  
      // Se temos uma sessão guardada, incluímos
      if (this.sessionId) {
        payload.session = this.sessionId;
      }
  
      try {
        const response = await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
  
        const data = await response.json();
  
        // Se a API retornar um novo session-id e não temos ainda, salvamos no cookie
        if (data["session-id"] && !this.sessionId) {
          this.sessionId = data["session-id"];
          this.setCookie(this.cookieName, this.sessionId, 7); // validade de 7 dias (exemplo)
        }
  
        return data;
      } catch (error) {
        console.error("Erro ao enviar mensagem para a API:", error);
        throw error;
      }
    }
  
    /**
     * Limpa a sessão atual da classe e do cookie
     */
    clearSession() {
      this.sessionId = null;
      this.setCookie(this.cookieName, "", -1); // seta cookie vencido
    }
  }
  