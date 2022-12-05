# syntax=docker/dockerfile:1

FROM node:16.17.0-bullseye-slim as base

# install dumb init allowing node to not run on PID 1
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y --no-install-recommends dumb-init
# create a work root directory
WORKDIR /home/node/app
# copy dep files into the working directory
COPY ["package.json", "package-lock.json*", "."]
# copy the source code into the image
COPY --chown=node:node . .

FROM base as dev

# install the app dependencies
RUN npm ci
# set user as node
USER node
# command run when our image is run inside of a container
CMD ["dumb-init", "npm", "run", "start"]


FROM base as production

# install the app dependencies
RUN npm ci --production
# set user as node
USER node
# command run when our image is run inside of a container
CMD ["dumb-init", "npm", "run", "build"]
