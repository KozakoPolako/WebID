FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g typescript

RUN npm install

COPY . . 

RUN tsc

EXPOSE 3000

CMD [ "npm", "run", "start" ]