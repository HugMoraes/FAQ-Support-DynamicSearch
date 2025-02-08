# 🌐 Web Application

## 📜 Descrição

Esta é uma aplicação web desenvolvida utilizando HTML, CSS e JavaScript puro, organizada em componentes modulares. A aplicação inclui um chatbot interativo 🤖 e uma seção de perguntas frequentes (FAQ). O projeto está configurado para ser executado em um contêiner Docker 🐳.

## 📂 Estrutura do Projeto

```
/
│── .env
│── .gitignore
│── dockerfile
│── index.html
│── README.md
│── text.tmp
│
├── assets/
│   ├── arrow.svg
│   ├── MerlinNotFound.png
│   ├── MerlinProfile.png
│   ├── MerlinSearchingLoop.gif
│
├── components/
│   ├── footer/
│   │   ├── footer.css
│   │   ├── footer.html
│   │   ├── footer.js
│   │
│   ├── navBar/
│   │   ├── navBar.css
│   │   ├── navBar.html
│   │   ├── navBar.js
│   │
│   ├── sideBar/
│   │   ├── sideBar.css
│   │   ├── sideBar.html
│   │   ├── sideBar.js
│   │
│   ├── sideBarPlat/
│   │   ├── sideBarPlat.css
│   │   ├── sideBarPlat.html
│   │   ├── sideBarPlat.js
│
├── core/
│   ├── loadComponents.js
│   ├── pubSub.js
│   ├── utils.js
│
├── data/
│   ├── FAQ.json
│
└── sections/
    ├── chatBot/
    │   ├── chatBot.css
    │   ├── chatBot.html
    │   ├── chatBot.js
    │   │
    │   ├── Models/
    │   │   ├── Chat.js
    │   │   ├── ChatBot.js
    │   │   ├── UserInput.js
    │
    ├── FAQ/
    │   ├── FAQ.css
    │   ├── FAQ.html
    │   ├── FAQ.js
    │   │
    │   ├── Models/
    │   │   ├── FaqContainer.js
    │   │   ├── LoadingContainer.js
    │   │   ├── NoResultsContainer.js
    │   │   ├── SearchArrows.js
```

## 🚀 Como Rodar a Aplicação

### ✅ Pré-requisitos

- Docker instalado na máquina.

### 🛠 Passos

1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-repositorio.git
   ```
2. Acesse a pasta do projeto:
   ```sh
   cd nome-do-repositorio
   ```
3. Construa a imagem Docker:
   ```sh
   docker build -t nome-da-imagem .
   ```
4. Execute o contêiner:
   ```sh
   docker run -d -p 8080:80 nome-da-imagem
   ```
5. Acesse a aplicação no navegador em [`http://localhost:8080`](http://localhost:8080) 🌍.

## 🤖 Como o Chatbot foi Treinado

O chatbot presente no projeto funciona utilizando regras predefinidas armazenadas em `FAQ.json`. Ele processa a entrada do usuário e tenta encontrar respostas correspondentes baseadas nas perguntas e respostas pré-definidas.

📌 **Arquivos Relevantes:**

- `sections/chatBot/chatBot.js` – Lógica principal do chatbot.
- `data/FAQ.json` – Base de conhecimento do chatbot.

## 🔗 Como o Front-end se Comunica com a API

O front-end se comunica com a API do chatbot através de chamadas JavaScript utilizando `fetch()`. O código está estruturado no arquivo `chatBot.js` dentro da pasta `sections/chatBot`. A API responde com base nos dados presentes no arquivo `FAQ.json`, retornando respostas para as perguntas feitas pelo usuário.

## 🧪 Como Testar o Chatbot

Para testar o chatbot, siga os passos:

1. Certifique-se de que a aplicação está rodando.
2. Acesse a página principal no navegador.
3. Digite uma pergunta no campo de entrada do chatbot.
4. Verifique se o chatbot responde corretamente com base nas perguntas definidas no arquivo `FAQ.json`.
5. Caso precise alterar as respostas, edite o `FAQ.json` e reinicie a aplicação.

## 🎨 Capturas de Tela

| Tela Inicial 🏠 | Chatbot Ativo 🤖 |
| --------------- | ---------------- |
|                 |                  |

## 🛠 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Docker

## 📌 Funcionalidades

✅ Chatbot interativo ✅ FAQ dinâmico ✅ Interface modularizada

## 🎯 Roadmap Futuro

🔹 Adicionar suporte a múltiplos idiomas 🌍 🔹 Melhorar a UI/UX 🎨 🔹 Integrar um backend para respostas personalizadas 🔗

## 🤝 Contribuição

Se desejar contribuir com melhorias para o projeto, siga os seguintes passos:

1. Faça um fork do repositório.
2. Crie uma branch para sua funcionalidade:
   ```sh
   git checkout -b minha-feature
   ```
3. Faça commit das suas mudanças:
   ```sh
   git commit -m "Adicionei uma nova funcionalidade"
   ```
4. Envie suas mudanças:
   ```sh
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

📬 **Contato:** [seu-email@email.com](mailto\:seu-email@email.com)

