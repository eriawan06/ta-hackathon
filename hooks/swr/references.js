import useSWR from 'swr'

import { ENDPOINT_REFERENCES_SPECIALITIES } from 'services/references'
import { fetcher } from 'services/general'

export function useSpecialities() {
  const { data, error } = useSWR(ENDPOINT_REFERENCES_SPECIALITIES, fetcher)

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data
  }
}
