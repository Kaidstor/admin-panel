FROM node:lts-alpine3.20

# Install pnpm package manager
RUN npm install -g pnpm

WORKDIR /app

# Copy package files and install dependencies using pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the app's source code and build using pnpm
COPY . .

# Expose port 3000 and start the app
CMD ["node", "dist"]