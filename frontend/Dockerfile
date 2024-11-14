# Use the official Node.js image as a base
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js app
RUN pnpm build

# Production stage
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Install pnpm globally in the production container
RUN npm install -g pnpm

# Copy only the necessary files from the build stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

# Set environment variable to production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["pnpm", "start"]
