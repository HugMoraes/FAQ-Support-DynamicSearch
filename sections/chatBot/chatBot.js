import { Chat } from "./Models/Chat.js"
import { UserInput } from "./Models/UserInput.js"
import { ChatBot } from "./Models/ChatBot.js"
import { loadEnv } from "../../../core/utils.js" 
import eventBus from "../../core/pubSub.js";

export async function initchatBot() {
    // Procura os elementos do DOM
    const formElement = document.getElementById('userInputForm');
    const inputElement = document.getElementById('userInput');
    const sendButtonElement = document.getElementById('sendButton');
    const chatElement = document.getElementById('chat');
    const helpButtonElement = document.getElementById('helpButton');
    const helpContainerElement = document.getElementById('helpContainer');
    const closeHelpButtonElement = document.getElementById('closeHelp');
    const clearSessionButtonElement = document.getElementById('clearSession');

    // Instancia as classes dos elementos do DOM
    const userInput = new UserInput(formElement, inputElement, sendButtonElement);
    const chat = new Chat(chatElement);
    
    //console.log(chat);
    
    try {
        // Carrega chaves da API de .env
        const ids = await loadEnv();
        // Instancia o chatbot
        const chatBot = new ChatBot(ids.clientid, ids.projectid);
    } catch (error) {
        console.error('Erro ao carregar variáveis de ambiente:', error);
    }

    helpButtonElement.addEventListener('click', () => {
        helpContainerElement.style.display = 'flex'
    });

    closeHelpButtonElement.addEventListener('click', () => {
        helpContainerElement.style.display = 'none'
    });

    clearSessionButtonElement.addEventListener('click', () => {
        eventBus.publish("clearSession");
        helpContainerElement.style.display = 'none'
    });

    eventBus.publish("chatLoaded");

}