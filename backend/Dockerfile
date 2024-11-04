FROM node:20
LABEL author="Llorenç Alfonso 2ºDAW"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY backend/package*.json ./
RUN chown -R node:node /home/node/app

USER node

RUN npm install

COPY --chown=node:node ./backend . 
EXPOSE 3001

CMD ["node", "app/api/index.js"]
