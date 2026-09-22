FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable && yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/sista/browser /usr/share/nginx/html

EXPOSE 80
