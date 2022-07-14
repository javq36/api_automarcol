FROM node:18

RUN mkdir -p /home/app

COPY . /home/app

EXPOSE 8080

CMD ["node", "/home/app/src/index.js"]