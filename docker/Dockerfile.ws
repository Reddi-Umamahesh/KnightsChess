FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json .npmrc ./


COPY apps/ws/package.json apps/ws/
COPY packages/db/package.json packages/db/

RUN npm install

COPY apps/ws apps/ws/
COPY packages/db packages/db/


RUN npm run generate:db

EXPOSE 8080

CMD ["npm", "run","start:ws"]
