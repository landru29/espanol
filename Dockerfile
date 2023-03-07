FROM node@sha256:2771803756cf54d0b8031fa5239420386608bcff9f69f9e8a7afda0671982537 as builder
# node:18.12.1-bullseye

#RUN apt install && apt install -y gettext
RUN apt update && apt install -y libc-dev-bin

COPY . /application

RUN cd application && \
    yarn && \
    npm run build

FROM caddy@sha256:7992b931b7da3cf0840dd69ea74b2c67d423faf03408da8abdc31b7590a239a7
# caddy:2.6-alpine

RUN apk add gettext

COPY --from=builder /application/build /usr/share/caddy
COPY ./entrypoint.sh /bin/entrypoint.sh
COPY ./Caddyfile /etc/caddy/Caddyfile
RUN chmod +x /bin/entrypoint.sh

HEALTHCHECK --start-period=2s --interval=10s --timeout=10s --retries=3 CMD curl --fail http://localhost:80 || exit 1

ENTRYPOINT [ "/bin/entrypoint.sh" ]
CMD []