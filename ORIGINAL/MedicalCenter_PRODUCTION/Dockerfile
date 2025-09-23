# Build client
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY client ./client
RUN cd client && npm ci && npm run build

# Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
COPY --from=builder /app/client/dist ./client/dist
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]