# DevSamurai Assignment

Full-stack application with NestJS (Backend) and React + Vite (Frontend) using Docker Compose.

## 📑 Table of Contents

- [System Requirements](#-system-requirements)
- [Quick Start Guide](#-quick-start-guide)
  - [Step 1: Clone the repository](#step-1-clone-the-repository)
  - [Step 2: Create environment file for Backend](#step-2-create-environment-file-for-backend)
  - [Step 3: Create environment file for Frontend](#step-3-create-environment-file-for-frontend)
  - [Step 4: Start the project](#step-4-start-the-project)
  - [Step 5: Access the application](#step-5-access-the-application)
- [Useful Commands](#%EF%B8%8F-useful-commands)
  - [Stop the application](#stop-the-application)
  - [View logs](#view-logs)
  - [Restart after code changes](#restart-after-code-changes)
  - [Complete project reset](#complete-project-reset)
  - [Run Prisma commands](#run-prisma-commands)
  - [Access containers](#access-containers)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
  - [Port already in use](#error-port-already-in-use)
  - [Cannot connect to database](#error-cannot-connect-to-database)
  - [Module not found](#error-module-not-found)
  - [Cannot access Frontend](#cannot-access-frontend)
  - [Database won't start](#database-wont-start)
  - [Hot reload not working](#hot-reload-not-working-windows)
- [Development](#-development)
  - [Add new dependencies](#add-new-dependencies)
  - [Create new migration](#create-new-migration)
- [Available Scripts](#-available-scripts)
- [Tech Stack](#-tech-stack)
- [Common Development Tasks](#-common-development-tasks)
- [Performance Tips](#-performance-tips)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Security](#-security)
- [Deployment](#-deployment)
- [Quick Reference](#-quick-reference---new-developer-setup)

## 📋 System Requirements

Before you begin, ensure your computer has the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac/Linux)
- [Git](https://git-scm.com/downloads)

**Note:** No need to install Node.js, pnpm, or PostgreSQL - everything runs in Docker!

## 🚀 Quick Start Guide

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd devsamurai-assignment
```

### Step 2: Create environment file for Backend

Create `.env` file in `back-end/` directory:

```bash
# Windows (PowerShell)
New-Item -Path .\back-end\.env -ItemType File

# macOS/Linux
touch back-end/.env
```

Then open `back-end/.env` and add the following content:

```env
# App Configuration
PORT=5000

# Database Configuration (for Docker)
DATABASE_URL=postgresql://devsamurai:devsamurai@database:5432/devsamurai?schema=public

# Database Configuration (individual variables for local/seed)
DB_HOST=database
DB_PORT=5432
DB_NAME=devsamurai
DB_USER=devsamurai
DB_PASSWORD=devsamurai

# Salt rounds for bcrypt
SALT_ROUNDS=10

# JWT Configuration
JWT_SECRET=37766296980a6370538ab1e1bca6cbbd

# JWT Expiration time in minutes
JWT_EXPIRES_IN=5

# API version used in global route prefix (api/v{version})
API_VERSION=1
```

**⚠️ Important Notes:**
- `DB_HOST=database` is for Docker (container name)
- For local development without Docker, change to `DB_HOST=localhost`
- The `DATABASE_URL` uses `@database` for Docker networking

### Step 3: Create environment file for Frontend

Create `.env` file in `front-end/` directory:

```bash
# Windows (PowerShell)
New-Item -Path .\front-end\.env -ItemType File

# macOS/Linux
touch front-end/.env
```

Content:

```env
# API Origin (no version suffix)
VITE_API_URL=http://localhost:5000

# API version used to construct base url like /api/v{version}
VITE_API_VERSION=1

# Backwards compatible (some setups may still use API_URL)
API_URL=http://localhost:5000/api
```

### Step 4: Start the project

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**First time will take 3-5 minutes** to:
- Download Docker images (Node.js, PostgreSQL)
- Install dependencies (pnpm install)
- Build the application
- Run migrations and seed database

### Step 5: Access the application

After seeing the log messages:

```
devsamurai-backend   | === Starting NestJS dev server ===
devsamurai-frontend  | ➜  Local:   http://localhost:5173/
```

Access:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432

### Default login credentials (after seeding)

```
Admin:
- Email: admin@devsamurai.com
- Password: password123

User:
- Email: user@devsamurai.com
- Password: password123456
```

## 🛠️ Useful Commands

### Stop the application

```bash
# Stop containers (keep data)
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (delete database)
docker-compose -f docker-compose.dev.yml down -v
```

### View logs

```bash
# View all logs
docker-compose -f docker-compose.dev.yml logs -f

# View backend logs
docker logs devsamurai-backend -f

# View frontend logs
docker logs devsamurai-frontend -f

# View database logs
docker logs devsamurai-postgres -f
```

### Restart after code changes

**No rebuild needed** - code changes are automatically detected thanks to volumes:

```bash
docker-compose -f docker-compose.dev.yml up
```

**Rebuild when:**
- Changing `package.json` (adding/removing dependencies)
- Changing `Dockerfile`
- Changing Docker Compose configuration

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Complete project reset

```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Remove images (optional)
docker rmi devsamurai-assignment-back-end devsamurai-assignment-front-end

# Start fresh
docker-compose -f docker-compose.dev.yml up --build
```

### Run Prisma commands

```bash
# Generate Prisma Client
docker exec devsamurai-backend pnpm prisma generate

# Create new migration
docker exec devsamurai-backend pnpm prisma migrate dev --name <migration-name>

# Apply migrations
docker exec devsamurai-backend pnpm prisma migrate deploy

# Re-run seed
docker exec devsamurai-backend pnpm prisma db seed

# Open Prisma Studio (database GUI)
docker exec -it devsamurai-backend pnpm prisma studio
# Then access: http://localhost:5555
```

### Access containers

```bash
# Enter backend container
docker exec -it devsamurai-backend sh

# Enter frontend container
docker exec -it devsamurai-frontend sh

# Enter database container
docker exec -it devsamurai-postgres psql -U devsamurai -d devsamurai
```

## 📁 Project Structure

```
devsamurai-assignment/
├── back-end/                 # NestJS Backend
│   ├── src/                  # Source code
│   ├── prisma/               # Prisma schema & migrations
│   │   ├── schema.prisma
│   │   └── seed-data.ts
│   ├── Dockerfile
│   ├── package.json
│   └── .env                  # ⚠️ You need to create this file
├── front-end/                # React + Vite Frontend
│   ├── src/                  # Source code
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── package.json
│   └── .env                  # ⚠️ You need to create this file
├── docker-compose.dev.yml    # Docker Compose configuration
└── README.md                 # This file
```

## 🐛 Troubleshooting

### Error: Port already in use

```
Error: bind: address already in use
```

**Solution:**
- Stop any application running on ports 5000, 5173, or 5432
- Or change the port in `docker-compose.dev.yml`

### Error: Cannot connect to database

```
ECONNREFUSED
```

**Solution:**
- Ensure `back-end/.env` has the correct `DATABASE_URL`
- Run: `docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up --build`

### Error: Module not found

```
Cannot find module 'xxx'
```

**Solution:**
```bash
# Rebuild to reinstall dependencies
docker-compose -f docker-compose.dev.yml up --build
```

### Cannot access Frontend

**Check:**
1. Access `http://localhost:5173` (not `https`)
2. View logs: `docker logs devsamurai-frontend`
3. Ensure `vite.config.ts` has `host: '0.0.0.0'`

### Database won't start

```bash
# View logs
docker logs devsamurai-postgres

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### Hot reload not working (Windows)

If code changes don't trigger automatic reload:

1. Ensure `vite.config.ts` has:
```typescript
server: {
  watch: {
    usePolling: true  // Important for Windows
  }
}
```

2. Rebuild: `docker-compose -f docker-compose.dev.yml up --build`

## 🔧 Development

### Add new dependencies

```bash
# Backend
docker exec devsamurai-backend pnpm add <package-name>

# Frontend
docker exec devsamurai-frontend pnpm add <package-name>

# Then rebuild
docker-compose -f docker-compose.dev.yml up --build
```

### Create new migration

```bash
# 1. Edit schema.prisma
# 2. Create migration
docker exec devsamurai-backend pnpm prisma migrate dev --name <migration-name>
```

## 📝 Available Scripts

### Backend (NestJS)

```bash
docker exec devsamurai-backend pnpm run start:dev    # Dev mode with hot reload
docker exec devsamurai-backend pnpm run build        # Build for production
docker exec devsamurai-backend pnpm run test         # Run tests
docker exec devsamurai-backend pnpm run lint         # Lint code
```

### Frontend (Vite)

```bash
docker exec devsamurai-frontend pnpm dev             # Dev server
docker exec devsamurai-frontend pnpm build           # Build for production
docker exec devsamurai-frontend pnpm preview         # Preview production build
```

## 📚 Tech Stack

### Backend
- **Framework:** NestJS ^11.0.1
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma ^7.2.0 with PostgreSQL Adapter
- **Authentication:** 
  - Passport.js ^0.7.0
  - JWT (JSON Web Tokens) ^11.0.2
  - bcrypt ^6.0.0
- **Validation:** 
  - class-validator ^0.14.3
  - class-transformer ^0.5.1
- **Configuration:** @nestjs/config ^4.0.2
- **Runtime:** Node.js LTS (Alpine)

### Frontend
- **Framework:** React ^19.2.0
- **Build Tool:** Vite ^7.x
- **Language:** TypeScript
- **Routing:** React Router DOM ^7.11.0
- **State Management:** 
  - Redux Toolkit ^1.9.5
  - React Redux ^8.1.1
- **UI Components:** 
  - Radix UI (Dialog, Dropdown, Popover, Avatar, etc.)
  - Lucide React ^0.562.0 (Icons)
- **Styling:** 
  - Tailwind CSS ^4.1.18
  - Class Variance Authority ^0.7.1
  - clsx ^2.1.1
  - tailwind-merge ^3.4.0
- **Forms:** 
  - React Hook Form ^7.69.0
  - Zod ^4.2.1 (Schema validation)
  - @hookform/resolvers ^5.2.2
- **Drag & Drop:** 
  - @dnd-kit/core ^6.3.1
  - @dnd-kit/sortable ^10.0.0
  - @dnd-kit/modifiers ^9.0.0
- **Date Handling:** 
  - date-fns ^4.1.0
  - react-day-picker ^9.13.0
- **Charts:** Recharts ^2.15.4
- **Animations:** Motion ^12.23.26
- **HTTP Client:** Axios ^1.13.2
- **Notifications:** Sonner ^2.0.7

### DevOps & Tools
- **Containerization:** Docker & Docker Compose
- **Package Manager:** pnpm (latest)
- **Database Client:** pg ^8.16.3
- **Code Quality:** 
  - ESLint
  - Prettier
  - TypeScript strict mode

## 📊 Performance Tips

### Speed up builds

1. **Use Docker layer caching** - Don't change `package.json` frequently
2. **Prune unused resources** regularly
3. **Use `.dockerignore`** files (already included)

### Optimize development experience

1. **Use WSL2 on Windows** for better performance
2. **Allocate more resources** to Docker Desktop (Settings → Resources)
3. **Use volumes** for code (already configured)

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m 'Add some feature'`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request

### Commit Message Guidelines

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 📄 License

[MIT License](LICENSE)

## 💬 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. View logs: `docker-compose -f docker-compose.dev.yml logs -f`
3. Search existing [GitHub Issues](https://github.com/your-repo/issues)
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Docker version)

## 🔐 Security

### Environment Variables

- Never commit `.env` files to Git
- Use different credentials for production
- Rotate secrets regularly

### Database

- Change default passwords in production
- Use SSL for database connections in production
- Regular backups

## 🚀 Deployment

This setup is for **development only**. For production:

1. Use production-ready Dockerfiles
2. Use environment-specific configurations
3. Set up proper secrets management
4. Configure reverse proxy (nginx)
5. Set up CI/CD pipeline
6. Use orchestration (Kubernetes, Docker Swarm)

---

## 🎯 Quick Reference - New Developer Setup

### For someone who just cloned the project:

**Step 1: Clone repository**
```bash
git clone <repo-url>
cd devsamurai-assignment
```

**Step 2: Create `back-end/.env`**
```env
# App Configuration
PORT=5000

# Database Configuration (for Docker)
DATABASE_URL=postgresql://devsamurai:devsamurai@database:5432/devsamurai?schema=public

# Database Configuration (individual variables)
DB_HOST=database
DB_PORT=5432
DB_NAME=devsamurai
DB_USER=devsamurai
DB_PASSWORD=devsamurai

# Salt rounds for bcrypt
SALT_ROUNDS=10

# JWT Configuration
JWT_SECRET=37766296980a6370538ab1e1bca6cbbd
JWT_EXPIRES_IN=5

# API version
API_VERSION=1
```

**Step 3: Create `front-end/.env`**
```env
# API Origin (no version suffix)
VITE_API_URL=http://localhost:5000

# API version used to construct base url like /api/v{version}
VITE_API_VERSION=1

# Backwards compatible
API_URL=http://localhost:5000/api
```

**Step 4: Start everything**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Step 5: Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

**Done! Just 5 steps!** 🎉

---

**Happy Coding! 🚀**

Made with ❤️ by DevSamurai Team