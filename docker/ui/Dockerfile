FROM node:14 AS builder

# Copy all files from current directory to working dir in image
COPY /ui /opt/app/

WORKDIR /opt/app
# install node modules and build assets
RUN npm install && npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /opt/app/build .
COPY /docker/ui/nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]