import eventBus from "../../../core/pubSub.js";

export class SecretButtons {
    constructor() {
        // Get the session id first (from cookie or create a new one)
        this.sessionId = this.getSessionId();
        // Retrieve secret buttons already saved for this session and Render any buttons that were already activated in a previous visit
        this.sessionButtons = this.loadSessionButtons();

        // Listen for chatbot responses
        eventBus.subscribe("chatBotResponse", (res) => {

            if(this.sessionId === null) {
                this.sessionId = this.getSessionId();
            }
            // Combine the .text and .question properties into a single text
            const txt = res.text || "";
            const question = res.question || "";
            let text = (txt + " " + question).toLowerCase();
            // Remove accents using normalize (this covers most accent cases)
            text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Check if any secret button alias appears in the text
            Object.entries(this.secretButtonAliases).forEach(([buttonName, aliases]) => {
                aliases.forEach(alias => {
                    if (text.includes(alias)) {
                        // Render the secret button if it hasn't been summoned already.
                        this.summonButton(buttonName);
                        
                    }
                });
            });
        });

        eventBus.subscribe("clearSession", () => {
            this.resetSessionButtons();
        });
    }

    /**
     * Carrega os botões secretos e seus respectivos aliases a partir de um arquivo JSON.
     */
    loadButtonAliases(jsonUrl) {
        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar aliases dos botões secretos: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.secretButtonAliases = data;
            })
            .catch(error => {
                console.error(error);
            });
    }

    /**
     * Retrieves the session id from a cookie. If not found, resets the session.
     */
    getSessionId() {
        const match = document.cookie.match(/chatbot_session_id=([^;]+)/);
        return match ? match[1] : this.resetSessionButtons();
    }

    /**
     * Saves a secret button to localStorage for the current session,
     * ensuring that duplicates are not stored.
     */
    saveSessionButton(buttonName) {
        if (!this.sessionButtons.includes(buttonName)) {
            this.sessionButtons.push(buttonName);
            localStorage.setItem(`secret_buttons_${this.sessionId}`, JSON.stringify(this.sessionButtons));
        }
    }

    /**
     * Loads any secret buttons saved in localStorage and summons (renders) them.
     */
    loadSessionButtons() {
        const sessionButtons = JSON.parse(localStorage.getItem(`secret_buttons_${this.sessionId}`)) || [];

        if (sessionButtons.length > 0) {
            sessionButtons.forEach(buttonName => {
                this.summonButton(buttonName, true);
            });
        }

        return sessionButtons;

    }
    

    /**
     * Checks if there are any secret buttons stored for the current session.
     */
    hasSessionButtons() {
        return localStorage.getItem(`secret_buttons_${this.sessionId}`) !== null;
    }

    /**
     * Resets the secret buttons session. This function creates a new session id,
     * sets the corresponding cookie, and clears any stored secret buttons.
     */
    resetSessionButtons() {
        // Remove any existing secret buttons stored for this session id, if any.
        localStorage.removeItem(`secret_buttons_${this.sessionId}`);
        this.unsummonButtons();
        this.sessionId = null;
        this.sessionButtons = [];  

        return null;
    }

    /**
     * Renders a secret button on the screen by adding the "appear" class.
     * It expects that the button element's id is in the format "navegationButton<name>".
     */
    summonButton(buttonName, loading = false) {
        const buttonElement = document.getElementById(`navegationButton${buttonName}`);
        const modelIconContainer = document.getElementById('modelIconContainer');

        if (buttonElement) {
            // Inicia a animação do model (modelIconContainer)
            modelIconContainer.classList.add("colorful");
            
            // Inicia a animação do botão adicionando a classe "appear"
            buttonElement.classList.add("appear");
        
            setTimeout(() => {
                modelIconContainer.classList.remove("colorful");
            }, 2500);
        }

        if (!loading && this.sessionId) {
            this.saveSessionButton(buttonName);
        }
        
    }

    unsummonButtons() {
        if (!this.sessionButtons) return;        
        this.sessionButtons.forEach(buttonName => {
            const buttonElement = document.getElementById(`navegationButton${buttonName}`);
            if (buttonElement) {  // Verifica se o elemento existe antes de manipular
                buttonElement.classList.remove("appear");
            }
        });
    }
}
