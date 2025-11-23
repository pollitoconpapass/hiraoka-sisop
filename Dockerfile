FROM node:22

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 5100

CMD ["npm", "run", "dev"]