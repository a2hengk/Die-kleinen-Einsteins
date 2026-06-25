FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]


# mit docker build -t die-kleinen-einsteins . kann das Image gebaut werden
# danach docker images und das Image ID rauskopieren
# mit docker run -d -p 3000:3000 <IMAGE_ID> kann das Image gestartet werden
# falls es nicht starten will einfach ein sudo vor dem docker :D ( wenn es dann auch nicht startet dann schreibt mir ne Nachricht :D )
