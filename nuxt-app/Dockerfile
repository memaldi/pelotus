# Node image for building the Nuxt application
# Node 18 lacks some newer util exports required by dependencies like @clack/core
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
# copy build output
COPY --from=builder /app/.output .output
# bring over generated Prisma client files from build stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
# install production dependencies so runtime packages (jsonwebtoken, bcryptjs, etc.) are available
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm install --production
# copy worker script and server utils
COPY --from=builder /app/worker.ts ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.worker.json ./
COPY --from=builder /app/tsconfig.json ./
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]