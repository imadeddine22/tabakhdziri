# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads/dishes uploads/instagram

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
