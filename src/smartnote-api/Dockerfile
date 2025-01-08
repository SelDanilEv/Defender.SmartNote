# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application
COPY . .

# Compile TypeScript to JavaScript
RUN npm install typescript --save-dev
RUN npx tsc

# Expose the backend port
EXPOSE 8081

# Start the compiled app
CMD ["node", "dist/app.js"]
