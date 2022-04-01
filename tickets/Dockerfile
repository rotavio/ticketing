FROM node:16.14.2-alpine3.15


RUN npm config set update-notifier false && npm config set fund false
WORKDIR /app
COPY package.json ./
RUN npm install --only=prod
COPY ./ ./

CMD ["npm", "start"]
