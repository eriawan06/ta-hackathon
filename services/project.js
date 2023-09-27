import { ProjectsServiceURL as baseURL } from 'config'

import { servicePost, servicePutWithSlug } from './_config'

export const ENDPOINT_PROJECT_TEAM = baseURL

export const createProject = servicePost(`${baseURL}/`)
export const editProject = (projectId, payload) => servicePutWithSlug(baseURL)(projectId, payload)
