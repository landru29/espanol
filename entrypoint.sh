#!/bin/sh

cat /config.tmpl.js | envsubst >  /usr/share/caddy/config.js

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile