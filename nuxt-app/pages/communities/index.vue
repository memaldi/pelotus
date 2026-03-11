<template>
  <div class="container mx-auto mt-6">
    <h2 class="text-2xl font-bold">Communities</h2>
    <ul class="mt-4">
      <li v-for="comm in comms" :key="comm.id">
        <NuxtLink :to="`/communities/${comm.slug}`">{{ comm.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const comms = ref<any[]>([])

onMounted(async () => {
  comms.value = await $fetch('/api/communities')
})
</script>