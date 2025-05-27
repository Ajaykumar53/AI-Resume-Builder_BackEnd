FROM ghcr.io/microsoft/playwright:v1.42.1-jammy

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]
