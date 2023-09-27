import useSWR from 'swr'

import { fetcher } from 'services/general'
import { ENDPOINT_TEAMS, ENDPOINT_TEAMS_INVITATIONS, ENDPOINT_TEAMS_REQUEST } from 'services/teams'

export function useDetailTeam(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS}/${id}/detail` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useMyTeam() {
  const { data, error, mutate } = useSWR(`${ENDPOINT_TEAMS}/my-team`, fetcher)

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useMyMember(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS}/${id}/members` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useMyRequest(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS}/${id}/requests` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useMyInvitation(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS}/${id}/invitations` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useInvitationDetail(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS_INVITATIONS}${id}` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useTeamInvitationDetail(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS_INVITATIONS}${id}/detail` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}
export function useTeamRequestDetail(id) {
  const { data, error, mutate } = useSWR(
    id ? `${ENDPOINT_TEAMS_REQUEST}${id}/detail` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}
