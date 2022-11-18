# EC2 Deployment Guide

This project connects to the rds database, so only the front-end and back-end docker containers need to be deployed on ec2.

## Frontend

Change the directory to /src and run the following command:
docker-compose up -d --build frontend

## Backend

Change the directory to /src/backend and run the following command:

docker build -t backend .

docker run -d -p 8088:8088 backend
