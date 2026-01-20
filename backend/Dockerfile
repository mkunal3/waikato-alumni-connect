# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (will be overridden by docker-compose)
EXPOSE 4000

# Run database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
