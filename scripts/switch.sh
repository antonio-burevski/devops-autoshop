#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <prod|dev> <blue|green>"
    exit 1
fi

ENV="$1"
TARGET="$2"

if [ "$TARGET" != "blue" ] && [ "$TARGET" != "green" ]; then
    echo "Error: second argument must be 'blue' or 'green'"
    exit 1
fi

if [ "$ENV" = "dev" ]; then
    NGINX_CONF="$PROJECT_DIR/nginx/nginx.dev.conf"
    COMPOSE_FILE="$PROJECT_DIR/docker-compose.dev.yml"
    COMPOSE_PROJECT="autoshop-dev"
else
    NGINX_CONF="$PROJECT_DIR/nginx/nginx.conf"
    COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
    COMPOSE_PROJECT="autoshop"
fi

echo "Switching [$ENV] traffic to $TARGET environment..."

cat > "$NGINX_CONF" <<EOF
upstream active {
    server frontend-${TARGET}:80;
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://active;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Reload nginx without downtime
docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" exec nginx nginx -s reload

echo "Traffic switched to $TARGET environment successfully."
