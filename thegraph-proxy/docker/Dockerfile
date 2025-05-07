FROM nginx:alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Copy config template and entrypoint script
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY entrypoint.sh /docker-entrypoint.d/entrypoint.sh

# Make sure entrypoint is executable
RUN chmod +x /docker-entrypoint.d/entrypoint.sh