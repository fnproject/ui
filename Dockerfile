FROM mhart/alpine-node:6.3
MAINTAINER fnservice.io

RUN mkdir /app
WORKDIR /app

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV NPM_CONFIG_PREFIX=/root/.npm-global
RUN npm install webpack -g
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
