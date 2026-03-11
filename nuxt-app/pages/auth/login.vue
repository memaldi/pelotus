<template>
  <div class="container mx-auto max-w-md mt-8">
    <h2 class="text-2xl font-bold">Login</h2>
    <form @submit.prevent="login" class="mt-4">
      <div class="mb-4">
        <label>Email</label>
        <input v-model="email" type="email" class="w-full p-2 border" required />
      </div>
      <div class="mb-4">
        <label>Password</label>
        <input v-model="password" type="password" class="w-full p-2 border" required />
      </div>
      <button class="bg-blue-500 text-white px-4 py-2" type="submit">Login</button>
    </form>
    <p class="mt-4">
      Don't have an account? <NuxtLink to="/auth/register" class="text-blue-600">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

async function login() {
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    }) as any
    localStorage.setItem('token', res.token)
    router.push('/')
  } catch (err) {
    alert('Login failed')
  }
}
</script>
