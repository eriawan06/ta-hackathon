import {
    serviceGet,
} from 'services/_config'

import { scheduleServiceURL as baseURL } from 'config'

export const ENDPOINT_SCHEDULE = baseURL

export const getSchedule = serviceGet(ENDPOINT_SCHEDULE)