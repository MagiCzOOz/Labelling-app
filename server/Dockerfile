# syntax=docker/dockerfile:1

FROM node:16.17.0-bullseye-slim as base

# install dumb init allowing node to not run on PID 1
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y --no-install-recommends dumb-init
# create a work root directory
WORKDIR /home/node/app
# copy dep files into the working directory
COPY ["package.json", "package-lock.json*", "."]
# install ffmpeg
RUN apt-get install ffmpeg -y
# create directory for chaching thumbnail
RUN mkdir -p /data/.cache && chown node: /data/.cache
# copy the source code into the image
COPY --chown=node:node . .
# map port 4000
EXPOSE 4000


FROM base as dev

# install the app dependencies
RUN npm ci
# set user as node
USER node
# command run
CMD ["dumb-init", "npm", "run", "dev"]


FROM base as production

# set node env to production
ENV NODE_ENV=production
# install dependencies
RUN npm ci --production
# create directory for logs
RUN mkdir -p ./logs && chown node: ./logs
# set user as node
USER node
# command run
CMD ["dumb-init", "npm", "run", "start"]
