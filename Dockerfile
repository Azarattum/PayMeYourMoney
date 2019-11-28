FROM node:13.2.0-slim

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 2012

CMD [ "node", "./dist/index.js" ]
