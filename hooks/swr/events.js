import useSWR from 'swr'

import { ENDPOINT_EVENTS, ENDPOINT_EVENTS_LATEST_EVENT } from 'services/events'
import { fetcher } from 'services/general'

export function useLatestEvents() {
  const { data, error } = useSWR(ENDPOINT_EVENTS_LATEST_EVENT, fetcher)

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data
  }
}

export function useEventRules(eventID) {
  const { data, error, mutate } = useSWR(
    eventID? `${ENDPOINT_EVENTS}/${eventID}/rules`: null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}

export function useEventSchedules(eventID) {
  const { data, error, mutate } = useSWR(
    eventID? `${ENDPOINT_EVENTS}/${eventID}/schedules`: null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}