import useSWR from 'swr'

import { ENDPOINT_PROJECT_TEAM } from 'services/project'
import { fetcher } from 'services/general'

export function useProject(projectId) {
  const { data, error } = useSWR(
    projectId ? `${ENDPOINT_PROJECT_TEAM}/${projectId}` : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data
  }
}
