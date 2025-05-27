FROM mcr.microsoft.com/playwright/node:lts

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]
