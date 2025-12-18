# Use Node.js version 22
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port your server runs on
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]