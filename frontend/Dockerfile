# Use the official Node.js image as a base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json, pnpm-lock.yaml, and .npmrc (if used) to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Install pnpm globally in the production container
RUN npm install -g pnpm

# Copy only the necessary files from the previous build
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./


# Set environment variable to run Next.js in production mode
ENV NODE_ENV=production

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
