FROM node:16-alpine
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
USER 1000
EXPOSE 8080
CMD [ "npm" , "start"]