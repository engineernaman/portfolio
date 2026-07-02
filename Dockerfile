# Runtime image — frontend is built in CI (see .github/workflows/deploy.yml).
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
COPY package*.json ./
RUN npm ci --legacy-peer-deps --omit=dev
COPY server ./server
COPY dist ./dist
RUN mkdir -p logs && chown -R node:node logs
USER node
EXPOSE 80
CMD ["node", "server/index.mjs"]
