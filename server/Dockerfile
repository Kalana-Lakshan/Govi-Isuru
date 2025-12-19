# 1. Use a slim version of Node.js to reduce image size (saves ~600MB)
FROM node:22-slim

# 2. Set the environment to production
ENV NODE_ENV=production

# 3. Create app directory
WORKDIR /usr/src/app

# 4. Copy package files first
# This ensures 'npm install' only runs when your dependencies change
COPY package*.json ./

# 5. Install only production dependencies
# This keeps the image small by excluding development tools like nodemon
RUN npm install --only=production

# 6. Bundle app source
COPY . .

# 7. Expose the port (matches your index.js port)
EXPOSE 5000

# 8. Start the server
CMD ["node", "index.js"]