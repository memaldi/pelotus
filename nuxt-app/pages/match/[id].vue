<template>
  <div class="container mx-auto mt-6">
    <h2 class="text-xl font-bold">Match {{ match.id }}</h2>
    <div v-if="match">
      <p>{{ match.homeTeam.name }} vs {{ match.awayTeam.name }}</p>
      <form @submit.prevent="submitBet" class="mt-4">
        <div class="flex items-center space-x-4">
          <input v-model.number="homeGoals" type="number" min="0" class="w-16 p-2 border" />
          <span> - </span>
          <input v-model.number="awayGoals" type="number" min="0" class="w-16 p-2 border" />
        </div>
        <button class="mt-4 bg-green-500 text-white px-4 py-2">Place Bet</button>
      </form>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '~/composables/useUser'

const route = useRoute()
const match = ref<any>(null)
const homeGoals = ref<number>(0)
const awayGoals = ref<number>(0)

const user = useUser()

onMounted(async () => {
  const id = route.params.id
  const res = await $fetch(`/api/match/${id}`)
  match.value = res
})

async function submitBet() {
  if (!user.value) {
    alert('Please login first')
    return
  }
  try {
    await $fetch('/api/bets', {
      method: 'POST',
      body: {
        matchId: match.value.id,
        matchDayId: match.value.matchDayId,
        homeGoals: homeGoals.value,
        awayGoals: awayGoals.value
      }
    })
    alert('Bet placed')
  } catch (err) {
    alert('Failed to place bet')
  }
}
</script>