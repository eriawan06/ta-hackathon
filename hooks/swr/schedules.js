import useSWR from 'swr'

import { ENDPOINT_SCHEDULE } from 'services/schedules'
import { fetcher } from 'services/general'

export function useDetailSchedule(id) {
  const { data, error, mutate } = useSWR(
    id? `${ENDPOINT_SCHEDULE}/${id}`: null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}