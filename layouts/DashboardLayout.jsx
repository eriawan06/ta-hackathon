import Head from 'next/head'

import { useEffect, useState } from 'react'
import { Box, Container } from '@chakra-ui/react'

import Navbar from 'components/molecules/Navbar'
import LoadingOverlay from 'components/molecules/LoadingOverlay'
import Footer from 'components/organisms/Footer'

import { useRedirectToAfterLoad } from 'hooks/utils'
import { getToken, setToken } from 'libs/token'

import { siteTitle } from 'config'
import { getUser, setUser } from 'libs/local-storage/user'
import {
  getLatestEvent,
  getRegistrationTimeline
} from 'libs/local-storage/event'
import { useRouter } from 'node_modules/next/router'

const defaultNavbarButtons = [
  {
    text: 'Logout',
    href: '/auth/logout'
  }
]

export default function DashboardLayout({ children, navbarButtons = [] }) {
  const router = useRouter()
  const [latestEvent, setLatestEvent] = useState({})
  const [registTimeline, setRegistTimeline] = useState({})

  useEffect(() => {
    const cookies = children.props.cookies
    if (
      cookies &&
      cookies.is_authenticated &&
      cookies.is_authenticated === 'true'
    ) {
      console.log('COOKIES : ', cookies)
      setToken(cookies.access_token)
      setUser(JSON.parse(cookies.user))
    }
  }, [children.props.cookies])

  useEffect(() => {
    getLatestEvent().then((data) => {
      setLatestEvent(data)
    })
    getRegistrationTimeline().then((data) => {
      setRegistTimeline(data)
    })
  }, [])

  const { isLoading, isRedirecting } = useRedirectToAfterLoad(() => {
    const token = getToken()
    if (!token) return '/auth/login'

    const userData = getUser()
    let isRegistrationCompleted = false

    if (
      userData.is_registration_completed !== null &&
      userData.is_registration_completed !== undefined
    ) {
      isRegistrationCompleted = userData.is_registration_completed
    }

    if (
      userData.is_registered !== null &&
      userData.is_registered !== undefined
    ) {
      isRegistrationCompleted = userData.is_registered
    }

    if (!isRegistrationCompleted) {
      const remainingTime =
        new Date(registTimeline.end_date).getTime() - new Date().getTime()

      if (latestEvent.event_info?.status === 'running' && remainingTime > 0) {
        return '/complete-registration'
      } else {
        return '/registration-closed'
      }
    }

    if (
      isRegistrationCompleted &&
      userData.payment_status !== 'paid' &&
      !router.pathname.includes('/dashboard/setting')
    ) {
      return '/dashboard/payment'
    }

    if (router.pathname === '/dashboard') return '/dashboard/payment'
    return ''
  })

  // only render after router ready since nested route is dependent on router
  return !isLoading && !isRedirecting ? (
    <Box
      id='dashboard-pages'
      display='flex'
      flexFlow='column'
      flexWrap='nowrap'
      justifyContent='space-between'
      minH='100vh'
      pt={16}
    >
      <Navbar
        logoHref='/dashboard'
        buttons={[...defaultNavbarButtons, ...navbarButtons]}
      />

      <Container
        id='dashboard-content'
        flexGrow={1}
      >
        {children}
      </Container>

      <Footer />
    </Box>
  ) : (
    <>
      <Head>
        <title>Loading Dashboard | {siteTitle}</title>
      </Head>

      <LoadingOverlay isFullScreen />
    </>
  )
}
