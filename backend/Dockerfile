# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 8080

# Run nodemon for dev
CMD ["npm", "run", "dev"]
