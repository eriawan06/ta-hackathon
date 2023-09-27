import {
  serviceGet,
  serviceGetWithSlug,
  servicePost,
  servicePostWithSlug,
  servicePut,
  servicePutWithSlug,
  serviceDeleteWithSlug
} from 'services/_config'

import { usersServiceURL as baseURL } from 'config'

export const ENDPOINT_USERS = baseURL
export const ENDPOINT_USERS_CHANGE_PASSWORD =
  baseURL + '/change-password'
export const ENDPOINT_USERS_PARTICIPANTS =
  baseURL + '/participants/'
export const ENDPOINT_USERS_PROFILE = baseURL + '/profile'
export const ENDPOINT_USERS_PARTICIPANTS_PROFILE =
  baseURL + '/participants/profile'
  export const ENDPOINT_USERS_PARTICIPANTS_EDUCATION =
    baseURL + '/participants/education'
  export const ENDPOINT_USERS_PARTICIPANTS_PREFERENCE =
    baseURL + '/participants/preference'
export const ENDPOINT_USERS_PARTICIPANTS_ACCOUNT =
  baseURL + '/participants/account'
export const ENDPOINT_USERS_JUDGES = baseURL + '/judges'
export const ENDPOINT_USERS_MENTORS = baseURL + '/mentors'
export const ENDPOINT_PARTICIPANTS_SEARCH =
  baseURL + '/participants/search'

export const postUser = servicePost(ENDPOINT_USERS)
export const putChangePassword = servicePut(
  ENDPOINT_USERS_CHANGE_PASSWORD
)

export const getUserProfile = serviceGet(ENDPOINT_USERS_PROFILE)
export const putUserProfile = servicePut(ENDPOINT_USERS_PROFILE)

// Participants
export const putParticipant = servicePut(
  ENDPOINT_USERS_PARTICIPANTS
)
export const getParticipantProfile = serviceGet(
  ENDPOINT_USERS_PARTICIPANTS_PROFILE
)
export const putParticipantProfile = servicePut(
  ENDPOINT_USERS_PARTICIPANTS_PROFILE
)
export const putParticipantEducation = servicePut(
  ENDPOINT_USERS_PARTICIPANTS_EDUCATION
)
export const putParticipantPreference = servicePut(
  ENDPOINT_USERS_PARTICIPANTS_PREFERENCE
)
export const putParticipantAccount = servicePut(
  ENDPOINT_USERS_PARTICIPANTS_ACCOUNT
)

export const getParticipantSearch = (url) => servicePost(
  `${ENDPOINT_PARTICIPANTS_SEARCH}?${url}`
)

// Judges
export const getJudgeList = serviceGet(ENDPOINT_USERS_JUDGES)
export const getJudge = serviceGetWithSlug(ENDPOINT_USERS_JUDGES)
export const postJudge = servicePostWithSlug(ENDPOINT_USERS_JUDGES)
export const putJudge = servicePutWithSlug(ENDPOINT_USERS_JUDGES)
export const deleteJudge = serviceDeleteWithSlug(ENDPOINT_USERS_JUDGES)

// Mentors
export const getMentorList = serviceGet(ENDPOINT_USERS_MENTORS)
export const getMentor = serviceGetWithSlug(ENDPOINT_USERS_MENTORS)
export const postMentor = servicePostWithSlug(ENDPOINT_USERS_MENTORS)
export const putMentor = servicePutWithSlug(ENDPOINT_USERS_MENTORS)
export const deleteMentor = serviceDeleteWithSlug(ENDPOINT_USERS_MENTORS)
