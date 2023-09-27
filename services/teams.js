import {
  serviceGet,
  servicePost,
  servicePutWithSlug,
  servicePut,
  serviceDelete,
  serviceDeleteWithSlug
} from 'services/_config'

import { teamServiceURL as baseURL } from 'config'

export const ENDPOINT_TEAMS = baseURL
export const ENDPOINT_TEAMS_BY_EVENT = baseURL + '/events'
export const ENDPOINT_TEAMS_MEMBERS = baseURL + '/members'
export const ENDPOINT_TEAMS_INVITATIONS = baseURL + '/invitations/'
export const ENDPOINT_TEAMS_REQUEST = baseURL + '/requests/'

export const getListTeamByEvent = (eventID) => serviceGet(ENDPOINT_TEAMS_BY_EVENT + '/' + eventID)
export const postCreateTeam = servicePost(`${ENDPOINT_TEAMS}/`)
export const putEditTeam = servicePutWithSlug(`${ENDPOINT_TEAMS}`)

export const removeTeamMember = serviceDeleteWithSlug(`${ENDPOINT_TEAMS_MEMBERS}`)

export const postTeamRequest = servicePost(ENDPOINT_TEAMS_REQUEST)
export const processTeamRequest = (code) => servicePut(`${ENDPOINT_TEAMS_REQUEST}${code}/status`)


export const getListTeamInvitation = serviceGet(ENDPOINT_TEAMS_INVITATIONS)
export const postInvitation = servicePost(ENDPOINT_TEAMS_INVITATIONS)
export const processInvitation = (code) => servicePut(`${ENDPOINT_TEAMS_INVITATIONS}${code}/status`)