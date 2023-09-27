import {
  serviceGet,
  serviceGetWithSlug,
  servicePost,
  servicePutWithSlug,
  serviceDeleteWithSlug
} from 'services/_config'

import { eventsServiceURL as baseURL } from 'config'

export const ENDPOINT_EVENTS = baseURL
export const ENDPOINT_EVENTS_LATEST_EVENT = baseURL + '/latest'

export const getEventList = serviceGet(ENDPOINT_EVENTS)
export const getLatestEvents = serviceGet(ENDPOINT_EVENTS_LATEST_EVENT)
export const getEvent = serviceGetWithSlug(ENDPOINT_EVENTS)
export const postEvent = servicePost(ENDPOINT_EVENTS)
export const putEvent = servicePutWithSlug(ENDPOINT_EVENTS)
export const deleteEvent = serviceDeleteWithSlug(ENDPOINT_EVENTS)
