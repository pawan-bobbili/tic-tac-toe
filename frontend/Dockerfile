FROM node:16-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install && npm run build

FROM node:16-alpine
RUN mkdir -p /usr/src/build
RUN npm install -g serve
USER 1000
COPY --chown=1000:1000 --from=builder /usr/src/app/build /usr/src/build/
WORKDIR /usr/src
EXPOSE 3000
CMD ["serve", "-l", "3000", "-s", "build"]