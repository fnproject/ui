FROM node:8.12-alpine
MAINTAINER fnservice.io

RUN mkdir /app
WORKDIR /app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install -g webpack@1.15.0
COPY package.json /app
RUN npm install

# Bundle app source
COPY . /app

# Build assets
RUN webpack

ENV NODE_ENV production
ENV PORT 4000
EXPOSE 4000

CMD [ "npm", "start" ]
