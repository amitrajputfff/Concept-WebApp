#!/bin/bash

# ============================================
# SSL Certificate Setup Script
# ============================================
# This script sets up SSL certificates using certbot
# Run this after deploy.sh has successfully started the application
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
        print_error "Docker is not installed."
        exit 1
    fi
    
    if ! docker compose ps | grep -q "Up"; then
        print_error "Docker containers are not running. Please run ./deploy.sh first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Setup SSL certificates
setup_ssl() {
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
        read -p "Do you want to renew it? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Renewing certificate..."
            docker compose run --rm certbot renew
            print_success "Certificate renewed"
            print_info "Reloading nginx..."
            docker compose exec nginx nginx -s reload
            return 0
        else
            print_info "Certificate setup skipped."
            return 0
        fi
    fi
    
    print_info "Before obtaining SSL certificate, please ensure:"
    print_info "  1. Domain ${DOMAIN} points to this server's IP address"
    print_info "  2. Ports 80 and 443 are open in firewall"
    print_info "  3. No other service is using ports 80/443"
    print_info "  4. Docker containers are running (nginx and app)"
    read -p "Continue with SSL setup? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "SSL setup cancelled."
        exit 0
    fi
    
    # First, try standalone method (simpler, doesn't require nginx running)
    print_info "Attempting to obtain SSL certificate using standalone method..."
    print_info "This will temporarily use port 80, so nginx must be stopped..."
    
    # Stop nginx for standalone certbot
    print_info "Stopping nginx temporarily..."
    docker compose stop nginx
    sleep 2
    
    # Request certificate using standalone method
    print_info "Requesting SSL certificate for ${DOMAIN}..."
    if docker run --rm \
        -v /etc/letsencrypt:/etc/letsencrypt \
        -v ./nginx/certbot:/var/www/certbot \
        -p 80:80 \
        certbot/certbot certonly \
        --standalone \
        --preferred-challenges http \
        -d "${DOMAIN}" \
        --email "${EMAIL}" \
        --agree-tos \
        --no-eff-email \
        --non-interactive; then
        print_success "SSL certificate obtained for ${DOMAIN}"
        # Restart nginx after certificate is obtained
        print_info "Starting nginx with SSL certificate..."
        docker compose up -d nginx
        sleep 3
        print_success "Nginx restarted with SSL configuration"
        return 0
    else
        print_warning "Standalone method failed. Trying webroot method..."
        
        # Start nginx for webroot method
        print_info "Starting nginx for webroot method..."
        docker compose up -d nginx
        sleep 5
        
        # Try webroot method
        if docker run --rm \
            -v /etc/letsencrypt:/etc/letsencrypt \
            -v ./nginx/certbot:/var/www/certbot \
            --network concept-webapp_app-network \
            certbot/certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email "${EMAIL}" \
            --agree-tos \
            --no-eff-email \
            --non-interactive \
            -d "${DOMAIN}"; then
            print_success "SSL certificate obtained for ${DOMAIN}"
            print_info "Reloading nginx..."
            docker compose exec nginx nginx -s reload
            return 0
        else
            print_error "SSL certificate setup failed. Common issues:"
            print_info "  1. Domain ${DOMAIN} must point to this server's IP"
            print_info "  2. Port 80 must be accessible from the internet"
            print_info "  3. Check DNS: dig ${DOMAIN} or nslookup ${DOMAIN}"
            print_info "  4. Check firewall: sudo ufw status (if using UFW)"
            print_info "  5. Make sure system nginx is stopped: sudo systemctl stop nginx"
            exit 1
        fi
    fi
}

# Main function
main() {
    echo ""
    print_info "=========================================="
    print_info "SSL Certificate Setup Script"
    print_info "=========================================="
    echo ""
    
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
            --help)
                echo "Usage: ./setup-ssl.sh [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --domain DOMAIN    Set the domain name (default: propel.liaplus.com)"
                echo "  --email EMAIL      Set email for SSL certificate"
                echo "  --help             Show this help message"
                echo ""
                echo "Environment variables:"
                echo "  DOMAIN             Domain name"
                echo "  EMAIL              Email for SSL"
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
    
    check_prerequisites
    setup_ssl
    
    echo ""
    print_success "=========================================="
    print_success "SSL Setup Complete!"
    print_success "=========================================="
    echo ""
    print_info "Your application should now be accessible at:"
    echo "  - HTTPS: https://${DOMAIN}"
    echo ""
    print_info "Certificate renewal:"
    echo "  - Manual renewal: docker run --rm -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot renew"
    echo "  - Test renewal:   docker run --rm -v /etc/letsencrypt:/etc/letsencrypt certbot/certbot renew --dry-run"
    echo ""
}

# Run main function
main "$@"


