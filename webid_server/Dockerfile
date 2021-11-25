FROM nikolaik/python-nodejs as init

RUN pip install opencv-python
RUN pip install numpy
RUN pip install imutils

RUN apt-get update

RUN apt-get install ffmpeg libsm6 libxext6  -y
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g typescript

RUN npm install
RUN npm install -g ts-node

COPY . . 

RUN tsc

EXPOSE 3000

#dev-stage
FROM init as dev-stage

CMD [ "npm", "run", "serve" ]

#prod-stage
FROM init as prod-stage

CMD [ "npm", "run", "start" ]
