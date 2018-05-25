FROM node

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile

COPY . /app/
RUN yarn build

ENTRYPOINT [ "yarn", "start" ]