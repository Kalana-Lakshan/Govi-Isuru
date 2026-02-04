# Multi-stage build for production Node.js backend
FROM node:22-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps --prefer-offline --omit=dev

# Production stage
FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy dependencies from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "index.js"]