export function useApi() {
  const token = process.client ? localStorage.getItem('token') : ''
  const config: UseFetchOptions<any> = {}
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` }
  }
  return { $fetch: $fetch, config }
}
