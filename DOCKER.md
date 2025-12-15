# Docker Setup Guide

This project includes Docker configuration for easy deployment.

## Files Created

- `Dockerfile` - Multi-stage build for Next.js application
- `docker-compose.yml` - Orchestration file with Next.js app and Nginx
- `.dockerignore` - Files to exclude from Docker build context
- `nginx/nginx.conf` - Main Nginx configuration (replace with your own)
- `nginx/conf.d/default.conf` - Server configuration (replace with your own)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Replace Nginx Configuration**
   - Replace `nginx/nginx.conf` with your own nginx setup
   - Replace `nginx/conf.d/default.conf` with your server configuration

2. **Build and Run**
   ```bash
   docker-compose up -d --build
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

## Configuration

### Environment Variables

Add a `.env` file in the root directory for environment variables:
```
NODE_ENV=production
# Add your other environment variables here
```

Then update `docker-compose.yml` to load the `.env` file:
```yaml
services:
  app:
    env_file:
      - .env
```

### Ports

- **Next.js App**: Exposed on port 3000 (internal)
- **Nginx**: Exposed on ports 80 (HTTP) and 443 (HTTPS)

To change ports, modify the `ports` section in `docker-compose.yml`.

### SSL Certificates

If you have SSL certificates, uncomment the SSL volume mount in `docker-compose.yml`:
```yaml
volumes:
  - ./nginx/ssl:/etc/nginx/ssl:ro
```

## Development

For development, you can run the app directly without Docker:
```bash
npm run dev
```

## Production Deployment

1. Ensure `next.config.ts` has `output: 'standalone'` (already configured)
2. Build the Docker image: `docker-compose build`
3. Run in production: `docker-compose up -d`
4. Monitor logs: `docker-compose logs -f app`

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **App won't start**: Check logs with `docker-compose logs app`
- **Nginx errors**: Verify nginx configuration with `docker-compose exec nginx nginx -t`
- **Port conflicts**: Change ports in `docker-compose.yml`

