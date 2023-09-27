import { serviceGetWithoutAuth } from 'services/_config'

import { regionServiceURL as baseURL } from 'config'

export const ENDPOINT_PROVINCES = baseURL + '/provinces'
export const ENDPOINT_CITIES = baseURL + '/cities'
export const ENDPOINT_DISTRICTS = baseURL + '/districts'
export const ENDPOINT_VILLAGES = baseURL + '/villages'

export const getProvinces = serviceGetWithoutAuth(ENDPOINT_PROVINCES)
export const getCities = serviceGetWithoutAuth(ENDPOINT_CITIES)
export const getDistricts = serviceGetWithoutAuth(ENDPOINT_DISTRICTS)
export const getVillages = serviceGetWithoutAuth(ENDPOINT_VILLAGES)

// {{baseUrlLocal}}/region/provinces?order=id,asc&limit=10&page=1&name=Jawa
