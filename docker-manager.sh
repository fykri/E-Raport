#!/bin/bash

# E-Raport Docker Management Script

# Check if docker compose or docker-compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "Error: Neither 'docker-compose' nor 'docker compose' is available."
    echo "Please install Docker Compose."
    exit 1
fi

case "$1" in
  start)
    echo "Starting E-Raport application..."
    $DOCKER_COMPOSE up -d
    echo "Application is starting. Access:"
    echo "  - Frontend: http://localhost:3109"
    echo "  - Backend API: http://localhost:8908"
    echo "  - Database: localhost:5432"
    ;;
  
  stop)
    echo "Stopping E-Raport application..."
    $DOCKER_COMPOSE down
    ;;
  
  restart)
    echo "Restarting E-Raport application..."
    $DOCKER_COMPOSE down
    $DOCKER_COMPOSE up -d
    ;;
  
  logs)
    $DOCKER_COMPOSE logs -f
    ;;
  
  status)
    $DOCKER_COMPOSE ps
    ;;
  
  db-migrate)
    echo "Running database migrations..."
    $DOCKER_COMPOSE exec backend npx prisma migrate deploy
    ;;
  
  db-seed)
    echo "Seeding database..."
    $DOCKER_COMPOSE exec backend npm run seed:kategori
    $DOCKER_COMPOSE exec backend npm run seed:profil
    ;;
  
  studio)
    echo "Starting Prisma Studio..."
    $DOCKER_COMPOSE --profile tools up prisma-studio -d
    echo "Prisma Studio available at: http://localhost:5555"
    ;;
  
  clean)
    echo "Cleaning up Docker resources..."
    $DOCKER_COMPOSE down -v
    docker system prune -f
    ;;
  
  build)
    echo "Building Docker images..."
    $DOCKER_COMPOSE build
    ;;
  
  *)
    echo "Usage: $0 {start|stop|restart|logs|status|db-migrate|db-seed|studio|clean|build}"
    echo ""
    echo "Commands:"
    echo "  start      - Start all services"
    echo "  stop       - Stop all services"
    echo "  restart    - Restart all services"
    echo "  logs       - Show logs from all services"
    echo "  status     - Show status of all services"
    echo "  db-migrate - Run database migrations"
    echo "  db-seed    - Seed the database with initial data"
    echo "  studio     - Start Prisma Studio for database management"
    echo "  clean      - Clean up all Docker resources"
    echo "  build      - Build all Docker images"
    exit 1
    ;;
esac
