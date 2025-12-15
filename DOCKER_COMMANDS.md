# Docker Commands for Concept-WebApp

## Quick Start Commands

### 1. Build and Start Services
```bash
docker-compose up -d --build
```

### 2. View Logs
```bash
# All services
docker-compose logs -f

# Just the Next.js app
docker-compose logs -f app

# Just nginx
docker-compose logs -f nginx
```

### 3. Stop Services
```bash
docker-compose down
```

### 4. Stop and Remove Volumes
```bash
docker-compose down -v
```

### 5. Rebuild After Code Changes
```bash
docker-compose up -d --build --force-recreate
```

## Development Commands

### Check Container Status
```bash
docker-compose ps
```

### Execute Commands in Containers
```bash
# Access Next.js app container
docker-compose exec app sh

# Access nginx container
docker-compose exec nginx sh

# Test nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx configuration (without restart)
docker-compose exec nginx nginx -s reload
```

### View Container Resource Usage
```bash
docker stats
```

## Troubleshooting Commands

### Check if Ports are in Use
```bash
# Check port 80
lsof -i :80

# Check port 3000
lsof -i :3000

# Check port 443
lsof -i :443
```

### Remove All Containers and Images
```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove everything including volumes
docker-compose down -v --rmi all
```

### Clean Docker System
```bash
# Remove unused containers, networks, images
docker system prune

# Remove everything including volumes (be careful!)
docker system prune -a --volumes
```

## Production Deployment

### Build for Production
```bash
docker-compose -f docker-compose.yml build --no-cache
```

### Start in Production Mode
```bash
docker-compose up -d
```

### Update Application
```bash
# Pull latest code, then:
docker-compose up -d --build --force-recreate app
docker-compose exec nginx nginx -s reload
```

## SSL/HTTPS Setup (When Ready)

1. **Mount SSL certificates** in `docker-compose.yml`:
   ```yaml
   volumes:
     - /etc/letsencrypt:/etc/letsencrypt:ro
   ```

2. **Uncomment HTTPS server block** in `nginx/conf.d/default.conf`

3. **Comment out HTTP server block** or redirect to HTTPS

4. **Reload nginx**:
   ```bash
   docker-compose exec nginx nginx -s reload
   ```

## Environment Variables

Create a `.env` file in the project root:
```env
NODE_ENV=production
AZURE_OPENAI_ENDPOINT=your-endpoint
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_DEPLOYMENT=your-deployment
```

Then update `docker-compose.yml` to load it:
```yaml
services:
  app:
    env_file:
      - .env
```

## Access the Application

- **Via Nginx**: http://localhost (or http://dev.liaplus.com if DNS is configured)
- **Direct to Next.js**: http://localhost:3000 (only if port 3000 is exposed)

## Common Issues

### Port Already in Use
If port 80 or 443 is already in use by your system nginx:
```bash
# Stop system nginx
sudo systemctl stop nginx  # Linux
# or
sudo service nginx stop    # Linux
# or on macOS with Homebrew
brew services stop nginx
```

### Permission Denied
If you get permission errors, you may need to run with sudo (Linux) or adjust Docker permissions.

### Container Won't Start
Check logs:
```bash
docker-compose logs app
docker-compose logs nginx
```

### Nginx Configuration Errors
Test configuration:
```bash
docker-compose exec nginx nginx -t
```

