FROM node:24-bookworm

WORKDIR /app

# Copy package files
COPY package*.json ./

# 👇 COPY PRISMA FIRST (this fixes the error)
COPY prisma ./prisma

# Install deps (postinstall can now find schema.prisma)
RUN npm install --legacy-peer-deps

# Copy the rest of the project
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
