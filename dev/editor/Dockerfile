FROM node:24-alpine3.22

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . .

EXPOSE 5174 3001

CMD ["yarn", "dev"]
