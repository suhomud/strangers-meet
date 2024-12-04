# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]