import { tokenStorageKey } from 'config'

export function setToken(token) {
  localStorage.setItem(tokenStorageKey, token)
}

export function getToken() {
  return localStorage.getItem(tokenStorageKey)
}

export function clearToken() {
  return localStorage.removeItem(tokenStorageKey)
}
