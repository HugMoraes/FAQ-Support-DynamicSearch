# Usa a imagem oficial do Nginx como base
FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da aplicação para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
