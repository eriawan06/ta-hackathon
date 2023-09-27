import { serviceGet } from 'services/_config'

import { referencesServiceURL as baseURL } from 'config'

export const ENDPOINT_REFERENCES_SPECIALITIES = baseURL + '/specialities/' // need trailling slash, othwerwise return 301 with CORS error
export const ENDPOINT_REFERENCES_TECHNOLOGIES = baseURL + '/technologies/'

export const getSpecialities = serviceGet(ENDPOINT_REFERENCES_SPECIALITIES)
export const getTechnologies = serviceGet(ENDPOINT_REFERENCES_TECHNOLOGIES)
