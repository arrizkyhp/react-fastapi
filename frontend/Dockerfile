# Stage 1: Build the React application
FROM node:20-alpine AS build-stage
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package*.json ./
# Use pnpm install instead of npm install
RUN pnpm install

COPY . .
# Use pnpm run build instead of npm run build
RUN pnpm run build

# Stage 2: Serve the React application with Nginx
FROM nginx:stable-alpine as production-stage
# Copy the built frontend files into Nginx's default static directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80, the default HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
