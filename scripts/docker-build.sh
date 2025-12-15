#!/bin/bash

echo "🐳 Building CareerCanvas Docker Image..."

# Build the Docker image
docker build -t careercanvas:latest .

echo "✅ Docker image built successfully!"
echo "🚀 To run: docker-compose up"