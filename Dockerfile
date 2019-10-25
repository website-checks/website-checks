FROM node:13-alpine as base

LABEL maintainer="Isaak Eriksson <isaak.eriksson@gmail.com>"

ENV TARGET_URL iana.org
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /src

RUN apk update && apk add --no-cache --virtual \
    .build-deps \
    udev \
    ttf-opensans \
    chromium \
    ca-certificates

FROM base as build

COPY ./package.json .
RUN yarn install --silent --pure-lockfile

FROM base

COPY --from=build /src/node_modules node_modules
COPY . .

WORKDIR /out

RUN addgroup -S pptruser && adduser -S -g pptruser -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /out

USER pptruser

CMD node /src/index.js $TARGET_URL