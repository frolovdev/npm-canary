
FROM node:12

COPY . ./app

WORKDIR /app

RUN yarn

RUN node ./tools/ci/integration-tests.js

RUN yarn

RUN yarn test-prod


