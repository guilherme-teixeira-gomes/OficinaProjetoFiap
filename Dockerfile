# Usando Node 20
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Instala wait-port globalmente para esperar o Postgres subir
RUN npm install --save-dev wait-port

# Copia todo o projeto
COPY . .

# Compila TypeScript
RUN npm run build

# Expõe a porta da API
EXPOSE 3000

# Comando para rodar a API, esperando o banco subir
CMD ["sh", "-c", "npx wait-port $DB_HOST:$DB_PORT && npm start"]