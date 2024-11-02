# Dockerfile / typeorm
FROM node:20
LABEL author="Ta mare cuan pixa fa clotet ☻"

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]