# Étape de build
FROM node:20-alpine AS builder
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code et build
COPY . .
RUN npm run build

# Étape de production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copie des fichiers nécessaires depuis l'étape de build (mode standalone)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
