
FROM node:12

COPY . ./app

WORKDIR /app

RUN ls packages/packageone

RUN yarn

RUN node ./tools/ci/integration-tests.js

RUN yarn

RUN yarn test-prod


