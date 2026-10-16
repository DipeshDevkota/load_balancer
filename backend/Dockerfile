FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001 3002 3003

CMD ["npm", "run", "server1"]
