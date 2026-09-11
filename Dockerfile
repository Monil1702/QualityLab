FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.app.json ./
COPY app ./app
RUN npm run build:app

FROM node:24-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY app/public ./app/public

ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server.js"]
