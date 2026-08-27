import type {
  ILoginPayload,
  ILoginResult,
} from '@/api/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isAxiosError } from 'axios'
import * as authApi from '@/api/auth'
import { setAccessToken } from '@/plugins/axios'

let restorePromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', () => {
  const initialized = ref(false)
  const user = ref<ILoginResult | null>(null)

  const loading = ref(false)

  const isLoggedIn = computed(() => {
    return user.value !== null
  })

  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })

  const login = async (payload: ILoginPayload) => {
    loading.value = true

    try {
      const response = await authApi.login(payload)

      user.value = response.result
      setAccessToken(response.result.accessToken)

      return response
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      user.value = null
      setAccessToken(null)
    }
  }

  const restoreSession = async () => {
    if (restorePromise) {
      return restorePromise
    }

    restorePromise = (async () => {
      try {
        const response = await authApi.refresh()

        user.value = response.result
        setAccessToken(response.result.accessToken)
      } catch (error) {
        const isExpectedUnauthenticated = isAxiosError(error)
          && error.response?.status === 401

        if (!isExpectedUnauthenticated) {
          console.error(error)
        }

        user.value = null
        setAccessToken(null)
      } finally {
        initialized.value = true
        restorePromise = null
      }
    })()

    return restorePromise
  }

  return {
    user,
    loading,
    initialized,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    restoreSession,
  }
})
