# Use Node.js 22 LTS as runtime
FROM node:22-slim

# Set environment
ENV TERM=xterm
ENV NODE_ENV=production

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install global packages
RUN npm install -g pm2

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN npm run build

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 5555

# Run migrations and start with PM2
CMD ["sh", "-c", "npx knex migrate:latest --env production && pm2-runtime start build/server.js --name laju"]