# back-end/Dockerfile
FROM node:lts-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy only package files first
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 5000