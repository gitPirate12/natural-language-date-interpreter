# Base stage
FROM node:22.14.0-alpine AS base
WORKDIR /app
# Install libc6-compat for mysql2 (Drizzle ORM)
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
# Install dependencies, clean cache
RUN npm ci --omit=optional && npm cache clean --force

# Final stage
FROM base AS final
WORKDIR /app
# Create non-root user
RUN addgroup -S appgroup && adduser -S -G appgroup appuser
# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy app files
COPY . .
# Set permissions
RUN chown -R appuser:appgroup /app
# Switch to non-root user
USER appuser
# Expose port
EXPOSE 3000
# Set environment (development for nodemon, override in production)
ENV NODE_ENV=development
# Run nodemon for development
CMD ["npm", "run", "dev"]
