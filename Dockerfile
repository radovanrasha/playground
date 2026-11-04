# syntax=docker/dockerfile:1

# ---- Build ----
# Create React App bakes REACT_APP_* variables into the JS bundle at build
# time, so the API URL is passed as a build arg (from the CI secret).
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
# CI=true would turn eslint warnings into build errors
ENV CI=false
RUN npm run build

# ---- Runtime ----
# Only the static build ends up in the final image, served by nginx.
FROM nginx:1.27-alpine AS runner
COPY deploy/nginx.container.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

# The container always listens on 80 internally; the host port is mapped
# in docker-compose.yml.
EXPOSE 80
