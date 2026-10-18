FROM node:22-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build frontend assets
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the Express server using tsx to execute server.ts cleanly in production
CMD ["npx", "tsx", "server.ts"]
