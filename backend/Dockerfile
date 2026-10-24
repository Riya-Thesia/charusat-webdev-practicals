# Practical 11: Backend Dockerfile for Node.js Express REST API
FROM node:18-alpine

# Set container working directory
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy application source files
COPY . .

# Expose backend REST API port
EXPOSE 5000

# Set default runtime environment
ENV NODE_ENV=production
ENV PORT=5000

# Start Express API Server
CMD ["node", "server.js"]
