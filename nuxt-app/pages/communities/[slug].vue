<template>
  <div class="container mx-auto mt-6">
    <h2 class="text-2xl font-bold">Community {{ comm.name }}</h2>
    <div v-if="comm.competitions && comm.competitions.length">
      <h3 class="mt-4">Competitions</h3>
      <ul>
        <li v-for="comp in comm.competitions" :key="comp.id">Season {{ comp.seasonId }}</li>
      </ul>
    </div>
    <button v-if="!joined" @click="join" class="mt-4 bg-blue-500 text-white px-4 py-2">Join</button>
    <p v-else class="mt-4 text-green-600">You have joined!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '~/composables/useUser'

const route = useRoute()
const comm = ref<any>({})
const joined = ref(false)

onMounted(async () => {
  const slug = route.params.slug
  comm.value = await $fetch(`/api/communities/${slug}`)
  // TODO: check if user is already member. Omitted for brevity
})

async function join() {
  if (!useUser().value) {
    alert('please login')
    return
  }
  const slug = route.params.slug
  await $fetch(`/api/communities/${slug}`, { method: 'POST' })
  joined.value = true
}
</script>