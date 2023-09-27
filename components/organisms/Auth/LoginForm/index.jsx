import { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Icon,
  IconButton,
  Input,
  InputRightElement,
  VStack,
  Link,
  InputGroup
} from '@chakra-ui/react'

import { BsEye, BsEyeSlash, BsGoogle } from 'react-icons/bs'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useFormToast } from 'hooks/form-toast'

import { postAuthLogin } from 'services/auth'

import { setToken } from 'libs/token'
import { setUser } from 'libs/local-storage/user'
import {
  getLatestEvent,
  getRegistrationTimeline
} from 'libs/local-storage/event'
import { getGoogleOauthUrl } from 'libs/oauth/google'

const initialValues = {
  email: '',
  password: ''
}

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password is at least 8 charachters!')
    .max(20, 'Password is maximum 20 characters!')
    .required('Required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Required')
})

export default function LoginForm() {
  const router = useRouter()
  const toast = useFormToast('login-form')

  const [showPassword, setShowPassword] = useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)

  const handleSubmit = async (values) => {
    toast.close()

    try {
      const res = await postAuthLogin(values)

      if (res && res?.status === 200) {
        toast.send('success', 'Login Successfull!')

        setToken(res?.data?.data?.token)
        const userData = res?.data?.data?.user
        setUser(userData)

        if (!userData?.is_registration_completed) {
          const latestEvent = await getLatestEvent()
          const registTimeline = await getRegistrationTimeline()
          const remainingTime =
            new Date(registTimeline?.end_date).getTime() - new Date().getTime()

          if (
            latestEvent?.event_info?.status === 'running' &&
            remainingTime > 0
          ) {
            setTimeout(() => router.push('/complete-registration'), 3000)
            return
          } else {
            setTimeout(() => router.push('/registration-closed'), 3000)
            return
          }
        }

        setTimeout(() => router.push('/dashboard'), 3000)
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response.status === 401) {
        title = 'Login Failed!'
        message = 'Please make sure your credentials is valid and try again...'

        switch (err.response.data.error[0]) {
          case 'user is not activated':
            message = 'Please check the activation email and try again...'
            break
        }
      }

      toast.send('error', title, message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <VStack
            spacing={6}
            mb={8}
          >
            <FormControl
              isRequired
              isInvalid={touched.email && errors.email}
            >
              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <Field
                as={Input}
                variant='white'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email here...'
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={touched.password && errors.password}
            >
              <FormLabel htmlFor='password'>Password</FormLabel>

              <InputGroup>
                <Field
                  as={Input}
                  variant='white'
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password here...'
                />
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    color='black'
                    icon={showPassword ? <BsEyeSlash /> : <BsEye />}
                    aria-label={
                      showPassword ? 'Hide Password' : 'Show Password'
                    }
                    onClick={handleToggleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>

              <FormHelperText textAlign='right'>
                <NextLink
                  href='/auth/forgot-password'
                  passHref
                >
                  <Link>Forgot Password?</Link>
                </NextLink>
              </FormHelperText>
            </FormControl>
          </VStack>

          <VStack
            spacing={3}
            w='full'
          >
            <Button
              type='submit'
              colorScheme='red'
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              w='full'
            >
              Login
            </Button>

            <Divider />

            <NextLink
              href={getGoogleOauthUrl()}
              rel='noreferrer noopener'
              passHref
            >
              <Button
                type='submit'
                colorScheme='gray'
                leftIcon={<Icon as={BsGoogle} />}
                w='full'
              >
                Login with Google
              </Button>
            </NextLink>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
