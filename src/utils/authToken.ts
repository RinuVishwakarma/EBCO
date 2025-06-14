import {STORAGECONSTANTS} from '@/utils/constants/storageConstants'

export const getStoredAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGECONSTANTS.AUTH_TOKEN)
  }
  return null
}

export const storeAuthToken = ({ token }: { token: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGECONSTANTS.AUTH_TOKEN, token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGECONSTANTS.AUTH_TOKEN)
    localStorage.clear()
  }
}

export function isLocalStorage() {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.localStorage.setItem('randomKey', 'RandomValue')
    window.localStorage.removeItem('randomKey')

    return true
  } catch (error) {
    return false
  }
}
