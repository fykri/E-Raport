@echo off
REM E-Raport Docker Management Script for Windows

if "%1"=="start" (
    echo Starting E-Raport application...
    docker-compose up -d
    echo Application is starting. Access:
    echo   - Frontend: http://localhost:3109
    echo   - Backend API: http://localhost:8908
    echo   - Database: localhost:5432
    goto :eof
)

if "%1"=="stop" (
    echo Stopping E-Raport application...
    docker-compose down
    goto :eof
)

if "%1"=="restart" (
    echo Restarting E-Raport application...
    docker-compose down
    docker-compose up -d
    goto :eof
)

if "%1"=="logs" (
    docker-compose logs -f
    goto :eof
)

if "%1"=="status" (
    docker-compose ps
    goto :eof
)

if "%1"=="db-migrate" (
    echo Running database migrations...
    docker-compose exec backend npx prisma migrate deploy
    goto :eof
)

if "%1"=="db-seed" (
    echo Seeding database...
    docker-compose exec backend npm run seed:kategori
    docker-compose exec backend npm run seed:profil
    goto :eof
)

if "%1"=="studio" (
    echo Starting Prisma Studio...
    docker-compose --profile tools up prisma-studio -d
    echo Prisma Studio available at: http://localhost:5555
    goto :eof
)

if "%1"=="clean" (
    echo Cleaning up Docker resources...
    docker-compose down -v
    docker system prune -f
    goto :eof
)

if "%1"=="build" (
    echo Building Docker images...
    docker-compose build
    goto :eof
)

echo Usage: %0 {start^|stop^|restart^|logs^|status^|db-migrate^|db-seed^|studio^|clean^|build}
echo.
echo Commands:
echo   start      - Start all services
echo   stop       - Stop all services
echo   restart    - Restart all services
echo   logs       - Show logs from all services
echo   status     - Show status of all services
echo   db-migrate - Run database migrations
echo   db-seed    - Seed the database with initial data
echo   studio     - Start Prisma Studio for database management
echo   clean      - Clean up all Docker resources
echo   build      - Build all Docker images
