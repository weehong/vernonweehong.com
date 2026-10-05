# syntax=docker/dockerfile:1
# Next.js standalone build (requires `output: "standalone"` in next.config.ts).

FROM node:22-alpine AS base

# --- Install dependencies only when needed ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build the application ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined at build time and robots.txt, the sitemap
# and page metadata are prerendered, so they must be set here. Without
# NEXT_PUBLIC_APP_ENVIRONMENT=production the image ships as noindex.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_APP_ENVIRONMENT
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_APP_ENVIRONMENT=$NEXT_PUBLIC_APP_ENVIRONMENT
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production runner ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
