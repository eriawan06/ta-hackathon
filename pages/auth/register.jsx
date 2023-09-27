import Head from 'next/head'
import NextLink from 'next/link'

import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react'

import RegisterForm from 'components/organisms/Auth/RegisterForm'

import AuthLayout from 'layouts/AuthLayout'

import { siteTitle } from 'config'

RegisterPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}
export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | {siteTitle}</title>
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
          Hello!
        </Heading>
        <Heading
          as='h2'
          fontSize='2xl'
        >
          Register to Get Started
        </Heading>
      </VStack>

      <Box mb={16}>
        <RegisterForm />
      </Box>

      <Box>
        <Text
          as='p'
          mb={2}
        >
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

        <Text as='p'>
          Already registered but didn't receive the verification email?{' '}
          <NextLink
            href='/auth/verify-email'
            passHref
          >
            <Link
              fontWeight='bold'
              color='red'
            >
              RESEND VERIFICATION EMAIL
            </Link>
          </NextLink>
        </Text>
      </Box>
    </>
  )
}
