import { useEffect, useState } from 'react'

import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react'

import LoadingOverlay from 'components/molecules/LoadingOverlay'
import ForgotPasswordFormStep1 from 'components/organisms/Auth/ForgotPasswordForm/Step1'
import ForgotPasswordFormStep2 from 'components/organisms/Auth/ForgotPasswordForm/Step2'

import AuthLayout from 'layouts/AuthLayout'

import { siteTitle } from 'config'

ForgotPasswordPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { 'verification-code': verificationCode } = router.query

  const [isRouterReady, setIsRouterReady] = useState(false)

  useEffect(() => {
    if (router.isReady) setIsRouterReady(true)
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>Forgot Password | {siteTitle}</title>
      </Head>

      <VStack
        spacing={3}
        alignItems='start'
        mb={8}
      >
        <Heading
          as='h1'
          fontSize='3xl'
        >
          Forgot Password
        </Heading>

        <Heading
          as='h2'
          fontSize='2xl'
        >
          Use the form below to get back to your account.
        </Heading>
      </VStack>

      <Box mb={16}>
        {isRouterReady ? (
          verificationCode ? (
            <ForgotPasswordFormStep2 verificationCode={verificationCode} />
          ) : (
            <ForgotPasswordFormStep1 />
          )
        ) : (
          <LoadingOverlay />
        )}
      </Box>

      <Box>
        <Text
          as='p'
          mb={2}
        >
          Just remember your password?{' '}
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

        <Text as='p'>
          Did not have an account yet?{' '}
          <NextLink
            href='/auth/register'
            passHref
          >
            <Link
              fontWeight='bold'
              color='red'
            >
              REGISTER
            </Link>
          </NextLink>
        </Text>
      </Box>
    </>
  )
}
