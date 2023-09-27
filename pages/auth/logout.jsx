import { useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'

import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react'

import AuthLayout from 'layouts/AuthLayout'

import { clearToken } from 'libs/token'

import { siteTitle } from 'config'

LogoutPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default function LogoutPage() {
  useEffect(() => {
    clearToken()
  }, [])

  return (
    <>
      <Head>
        <title>Logout | {siteTitle}</title>
      </Head>

      <VStack
        spacing={3}
        alignItems='start'
        mb='50vh'
      >
        <Heading
          as='h1'
          fontSize='3xl'
        >
          See you later!
        </Heading>

        <Heading
          as='h2'
          fontSize='xl'
        >
          You have been logged out.
        </Heading>
      </VStack>

      <Box>
        <Text as='p'>
          Ready to get back?{' '}
          <NextLink
            href='/auth/login'
            passHref
          >
            <Link
              fontWeight='bold'
              color='red'
            >
              LOGIN
            </Link>
          </NextLink>
        </Text>
      </Box>
    </>
  )
}
