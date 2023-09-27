import { serviceGet, servicePost } from 'services/_config'

import { baseServiceURL as baseURL } from 'config'

export const ENDPOINT_OCCUPATIONS = baseURL + '/occupations/'
export const ENDPOINT_SPECIALITIES = baseURL + '/specialities/'
export const ENDPOINT_SKILLS = baseURL + '/skills/'

export const getOccupations = serviceGet(ENDPOINT_OCCUPATIONS)
export const createOccupation = servicePost(ENDPOINT_OCCUPATIONS)
export const getSpecialities = serviceGet(ENDPOINT_SPECIALITIES)
export const createSpeciality = servicePost(ENDPOINT_SPECIALITIES)
export const getSkills = serviceGet(ENDPOINT_SKILLS)

// {{baseUrlLocal}}/region/provinces?order=id,asc&limit=10&page=1&name=Jawa
