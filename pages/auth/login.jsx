import NextLink from 'next/link'

import { Box, Heading, Link, Text, VStack } from '@chakra-ui/react'

import LoginForm from 'components/organisms/Auth/LoginForm'

import AuthLayout from 'layouts/AuthLayout'
import Seo from 'components/atoms/Seo'

import { siteTitle } from 'config'

LoginPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default function LoginPage() {
  return (
    <>
      <Seo title={`Login | ${siteTitle}`} />

      <VStack
        spacing={3}
        alignItems='start'
        mb={8}
      >
        <Heading
          as='h1'
          fontSize='3xl'
        >
          Good to see you again!
        </Heading>
        <Heading
          as='h2'
          fontSize='2xl'
        >
          Login Here
        </Heading>
      </VStack>

      <Box mb={16}>
        <LoginForm />
      </Box>

      <Box>
        <Text as='p'>
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
      </Box>
    </>
  )
}
