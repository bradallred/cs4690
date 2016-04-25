FROM node:argon

RUN mkdir -p /node/cs4690
WORKDIR /node/cs4690

COPY . /node/cs4690
RUN npm install

EXPOSE 8080
CMD ["npm", "start"]

VOLUME ["/node/cs4690/app/"]
