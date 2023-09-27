import useSWR from 'swr'

import { ENDPOINT_HOME } from 'services/home'
import { fetcher } from 'services/general'

export function useHomeData() {
  const { data, error } = useSWR(ENDPOINT_HOME, fetcher)

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data
  }
}
