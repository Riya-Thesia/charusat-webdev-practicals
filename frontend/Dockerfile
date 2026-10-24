# Practical 11: Multi-Stage Frontend Dockerfile for React (Vite)
# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package manifests for efficient layer caching
COPY package*.json ./

# Install dependencies inside the Linux container environment
RUN npm install

# Copy source code and compile production assets
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve / Production Runtime Stage
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package configurations and built artifacts
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./

# Expose Vite Preview Port
EXPOSE 5173

# Serve production bundle accessible across container network
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
