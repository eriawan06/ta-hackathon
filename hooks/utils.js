import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function useRedirectAfterLoad(destination, checkIfShouldRedirect) {
  const router = useRouter()

  const [isRouterReady, setIsRouterReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    router.isReady && setIsRouterReady(true)
  }, [router.isReady])

  useEffect(() => {
    if (!isRouterReady) return

    const shouldRedirect = checkIfShouldRedirect
      ? checkIfShouldRedirect(router)
      : true
    if (shouldRedirect) router.push(destination)

    setIsRedirecting(shouldRedirect)
    setIsLoading(false)
  }, [destination, checkIfShouldRedirect, isRouterReady, router])

  return { isLoading, isRedirecting }
}

export function useRedirectToAfterLoad(destination) {
  const router = useRouter()

  const [isRouterReady, setIsRouterReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    router.isReady && setIsRouterReady(true)
  }, [router.isReady])

  useEffect(() => {
    if (!isRouterReady) return

    const path = destination(router)
    const shouldRedirect = path && router.pathname !== path ? true : false
    if (shouldRedirect) router.push(path)

    setIsRedirecting(shouldRedirect)
    setIsLoading(false)
  }, [destination, isRouterReady, router])

  return { isLoading, isRedirecting }
}
