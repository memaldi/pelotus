<template>
  <div class="container mx-auto max-w-4xl mt-8">
    <h2 class="text-2xl font-bold mb-4">Rankings</h2>
    <div class="mb-8">
      <h3 class="text-xl">Match Day Rankings</h3>
      <div v-if="matchDayRankings" class="mt-4">
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2">Competition</th>
              <th class="p-2">User</th>
              <th class="p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[compId, users] in Object.entries(matchDayRankings)" :key="compId">
              <td colspan="3" class="bg-gray-50 p-2 font-semibold">Competition {{ compId }}</td>
            </tr>
            <tr v-for="[userId, points] in Object.entries(users)" :key="userId">
              <td></td>
              <td class="p-2">{{ userId }}</td>
              <td class="p-2">{{ points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <h3 class="text-xl">Global Rankings</h3>
      <div v-if="globalRankings" class="mt-4">
        <table class="w-full border">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2">Competition</th>
              <th class="p-2">User</th>
              <th class="p-2">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[compId, users] in Object.entries(globalRankings)" :key="compId">
              <td colspan="3" class="bg-gray-50 p-2 font-semibold">Competition {{ compId }}</td>
            </tr>
            <tr v-for="[userId, points] in Object.entries(users)" :key="userId">
              <td></td>
              <td class="p-2">{{ userId }}</td>
              <td class="p-2">{{ points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const matchDayRankings = ref(null)
const globalRankings = ref(null)

onMounted(async () => {
  // Load rankings for the latest match day and global results
  const days = await $fetch('/api/matchdays')
  if (days.length > 0) {
    matchDayRankings.value = await $fetch(`/api/rankings/matchday/${days[0].id}`)
  }
  // For global rankings, we'd need to know the global results ID
  // This is a placeholder - in a real app, you'd fetch the latest global results
})
</script>