# Estágio de Build
FROM node:14 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependência e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila a aplicação
RUN npm run build

# Estágio de Execução
FROM node:14-alpine

# Cria o diretório da aplicação no contêiner
WORKDIR /usr/src/app

# Copia apenas os arquivos necessários para a execução
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --only=production

# Expõe a porta que a aplicação utiliza
EXPOSE 3000

# Define o comando para executar a aplicação
CMD ["node", "dist/main"]
