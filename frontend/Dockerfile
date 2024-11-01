# Dockerfile / frontend
FROM node:20 
LABEL author="Llorenç Alfonso 2ºDAW"

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
