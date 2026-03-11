import { ref } from 'vue'

const user = ref<any>(null)

export function useUser() {
  if (process.client && !user.value) {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // basic JWT decode without external lib
        const payload = JSON.parse(atob(token.split('.')[1]))
        user.value = payload
      } catch (_) {}
    }
  }
  return user
}
