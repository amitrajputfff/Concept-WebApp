#!/bin/bash

# ============================================
# Concept-WebApp Deployment Script
# ============================================
# This script sets up and deploys the application
# with Docker and Nginx on a new server
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="${DOMAIN:-propel.liaplus.com}"
EMAIL="${EMAIL:-}"
SSL_ENABLED="${SSL_ENABLED:-true}"

# Print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        print_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check for docker compose (V2) or docker-compose (V1)
    if ! docker compose version >/dev/null 2>&1 && ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Check if ports are available
check_ports() {
    print_info "Checking if required ports are available..."
    
    if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 80 is already in use. You may need to stop the service using it."
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 443 is already in use. You may need to stop the service using it."
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    print_success "Ports are available"
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    
    mkdir -p nginx/certbot
    mkdir -p nginx/conf.d
    
    print_success "Directories created"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating a template..."
        cat > .env << EOF
# Environment Configuration
NODE_ENV=production

# Azure OpenAI Configuration (if needed)
# AZURE_OPENAI_ENDPOINT=your-endpoint
# AZURE_OPENAI_API_KEY=your-key
# AZURE_OPENAI_DEPLOYMENT=your-deployment

# Domain Configuration
DOMAIN=${DOMAIN}
EOF
        print_success ".env file created. Please update it with your configuration."
    else
        print_success ".env file already exists"
    fi
}

# Update nginx configuration with domain
update_nginx_config() {
    print_info "Updating nginx configuration..."
    
    if [ -f nginx/conf.d/default.conf ]; then
        # Update domain in nginx config if it's different
        if grep -q "server_name" nginx/conf.d/default.conf; then
            sed -i.bak "s/server_name.*/server_name ${DOMAIN} localhost;/g" nginx/conf.d/default.conf
            print_success "Nginx configuration updated with domain: ${DOMAIN}"
        fi
    else
        print_warning "nginx/conf.d/default.conf not found. Using existing configuration."
    fi
}

# Setup SSL certificates (optional)
setup_ssl() {
    if [ "$SSL_ENABLED" = "true" ]; then
        print_info "Setting up SSL certificates for ${DOMAIN}..."
        
        if [ -z "$EMAIL" ]; then
            print_warning "Email is required for SSL certificate setup"
            read -p "Enter your email for Let's Encrypt: " EMAIL
            if [ -z "$EMAIL" ]; then
                print_error "Email cannot be empty"
                exit 1
            fi
        fi
        
        # Check if certificate already exists
        if [ -d "/etc/letsencrypt/live/${DOMAIN}" ]; then
            print_info "SSL certificate already exists for ${DOMAIN}"
            print_info "To renew, run: docker compose run --rm certbot renew"
            return 0
        fi
        
        # Start nginx first to serve ACME challenges
        print_info "Starting nginx for ACME challenge..."
        docker compose up -d nginx 2>/dev/null || true
        sleep 5
        
        # Request certificate using webroot method (nginx must be running)
        print_info "Requesting SSL certificate for ${DOMAIN}..."
        docker compose run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email "${EMAIL}" \
            --agree-tos \
            --no-eff-email \
            --non-interactive \
            -d "${DOMAIN}" || {
            print_warning "SSL certificate setup failed. Trying standalone method..."
            
            # Fallback to standalone method
            docker compose stop nginx 2>/dev/null || true
            docker compose run --rm certbot certonly \
                --standalone \
                --preferred-challenges http \
                -d "${DOMAIN}" \
                --email "${EMAIL}" \
                --agree-tos \
                --no-eff-email \
                --non-interactive || {
                print_error "SSL certificate setup failed. Please check:"
                print_info "  1. Domain ${DOMAIN} points to this server"
                print_info "  2. Ports 80 and 443 are accessible"
                print_info "  3. Firewall allows HTTP/HTTPS traffic"
                read -p "Continue without SSL? (y/n) " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
                SSL_ENABLED="false"
                return 1
            }
        }
        
        if [ "$SSL_ENABLED" = "true" ]; then
            print_success "SSL certificate obtained for ${DOMAIN}"
            print_info "Certificate will auto-renew via certbot container"
        fi
    else
        print_info "SSL setup skipped. Set SSL_ENABLED=true to enable SSL."
    fi
}

# Build and start containers
deploy_application() {
    print_info "Building and starting Docker containers..."
    
    # Stop existing containers if running
    docker compose down 2>/dev/null || true
    
    # Build and start
    docker compose up -d --build
    
    print_success "Containers started"
}

# Wait for services to be ready
wait_for_services() {
    print_info "Waiting for services to be ready..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker compose ps | grep -q "Up"; then
            if curl -f http://localhost:3000 >/dev/null 2>&1 || curl -f http://localhost >/dev/null 2>&1; then
                print_success "Services are ready!"
                return 0
            fi
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    print_warning "Services may not be fully ready yet. Check logs with: docker compose logs"
}

# Display deployment information
show_deployment_info() {
    echo ""
    print_success "=========================================="
    print_success "Deployment Complete!"
    print_success "=========================================="
    echo ""
    print_info "Application Status:"
    docker compose ps
    echo ""
    print_info "Access your application:"
    echo "  - HTTP:  http://${DOMAIN}"
    echo "  - HTTP:  http://localhost"
    if [ "$SSL_ENABLED" = "true" ]; then
        echo "  - HTTPS: https://${DOMAIN}"
    fi
    echo ""
    print_info "Useful commands:"
    echo "  - View logs:        docker compose logs -f"
    echo "  - View app logs:    docker compose logs -f app"
    echo "  - View nginx logs:  docker compose logs -f nginx"
    echo "  - Stop services:    docker compose down"
    echo "  - Restart services: docker compose restart"
    echo "  - Update app:       docker compose up -d --build"
    echo ""
    print_info "SSL Certificate Management:"
    echo "  - Renew certificate: docker compose run --rm certbot renew"
    echo "  - Test renewal:      docker compose run --rm certbot renew --dry-run"
    echo ""
}

# Main deployment function
main() {
    echo ""
    print_info "=========================================="
    print_info "Concept-WebApp Deployment Script"
    print_info "=========================================="
    echo ""
    
    # Check if running as root (not recommended for Docker)
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root. It's recommended to run as a regular user with Docker permissions."
    fi
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --email)
                EMAIL="$2"
                shift 2
                ;;
            --ssl)
                SSL_ENABLED="true"
                shift
                ;;
            --help)
                echo "Usage: ./deploy.sh [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --domain DOMAIN    Set the domain name (default: dev.liaplus.com)"
                echo "  --email EMAIL      Set email for SSL certificate"
                echo "  --ssl              Enable SSL certificate setup"
                echo "  --help             Show this help message"
                echo ""
                echo "Environment variables:"
                echo "  DOMAIN             Domain name"
                echo "  EMAIL              Email for SSL"
                echo "  SSL_ENABLED        Enable SSL (true/false)"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    check_ports
    create_directories
    setup_environment
    update_nginx_config
    
    if [ "$SSL_ENABLED" = "true" ]; then
        setup_ssl
    fi
    
    deploy_application
    wait_for_services
    show_deployment_info
}

# Run main function
main "$@"

