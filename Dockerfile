FROM node:alpine
MAINTAINER rhyuen
WORKDIR /app
COPY package.json package.json
RUN "npm install"
COPY . .
// make a new group and new user stufff
// change permissions
// make it go
