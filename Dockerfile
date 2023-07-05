FROM node:18.12-alpine as build
ENV NODE_ENV production
WORKDIR /app
# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
# Copy app files
COPY . .

ENV NODE_OPTIONS=--max-old-space-size=4096

# Build the app
RUN yarn build

FROM nginx:alpine as product
COPY --from=build /app/build/. /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN mkdir /usr/share/nginx/html/.well-known
RUN mkdir /usr/share/nginx/html/.well-known/acme-challenge

EXPOSE 80