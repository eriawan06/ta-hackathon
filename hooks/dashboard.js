import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { isEqual } from 'lodash'

export function useDashboardSubRoutes(
  routes,
  redirectRoot,
  redirectOnNotFound = true
) {
  const router = useRouter()
  const { slug } = router.query

  const [route, setRoute] = useState(null)
  const [isRouterReady, setIsRouterReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [subRoute, setSubRoute] = useState(null)

  useEffect(() => {
    router.isReady && setIsRouterReady(true)
  }, [router.isReady])

  useEffect(() => {
    setRoute(router.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // ignore warning: only need to run once upon component mount

  useEffect(() => {
    if (!isRouterReady) return

    // if the pathname is different than when hooks mounted, do nothing
    if (router.pathname !== route) return

    if (!slug && redirectRoot) {
      router.push(redirectRoot)
      return
    }

    const currentRoute = routes.find((r) => isEqual(r.slug, slug))

    if (!currentRoute) {
      router.push('/404')
      return
    }

    setIsLoading(false)
    setSubRoute(currentRoute)
  }, [
    router,
    routes,
    redirectRoot,
    redirectOnNotFound,
    slug,
    route,
    isRouterReady
  ])

  return { subRoute, isLoading }
}
