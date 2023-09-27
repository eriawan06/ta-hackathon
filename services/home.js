import { serviceGet } from 'services/_config'

import { homeServiceURL as baseURL } from 'config'

export const ENDPOINT_HOME = baseURL
export const getHomeData = serviceGet(ENDPOINT_HOME)