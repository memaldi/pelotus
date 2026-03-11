<template>
  <div class="container mx-auto">
    <h2 class="text-2xl font-bold mt-6">Match Days</h2>
    <ul class="mt-4">
      <li v-for="day in days" :key="day.id">
        <NuxtLink :to="`/matchdays/${day.id}`">Match Day {{ day.id }} - {{ new Date(day.date).toLocaleDateString() }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const days = ref<any[]>([])

onMounted(async () => {
  const res = await $fetch('/api/matchdays?limit=20')
  days.value = res
})
</script>
