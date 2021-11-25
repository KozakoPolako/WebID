#develop stage
FROM node:14 as init

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

#dev-stage
FROM init as dev-stage
CMD ["npm","run","serve"]

#build stage
FROM prepere-stage as build-stage
RUN yarn build

#production stage
FROM nginx:1.20.1 as prod-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]