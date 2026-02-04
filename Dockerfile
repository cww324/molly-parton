FROM node:20-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Keep container file ownership aligned with non-root runtime usage.
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]
