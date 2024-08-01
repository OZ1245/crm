#!/usr/bin/env sh

cd ../appwrite
sudo systemctl start docker
docker compose up -d --remove-orphans
