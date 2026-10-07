FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

CMD ["node", ".output/server/index.mjs"]