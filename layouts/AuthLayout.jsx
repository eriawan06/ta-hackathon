import { Box, Container, Grid, GridItem, Image, Center } from '@chakra-ui/react'

import Seo from 'components/atoms/Seo'
import Navbar from 'components/molecules/Navbar'
import LoadingOverlay from 'components/molecules/LoadingOverlay'

import { useRedirectAfterLoad } from 'hooks/utils'
import { getToken } from 'libs/token'

import { siteTitle } from 'config'

const navbarLinks = [
  {
    text: 'Event',
    href: '/#event'
  },
  {
    text: 'Activity',
    href: '/#activity'
  },
  {
    text: 'Partner',
    href: '/#partner'
  }
]

export default function AuthLayout({ children }) {
  const { isLoading, isRedirecting } = useRedirectAfterLoad(
    '/dashboard',
    (router) => {
      // do not auto redirect to dashboard for
      // - logout
      // - reset password with verification code
      if (
        router.pathname === '/auth/logout' ||
        (router.pathname === '/auth/forgot-password' &&
          router.query['verification-code'])
      )
        return false

      return !!getToken()
    }
  )

  return !isLoading && !isRedirecting ? (
    <Box
      id='auth-pages'
      h='100vh'
    >
      <Navbar links={navbarLinks} />

      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        alignItems='stretch'
        h='100%'
      >
        <GridItem>
          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(1, 1fr)' }}
            h='100%'
          >
            <GridItem>
              <Center
                position='fixed'
                w='50%'
                h='100%'
                bg='gray'
              >
                <Image
                  src='/images/landing/about-illustration.png'
                  fallbackSrc='/images/banner-fallback.png'
                  alt={siteTitle}
                  w='full'
                  maxW='40ch'
                />
              </Center>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem>
          <Container
            w='full'
            h='100%'
          >
            <Box>{children}</Box>
          </Container>
        </GridItem>
      </Grid>
    </Box>
  ) : (
    <>
      <Seo pageTitle={`Loading Authentication | ${siteTitle}`} />

      <LoadingOverlay isFullScreen />
    </>
  )
}
