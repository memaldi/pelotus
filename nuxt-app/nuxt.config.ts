import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  target: 'server',
  components: true,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/tailwind.css'],
  nitro: {
    externals: {
      inline: [],
      external: ['@prisma/client', 'jsonwebtoken', 'bcryptjs', 'ioredis']
    },
    rollupConfig: {
      external: ['@prisma/client', 'jsonwebtoken', 'bcryptjs', 'ioredis', 'crypto', 'stream', 'util', 'path']
    }
  },
  build: {
    rollupOptions: {
      external: ['crypto', 'stream', 'util', 'path', '@prisma/client', 'jsonwebtoken', 'bcryptjs', 'ioredis']
    }
  },
  vite: {
    ssr: {
      external: ['crypto', 'stream', 'util', 'path', '@prisma/client', 'jsonwebtoken', 'bcryptjs', 'ioredis']
    }
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBase: '/api'
    },
    databaseUrl: process.env.DATABASE_URL || 'postgresql://pelotus:pelotus@postgres:5432/pelotus',
    redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
    jwtSecret: process.env.JWT_SECRET || 'supersecret'
  }
})