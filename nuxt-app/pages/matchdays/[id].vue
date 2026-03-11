<template>
  <div class="container mx-auto">
    <h2 class="text-2xl font-bold mt-6">Match Day {{ day.id }}</h2>
    <div v-if="day.matches && day.matches.length">
      <ul>
        <li v-for="match in day.matches" :key="match.id">
          {{ match.homeTeamId }} vs {{ match.awayTeamId }}
        </li>
      </ul>
    </div>
    <div v-else>
      No matches found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const day = ref<any>({})

onMounted(async () => {
  const id = route.params.id
  const res = await $fetch(`/api/matchdays/${id}`)
  day.value = res
})
</script>