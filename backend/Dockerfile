# Use Node.js LTS version with Debian (better compatibility than Alpine)
FROM node:18-slim

# Install additional packages needed for Prisma and curl for health checks
RUN apt-get update && apt-get install -y \
    openssl \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create a non-root user with proper home directory and permissions
RUN groupadd -r nodejs && \
    useradd -r -g nodejs -m -d /home/nodejs nodejs && \
    chown -R nodejs:nodejs /app && \
    chown -R nodejs:nodejs /home/nodejs

# Copy package files with correct ownership
COPY --chown=nodejs:nodejs package*.json ./

# Switch to nodejs user for installation
USER nodejs

# Set npm cache directory and install dependencies
RUN npm config set cache /app/.npm-cache && \
    npm ci && npm cache clean --force

# Copy the rest of the application
COPY --chown=nodejs:nodejs . .

# Make startup script executable
USER root
RUN chmod +x /app/start.sh
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Use startup script
CMD ["/app/start.sh"]
