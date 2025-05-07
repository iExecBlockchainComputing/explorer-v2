#!/bin/sh

# Replace env vars in template and save to nginx config dir
envsubst '$THEGRAPH_GATEWAY_DOMAIN $THEGRAPH_API_KEY' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx (inherited from base image entrypoint)
exec "$@"
