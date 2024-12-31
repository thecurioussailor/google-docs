FROM node:alpine

WORKDIR /app

RUN npm install -g pnpm

COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./pnpm-workspace.yaml .
COPY ./turbo.json .
COPY ./packages .
COPY ./apps/frontend .

RUN pnppm install
RUN pnpm build

CMD ["pnpm", "start:"]