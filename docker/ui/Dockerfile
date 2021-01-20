# 1. Build
FROM node:14 AS builder

COPY /ui /opt/app/
WORKDIR /opt/app
# Install node modules and build for production
RUN npm install && npm run build

# 2. Start
FROM nginx:alpine
# Remove default nginx static assets
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=builder /opt/app/build .
# Override default.conf with local one
COPY /docker/ui/nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]