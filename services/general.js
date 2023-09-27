import axios from 'axios'

import { getToken } from 'libs/token'

import { uploadServiceURL } from 'config'

// Fetcher, mainly for SWR
export const fetcher = (endpoint, params) => {
  return axios.get(endpoint, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params
  })
}

export const fetcherWithoutToken = (endpoint, params) => {
  return axios.get(endpoint, { params })
}

// Upload
export const postUpload = (data) => {
  return axios.post(uploadServiceURL, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}
