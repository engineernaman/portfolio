# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# If your build script is "build" (Vite default)
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
# Optional: better caching; SPA 404 to index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
