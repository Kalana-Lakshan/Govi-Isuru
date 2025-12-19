# STAGE 1: Build
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Only copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

# Capture the argument from docker-compose
ARG REACT_APP_AI_SERVICE_URL
# Make it available to the build process
ENV REACT_APP_AI_SERVICE_URL=$REACT_APP_AI_SERVICE_URL

RUN npm run build

# STAGE 2: Serve
FROM nginx:alpine

# IMPORTANT: If you are using Vite, the build folder is named 'dist'
# If you are using Create React App (CRA), it is named 'build'
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Add a custom Nginx config to handle React Router 404s
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]