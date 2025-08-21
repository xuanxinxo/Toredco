FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma

RUN npm install \
 && npx prisma generate

COPY src ./src

ENV NODE_ENV=development
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "run", "dev"]

