import { useEffect, useState } from 'react'

import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Heading,
  Link,
  Progress,
  Text,
  VStack
} from '@chakra-ui/react'

import LoadingOverlay from 'components/molecules/LoadingOverlay'
import VerifyEmailForm from 'components/organisms/Auth/VerifyEmailForm'

import AuthLayout from 'layouts/AuthLayout'

import { postAuthVerifyEmail } from 'services/auth'

import { siteTitle } from 'config'

VerifyEmailPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const { 'verification-code': verificationCode } = router.query

  const [isRouterReady, setIsRouterReady] = useState(false)
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(null)

  useEffect(() => {
    if (router.isReady) setIsRouterReady(true)
  }, [router.isReady])

  useEffect(() => {
    const verifyEmail = async (verificationCode) => {
      try {
        const res = await postAuthVerifyEmail({
          verification_code: verificationCode
        })

        if (res && res.status === 200) {
          setIsVerificationSuccess(true)

          setTimeout(() => router.push('/auth/login'), 5000)
        }
      } catch (err) {
        setIsVerificationSuccess(false)
      }
    }

    if (isRouterReady && verificationCode) verifyEmail(verificationCode)
  }, [isRouterReady, verificationCode, router])

  return (
    <>
      <Head>
        <title>Verify Email | {siteTitle}</title>
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
          Verify Email
        </Heading>
      </VStack>

      <Box mb={16}>
        {!isRouterReady && <LoadingOverlay />}

        {isRouterReady && !verificationCode && (
          <>
            <Text
              as='p'
              mb={4}
            >
              It seems you didn't come to this page from a verification email.
              If you don't have one, you can generate a new one by using form
              below:
            </Text>

            <VerifyEmailForm />
          </>
        )}

        {verificationCode && isVerificationSuccess === null && (
          <>
            <Text
              as='p'
              mb={2}
            >
              Verifying your email, please wait...
            </Text>
            <Progress
              size='xs'
              isIndeterminate
            />
          </>
        )}

        {verificationCode && isVerificationSuccess && (
          <Text as='p'>
            Your email is succesfully verified, redirecting you to login page in
            5 seconds...
          </Text>
        )}

        {verificationCode && isVerificationSuccess === false && (
          <Box>
            <Text
              as='p'
              mb={2}
            >
              Email verification failed, you can generate new verification email
              by clicking button below:
            </Text>

            <NextLink
              href='/auth/verify-email'
              passHref
            >
              <Button
                as='a'
                variant='solid'
                colorScheme='red'
                mx='auto'
              >
                Resend Verification Email
              </Button>
            </NextLink>
          </Box>
        )}
      </Box>

      <Box>
        <Text
          as='p'
          mb={2}
        >
          New to {siteTitle}?{' '}
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

        <Text as='p'>
          Already have an account?{' '}
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
