# Building layer
FROM node:16-alpine as development

ENV NODE_ENV=production

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm ci

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

# Runtime (production) layer
FROM node:16-alpine as production

WORKDIR /app

ARG mongodb_uri
ARG acma_base_url
ARG port
ARG mongodb_name

##Database envs
ENV NODE_ENV=production
ENV MONGODB_URI=$mongodb_uri
ENV MONGODB_NAME=$mongodb_name

#Security Envs
ENV PORT=$port
ENV ACMA_BASE_URL=$acma_base_url


# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN npm ci --omit=dev

# Copy production build
COPY --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 80

# Start application
CMD [ "node", "dist/main.js" ]
