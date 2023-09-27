import { useState } from 'react'
import NextLink from 'next/link'

import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Icon,
  IconButton,
  InputRightElement,
  Input,
  InputGroup,
  VStack
} from '@chakra-ui/react'

import { BsEye, BsEyeSlash, BsGoogle } from 'react-icons/bs'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import { useFormToast } from 'hooks/form-toast'

import { postAuthRegister } from 'services/auth'
import { getGoogleOauthUrl } from 'libs/oauth/google'

const initialValues = {
  full_name: '',
  email: '',
  phone_number: '+62',
  password: '',
  confirm_password: ''
}

const loginSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(3, 'Name is at least 3 characthers!')
    .required('Required'),
  email: Yup.string()
    .email('Please enter a valid email address!')
    .required('Required'),
  phone_number: Yup.string()
    .phone('id', 'Please enter a valid phone number')
    .min(8, 'Phone number is at least 8 digits')
    .min(8, 'Phone number is maximum 14 digits')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password is at least 8 characters!')
    .max(20, 'Password is maximum 20 characters!')
    .required('Required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required')
})

export default function RegisterForm() {
  const toast = useFormToast('register-form')

  const [showPassword, setShowPassword] = useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)

  const handleSubmit = async (values) => {
    toast.close()

    try {
      const res = await postAuthRegister(values)

      if (res && res.data.code === 200) {
        toast.send(
          'success',
          'Registration Successfull!',
          'Check your email to continue the registration process'
        )
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response?.status === 400) {
        title = 'Registration Failed!'
        message = err.response.data.error[0]

        switch (err.response.data.error[0]) {
          case 'email already exist':
            message = 'Email is already used on different account.'
            break
          case 'phone number already exist':
            message = 'Phone number is already used on different account.'
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
              isInvalid={touched.full_name && errors.full_name}
            >
              <FormLabel htmlFor='full_name'>Full Name</FormLabel>
              <Field
                as={Input}
                variant='white'
                id='full_name'
                name='full_name'
                type='text'
                placeholder='Enter your full name here...'
              />

              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

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
              isInvalid={touched.phone_number && errors.phone_number}
            >
              <FormLabel htmlFor='phone_number'>Phone Number</FormLabel>
              <Field
                as={Input}
                variant='white'
                id='phone_number'
                name='phone_number'
                type='text'
                placeholder='Enter your phone number here...'
              />

              <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
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
            </FormControl>

            <FormControl
              isRequired
              isInvalid={touched.confirm_password && errors.confirm_password}
            >
              <FormLabel htmlFor='confirm_password'>
                Password Confirmation
              </FormLabel>
              <Field
                as={Input}
                variant='white'
                id='confirm_password'
                name='confirm_password'
                type='password'
                placeholder='Re-enter your password here...'
              />
              <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
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
              Register
            </Button>

            <Divider />

            <NextLink
              href={getGoogleOauthUrl()}
              rel='noreferrer noopener'
              passHref
            >
              <Button
                colorScheme='gray'
                leftIcon={<Icon as={BsGoogle} />}
                w='full'
              >
                Sign Up with Google
              </Button>
            </NextLink>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
