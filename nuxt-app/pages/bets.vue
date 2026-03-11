<template>
  <div class="container mx-auto max-w-4xl mt-8">
    <h2 class="text-2xl font-bold mb-4">Match Day Bets</h2>
    <div v-if="matchDay" class="mb-8">
      <h3 class="text-xl">{{ matchDay.date.toLocaleDateString() }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div v-for="match in matchDay.matches" :key="match.id" class="border p-4">
          <p>{{ match.homeTeam.name }} vs {{ match.awayTeam.name }}</p>
          <form @submit.prevent="placeBet(match.id)" class="mt-2">
            <input v-model="bets[match.id].homeGoals" type="number" placeholder="Home goals" class="w-20 p-1 border" />
            <input v-model="bets[match.id].awayGoals" type="number" placeholder="Away goals" class="w-20 p-1 border ml-2" />
            <button class="bg-green-500 text-white px-3 py-1 ml-2" type="submit">Bet</button>
          </form>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-bold mb-4">Goals Bet</h2>
    <form @submit.prevent="placeGoalsBet" class="border p-4">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label>Forward</label>
          <select v-model="goalsBet.forwardId" class="w-full p-2 border">
            <option value="">Select player</option>
            <option v-for="player in players" :key="player.id" :value="player.id">{{ player.name }}</option>
          </select>
        </div>
        <div>
          <label>Midfield</label>
          <select v-model="goalsBet.midfieldId" class="w-full p-2 border">
            <option value="">Select player</option>
            <option v-for="player in players" :key="player.id" :value="player.id">{{ player.name }}</option>
          </select>
        </div>
        <div>
          <label>Defense</label>
          <select v-model="goalsBet.defenseId" class="w-full p-2 border">
            <option value="">Select player</option>
            <option v-for="player in players" :key="player.id" :value="player.id">{{ player.name }}</option>
          </select>
        </div>
      </div>
      <button class="bg-blue-500 text-white px-4 py-2 mt-4" type="submit">Place Goals Bet</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const matchDay = ref(null)
const players = ref([])
const bets = ref({})
const goalsBet = ref({ forwardId: '', midfieldId: '', defenseId: '' })

onMounted(async () => {
  // Load current match day
  const days = await $fetch('/api/matchdays')
  if (days.length > 0) {
    matchDay.value = await $fetch(`/api/matchdays/${days[0].id}`)
  }
  // Load players
  players.value = await $fetch('/api/players')
})

async function placeBet(matchId: number) {
  try {
    await $fetch('/api/bets', {
      method: 'POST',
      body: {
        matchId,
        matchDayId: matchDay.value.id,
        homeGoals: bets.value[matchId].homeGoals,
        awayGoals: bets.value[matchId].awayGoals
      }
    })
    alert('Bet placed!')
  } catch (err) {
    alert('Failed to place bet')
  }
}

async function placeGoalsBet() {
  try {
    await $fetch('/api/goals-bets', {
      method: 'POST',
      body: {
        matchDayId: matchDay.value.id,
        forwardId: goalsBet.value.forwardId,
        midfieldId: goalsBet.value.midfieldId,
        defenseId: goalsBet.value.defenseId
      }
    })
    alert('Goals bet placed!')
  } catch (err) {
    alert('Failed to place goals bet')
  }
}
</script>