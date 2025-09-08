#!/bin/sh

echo "Starting application setup..."

# Set better npm configuration for network issues
npm config set fetch-retry-mintimeout 20000
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 5

# Generate Prisma client with retry logic
echo "Generating Prisma client..."
for i in 1 2 3; do
    echo "Attempt $i to generate Prisma client..."
    if npx prisma generate; then
        echo "Prisma client generated successfully!"
        break
    else
        echo "Attempt $i failed..."
        if [ $i -eq 3 ]; then
            echo "Failed to generate Prisma client after 3 attempts"
            echo "The application may not work properly, but continuing anyway..."
        else
            echo "Waiting 10 seconds before retry..."
            sleep 10
        fi
    fi
done

# Start the application
echo "Starting the application..."
exec npm start
