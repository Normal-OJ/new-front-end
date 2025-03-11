FROM node:22-alpine

ENV PNPM_HOME="/pnpm"

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

RUN corepack prepare pnpm@8.6.5 --activate

ENV VITE_APP_API_BASE_URL "http://localhost:8080/api"

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

CMD [ "pnpm", "run", "dev", "--host" ]