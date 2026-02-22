#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NGINX_CONF="$PROJECT_DIR/nginx/nginx.conf"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# Determine currently active environment
if grep -q "frontend-blue" "$NGINX_CONF"; then
    ACTIVE="blue"
    INACTIVE="green"
else
    ACTIVE="green"
    INACTIVE="blue"
fi

echo "========================================"
echo " Blue-Green Deployment"
echo "========================================"
echo " Active environment:   $ACTIVE"
echo " Deploying to:         $INACTIVE"
echo "========================================"

# Pull latest images
echo ""
echo ">> Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull "frontend-${INACTIVE}" "backend-${INACTIVE}"

# Recreate inactive environment containers with new images
echo ""
echo ">> Recreating $INACTIVE environment containers..."
docker compose -f "$COMPOSE_FILE" up -d --force-recreate "backend-${INACTIVE}" "frontend-${INACTIVE}"

# Wait for the new environment to become healthy
echo ""
echo ">> Waiting for $INACTIVE environment health check..."
MAX_RETRIES=30
RETRY_INTERVAL=2

for i in $(seq 1 $MAX_RETRIES); do
    if docker compose -f "$COMPOSE_FILE" exec -T "frontend-${INACTIVE}" wget -qO- http://127.0.0.1/health > /dev/null 2>&1; then
        echo "   Health check passed! ($i/$MAX_RETRIES)"
        break
    fi

    if [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "   Health check FAILED after $MAX_RETRIES attempts."
        echo "   Keeping traffic on $ACTIVE environment. Deployment aborted."
        exit 1
    fi

    echo "   Attempt $i/$MAX_RETRIES - waiting ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
done

# Switch traffic to the new environment
echo ""
echo ">> Switching traffic to $INACTIVE environment..."
"$SCRIPT_DIR/switch.sh" "$INACTIVE"

echo ""
echo "========================================"
echo " Deployment complete!"
echo " Active environment is now: $INACTIVE"
echo "========================================"
echo ""
echo " To rollback, run:"
echo "   $SCRIPT_DIR/switch.sh $ACTIVE"
echo ""
