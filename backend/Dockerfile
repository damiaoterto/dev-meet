FROM node:22-alpine AS builder

WORKDIR /usr/share/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install

COPY ./ ./

RUN pnpm run build

FROM node:22-alpine

WORKDIR /usr/share/app

COPY --from=builder /usr/share/app/dist ./dist
COPY --from=builder /usr/share/app/package*.json ./
COPY --from=builder /usr/share/app/pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install --prod

EXPOSE 3000

CMD [ "node", "-r", "dotenv/config", "dist/main" ]
