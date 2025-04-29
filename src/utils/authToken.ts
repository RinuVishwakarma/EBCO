import { STORAGECONSTANTS } from '@/utils/constants/storageConstants'
import { useRouter } from 'next/navigation'

export const getStoredAuthToken = () => {
  return localStorage.getItem(STORAGECONSTANTS.AUTH_TOKEN)
}

export const storeAuthToken = ({ token }: { token: string }) => {
  localStorage.setItem(STORAGECONSTANTS.AUTH_TOKEN, token)
}

export const removeAuthToken = () => {
  localStorage.removeItem(STORAGECONSTANTS.AUTH_TOKEN)
  localStorage.clear()
}

export function isLocalStorage() {
  try {
    window.localStorage.setItem('randomKey', 'RandomValue')
    window.localStorage.removeItem('randomKey')

    return true
  } catch (error) {
    return false
  }
}
