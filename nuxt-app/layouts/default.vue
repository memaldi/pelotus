<template>
  <div>
    <nav class="bg-gray-800 p-4 text-white">
      <div class="container mx-auto flex justify-between items-center">
        <div class="font-bold">Pelotus</div>
        <div class="space-x-4">
          <NuxtLink to="/">Home</NuxtLink>
          <template v-if="user">
            <span>Hi, {{ user.email }}</span>
            <button @click="logout" class="text-red-400">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login">Login</NuxtLink>
            <NuxtLink to="/auth/register">Register</NuxtLink>
          </template>
        </div>
      </div>
    </nav>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUser } from '~/composables/useUser'

const user = useUser()
const router = useRouter()

function logout() {
  localStorage.removeItem('token')
  if (user) user.value = null
  router.push('/')
}
</script>
