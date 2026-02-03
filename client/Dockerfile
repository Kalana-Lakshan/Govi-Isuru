# Build stage
FROM node:22-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=$REACT_APP_API_URL
COPY . .
RUN npm run build

# Production stage - serve with Nginx
FROM nginx:alpine
# Copy built assets
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Create non-root user
RUN addgroup -g 101 -S nginx && adduser -S nginx -u 100
USER nginx
EXPOSE 80
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]