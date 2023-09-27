import axios from 'axios'

import { getToken } from 'libs/token'

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message =
        'Unable to connect to server, please try again in a while.'
    }

    if (!error.response) {
      error.message =
        'Unable to get desired response from server, please try again in a while.'
    }

    return Promise.reject(error)
  }
)

// POST
export const servicePost = (api) => (data) => {
  return axios.post(api, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

export const servicePostWithSlug = (api) => (slug, data) => {
  return axios.post(`${api}/${slug}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

export const servicePostWithoutAuth = (api) => (data) => {
  return axios.post(api, data)
}

// GET
export const serviceGet = (api) => (params) => {
  return axios.get(api, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params
  })
}

export const serviceGetWithSlug = (api) => (slug, params) => {
  return axios.get(`${api}/${slug}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params
  })
}

export const serviceGetWithoutAuth = (api) => (params) => {
  return axios.get(api, { params })
}

// PUT
export const servicePut = (api) => (data) => {
  return axios.put(api, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

export const servicePutWithSlug = (api) => (slug, data) => {
  return axios.put(`${api}/${slug}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
}

// DELETE
export const serviceDelete = (api) => (data) => {
  return axios.delete(api, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
}

export const serviceDeleteWithSlug = (api) => (slug, data) => {
  if (data) {
    return axios.delete(`${api}/${slug}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
  }
  return axios.delete(`${api}/${slug}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
}
