from node:lts-slim as base
env PNPM_HOME "/pnpm"
env PATH "$PNPM_HOME:$PATH"
run corepack enable
copy . /app
workdir /app


from base as deps
run --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


from base as build
run --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
env SKIP_ENV_VALIDATION 1
run pnpm build


from base
copy --from=deps /app/node_modules ./node_modules
copy --from=build /app/dist ./dist

env NODE_ENV production
env NEXT_TELEMETRY_DISABLED 1

copy --from=builder /app/next.config.js ./
copy --from=builder /app/public ./public
copy --from=builder /app/package.json ./package.json

copy --from=builder /app/.next/standalone ./
copy --from=builder /app/.next/static ./.next/static

expose 3000
env PORT 3000

env MINIO_PORT 9000
env MINIO_PUBLIC_BUCKET media

CMD ["server.js"]
