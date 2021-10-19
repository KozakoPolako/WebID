#develop stage
FROM node:14 as dev-stage

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

#build stage
FROM dev-stage as build-stage
RUN yarn build

#production stage
FROM nginx:1.20.1 as prod-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]