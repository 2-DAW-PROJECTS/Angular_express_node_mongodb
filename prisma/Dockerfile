# Dockerfile de Prisma
FROM node:20

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install
RUN npm install -g concurrently

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000
EXPOSE 5555

CMD ["concurrently", "\"npm start\"", "\"npx prisma studio --port 5555\""]