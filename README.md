# E-Raport Application

A comprehensive school report management system built with React (Frontend) and Node.js with Prisma (Backend), containerized with Docker.

## 🚀 Features

- **Frontend**: React with Vite, Tailwind CSS, Material-UI
- **Backend**: Node.js with Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **Containerization**: Docker and Docker Compose

## 📋 Prerequisites

Make sure you have the following installed on your Linux system:

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/) (or Docker with Compose plugin)
- Git

### Check if Docker is installed:
```bash
docker --version
docker compose version
# or
docker-compose --version
```

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Frasydi/E-Raport.git
cd E-Raport
```

### 2. Make the Management Script Executable
```bash
chmod +x docker-manager.sh
```

### 3. Configure Environment Variables (Optional)
The application comes with default environment variables. If you want to customize them, edit the `.env` file:

```bash
nano .env
```

### 4. Build and Start the Application
```bash
./docker-manager.sh build
./docker-manager.sh start
```

## 🎯 Usage

### Docker Management Commands

The `docker-manager.sh` script provides easy management of the application:

```bash
# Start all services
./docker-manager.sh start

# Stop all services
./docker-manager.sh stop

# Restart all services
./docker-manager.sh restart

# View logs from all services
./docker-manager.sh logs

# Build Docker images
./docker-manager.sh build

# Run database migrations
./docker-manager.sh db-migrate

# Seed the database with initial data
./docker-manager.sh db-seed

# Start Prisma Studio (database management UI)
./docker-manager.sh studio

# Clean up Docker resources (stops containers and removes volumes)
./docker-manager.sh clean
```

### Alternative Docker Compose Commands

If you prefer using Docker Compose directly:

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Build images
docker compose build

# Start Prisma Studio
docker compose --profile tools up prisma-studio -d
```

## 🌐 Access Points

Once the application is running, you can access:

- **Frontend (React App)**: http://localhost:3109
- **Backend API**: http://localhost:8908
- **Database**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (when started)

## 📊 Database Management

### Initial Setup

1. **Run database migrations**:
   ```bash
   ./docker-manager.sh db-migrate
   ```

2. **Seed the database with initial data**:
   ```bash
   ./docker-manager.sh db-seed
   ```

### Access Prisma Studio

Prisma Studio provides a visual interface for your database:

```bash
./docker-manager.sh studio
```

Then open http://localhost:5555 in your browser.

### Manual Database Operations

```bash
# Access the database container
docker compose exec database psql -U postgres -d eraport

# Access the backend container for Prisma commands
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma generate
```

## 🏗️ Project Structure

```
E-Raport/
├── backend/                 # Node.js backend
│   ├── src/                # Source code
│   ├── prisma/             # Database schema and migrations
│   ├── Dockerfile          # Backend container configuration
│   └── package.json        # Backend dependencies
├── frontEnd/               # React frontend
│   ├── src/                # Source code
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container configuration
│   ├── nginx.conf          # Nginx configuration
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # Multi-container orchestration
├── docker-manager.sh       # Management script
└── .env                    # Environment variables
```

## 🔧 Development

### For Local Development (without Docker)

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontEnd
   npm install
   npm run dev
   ```

### Hot Reload in Docker

The current Docker setup is optimized for production. For development with hot reload, you may want to use volume mounts for the source code.

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using the port
   sudo lsof -i :3109
   sudo lsof -i :8908
   
   # Kill the process if needed
   sudo kill -9 <PID>
   ```

2. **Docker Compose Command Not Found**:
   - Try `docker compose` instead of `docker-compose`
   - Install Docker Compose plugin: `sudo apt-get install docker-compose-plugin`

3. **Permission Denied**:
   ```bash
   # Make script executable
   chmod +x docker-manager.sh
   
   # If you get permission errors during build, clean and rebuild
   ./docker-manager.sh clean
   ./docker-manager.sh build
   ```

4. **npm Permission Errors**:
   ```bash
   # If you see EACCES errors during build, try:
   ./docker-manager.sh clean
   docker system prune -f
   ./docker-manager.sh build
   ```

5. **Database Connection Issues**:
   ```bash
   # Check if database container is running
   docker compose ps
   
   # View database logs
   docker compose logs database
   
   # Restart database
   docker compose restart database
   ```

### Reset Everything

If you encounter persistent issues:

```bash
# Stop and remove everything
./docker-manager.sh clean

# Remove all Docker images (optional)
docker system prune -a

# Start fresh
./docker-manager.sh build
./docker-manager.sh start
```

## 📝 Environment Variables

Key environment variables you can customize in `.env`:

```bash
# Database
DB_PASSWORD=your_secure_password

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Node Environment
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the logs: `./docker-manager.sh logs`
3. Create an issue in the GitHub repository

---

**Happy coding! 🚀**
