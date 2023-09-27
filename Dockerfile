
# Install dependencies only when needed
FROM node:16-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm ci


# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build


# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]