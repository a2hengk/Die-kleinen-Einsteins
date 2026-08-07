FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Next.js imports the API route modules while collecting build metadata.
# The postgres client only needs a syntactically valid URL at this point;
# docker-compose supplies the actual runtime value below.
RUN DATABASE_URL=postgres://postgres:postgres@db:5432/die_kleinen_einsteins npm run build

EXPOSE 3000

CMD npm run db:migrate && npm start

