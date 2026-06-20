# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# --- run stage (static + visitor API) ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
COPY package*.json ./
RUN npm ci --legacy-peer-deps --omit=dev
COPY server ./server
COPY --from=builder /app/dist ./dist
RUN mkdir -p logs && chown -R node:node logs
USER node
EXPOSE 80
CMD ["node", "server/index.mjs"]
