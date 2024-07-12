#!/bin/bash

# Задание переменных
REMOTE_HOST="gidcaf"
REMOTE_PATH="/var/www/admin-panel"
REMOTE_DOCKER_NAME="client"
DOCKER_COMPOSE_PATH="/var/www/admin-panel"

# Вызов основного скрипта с передачей переменных
~/r_deploy.sh -h $REMOTE_HOST -p $REMOTE_PATH
# ~/r_deploy.sh -h $REMOTE_HOST -p $REMOTE_PATH -c $REMOTE_DOCKER_NAME

# build container
# ~/r_deploy.sh -h "$REMOTE_HOST" -p "$REMOTE_PATH" -c $REMOTE_DOCKER_NAME -b "$DOCKER_COMPOSE_PATH" # --no-build