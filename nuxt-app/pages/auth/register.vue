<template>
  <div class="container mx-auto max-w-md mt-8">
    <h2 class="text-2xl font-bold">Register</h2>
    <form @submit.prevent="register" class="mt-4">
      <div class="mb-4">
        <label>Email</label>
        <input v-model="email" type="email" class="w-full p-2 border" required />
      </div>
      <div class="mb-4">
        <label>Password</label>
        <input v-model="password" type="password" class="w-full p-2 border" required />
      </div>
      <button class="bg-blue-500 text-white px-4 py-2" type="submit">Register</button>
    </form>
    <p class="mt-4">
      Already have an account? <NuxtLink to="/auth/login" class="text-blue-600">Login</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

async function register() {
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    alert('Registered! Please login.')
    router.push('/auth/login')
  } catch (err) {
    alert('Registration failed')
  }
}
</script>
