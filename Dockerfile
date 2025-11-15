# ---- Build 
FROM node:20 AS build 

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

# --- Produção ---
FROM node:20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3050
EXPOSE 3000

# Gere as migrations no runtime
CMD ["sh", "-c", "pnpm prisma generate && node dist/src/main.js"]
